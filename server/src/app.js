import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import { initDb } from "./db/index.js";
import authRouter from "./routes/auth.js";
import progressRouter from "./routes/progress.js";
import aiRouter from "./routes/ai.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
const PORT = process.env.PORT ?? 3002;
const isDev = process.env.NODE_ENV !== "production";

// Atrás de um reverse proxy (Railway, Render, Fly, Nginx…), o Express
// precisa confiar no primeiro hop pra rate-limit contar por IP real.
app.set("trust proxy", 1);

// ── Security headers ──────────────────────────────────────────────────
app.use(helmet());

// Bloqueia HTTP Parameter Pollution (?email=a&email=b).
app.use(hpp());

// ── CORS ──────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5176")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin requests (e.g., Postman) in dev; enforce in prod
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed.`));
    },
    credentials: true,
  })
);

// ── Body parsing + cookies ────────────────────────────────────────────
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────────────────────────────
app.use(morgan(isDev ? "dev" : "combined"));

// ── Rate limiting ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em alguns minutos." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas de login. Aguarde 15 minutos." },
});

app.use(globalLimiter);

// ── Health check ──────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: Date.now() });
});

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/progress", progressRouter);
app.use("/api/ai", aiRouter);

// ── Error handling ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `[server] Harmony Hub API running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("[server] Failed to initialize database:", err);
    process.exit(1);
  });
