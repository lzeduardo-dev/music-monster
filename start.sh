#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  Harmony Hub — script de inicialização
#  Uso: ./start.sh
# ─────────────────────────────────────────────────────────────────────
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$ROOT_DIR/server"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo -e "${BLUE}  Harmony Hub${RESET}"
echo -e "  ${YELLOW}Educação Musical${RESET}"
echo ""

# ── Node.js check ────────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo "  Node.js não encontrado. Instale em: https://nodejs.org"
  exit 1
fi
NODE_VERSION=$(node -v)
echo -e "  Node ${GREEN}${NODE_VERSION}${RESET} detectado."

# ── Install frontend deps if needed ──────────────────────────────────
if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo ""
  echo "  Instalando dependências do frontend..."
  cd "$ROOT_DIR" && npm install
fi

# ── Install server deps if needed ────────────────────────────────────
if [ ! -d "$SERVER_DIR/node_modules" ]; then
  echo ""
  echo "  Instalando dependências do servidor..."
  cd "$SERVER_DIR" && npm install
fi

# ── Create server/.env if missing ────────────────────────────────────
if [ ! -f "$SERVER_DIR/.env" ]; then
  echo ""
  echo "  Criando server/.env com valores padrão..."
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  cat > "$SERVER_DIR/.env" << EOF
PORT=3002
NODE_ENV=development
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:5176
EOF
  echo -e "  ${GREEN}server/.env criado.${RESET}"
fi

# ── Start both servers ────────────────────────────────────────────────
echo ""
echo -e "  ${GREEN}Iniciando servidores...${RESET}"
echo "  Backend  → http://localhost:3002"
echo "  Frontend → http://localhost:5176"
echo ""
echo "  Pressione Ctrl+C para parar."
echo ""

cd "$ROOT_DIR"
npm run dev:all
