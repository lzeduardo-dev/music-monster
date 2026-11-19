import { useMemo, useRef, useState } from "react";
import {
  FRET_COUNT,
  INLAY_FRETS,
  KEYS,
  LABEL_MODES,
  SCALES,
  TUNING,
  buildFretMap,
  spell,
  type FretNote,
  type KeyId,
  type LabelMode,
  type ScaleId,
} from "./fretboard";
import { gsap, prefersMotion, useGSAP } from "./gsap";

const FRETS = Array.from({ length: FRET_COUNT }, (_, i) => i + 1);

interface OptionGroupProps<T extends string> {
  legend: string;
  options: { id: T; name: string }[];
  value: T;
  onChange: (value: T) => void;
  dark?: boolean;
}

function OptionGroup<T extends string>({ legend, options, value, onChange, dark }: OptionGroupProps<T>) {
  return (
    <fieldset className="mm-fb-group">
      <legend>{legend}</legend>
      <div className="mm-fb-options">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={dark ? "mm-fb-option is-dark" : "mm-fb-option"}
            aria-pressed={value === opt.id}
            onClick={() => onChange(opt.id)}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function NoteDot({ note, mode }: { note?: FretNote; mode: LabelMode }) {
  if (!note) return null;
  return (
    <span className={note.isRoot ? "mm-fb-dot is-root" : "mm-fb-dot"}>
      {mode === "interval" ? note.interval : note.note}
    </span>
  );
}

export function FretboardDemo() {
  const [keyId, setKeyId] = useState<KeyId>("A");
  const [scaleId, setScaleId] = useState<ScaleId>("pentm");
  const [mode, setMode] = useState<LabelMode>("note");
  const boardRef = useRef<HTMLDivElement>(null);
  const animateNext = useRef(false);

  const key = KEYS.find((k) => k.id === keyId)!;
  const scale = SCALES.find((s) => s.id === scaleId)!;
  const fretMap = useMemo(() => buildFretMap(key, scale), [key, scale]);

  const select =
    <T,>(setter: (v: T) => void) =>
    (value: T) => {
      animateNext.current = true;
      setter(value);
    };

  useGSAP(
    () => {
      if (!animateNext.current || !prefersMotion()) return;
      animateNext.current = false;
      gsap.fromTo(
        ".mm-fb-dot",
        { scale: 0.3, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: { each: 0.01 },
          clearProps: "opacity,transform,visibility",
        },
      );
    },
    { scope: boardRef, dependencies: [keyId, scaleId, mode] },
  );

  return (
    <section id="pratique" className="mm-practice">
      <div className="mm-container" style={{ paddingTop: 112, paddingBottom: 112 }}>
        <div className="mm-section-head" data-anim="reveal" style={{ marginBottom: 40 }}>
          <div style={{ maxWidth: 640 }}>
            <div className="mm-eyebrow">Pratique agora</div>
            <h2 className="mm-section-title">Escolha um tom. Veja a escala no braço.</h2>
          </div>
          <p className="mm-section-aside" style={{ maxWidth: 360 }}>
            Um gostinho do que você encontra lá dentro. Troque o tom, a escala e o que aparece nas
            notas.
          </p>
        </div>

        <div className="mm-fb-card" data-anim="reveal">
          <div className="mm-fb-controls">
            <OptionGroup
              legend="Tom"
              options={KEYS.map((k) => ({ id: k.id, name: k.id }))}
              value={keyId}
              onChange={select(setKeyId)}
            />
            <OptionGroup legend="Escala" options={SCALES} value={scaleId} onChange={select(setScaleId)} />
            <OptionGroup legend="Mostrar" options={LABEL_MODES} value={mode} onChange={select(setMode)} dark />
          </div>

          <div className="mm-fb-summary" aria-live="polite">
            <div className="mm-fb-title">{scale.title(key.name)}</div>
            <div className="mm-fb-meta">
              <span>
                Notas:{" "}
                <strong style={{ color: "var(--mm-blue)" }}>
                  {scale.degrees.map((d) => spell(key, d.semitones, d.degree)).join(" – ")}
                </strong>
              </span>
              <span>
                Fórmula:{" "}
                <strong style={{ color: "var(--mm-ink)" }}>
                  {scale.degrees.map((d) => d.interval).join(" – ")}
                </strong>
              </span>
            </div>
          </div>

          <div className="mm-fb-scroll">
            <div ref={boardRef} className="mm-fb-board">
              {TUNING.map((string, si) => (
                <div key={si} className="mm-fb-row">
                  <div className="mm-fb-string-name">{string.name}</div>
                  <div className="mm-fb-string">
                    <div className="mm-fb-cell is-open">
                      <NoteDot note={fretMap.get(string.pitchClass)} mode={mode} />
                    </div>
                    {FRETS.map((fret) => (
                      <div key={fret} className="mm-fb-cell">
                        <NoteDot note={fretMap.get((string.pitchClass + fret) % 12)} mode={mode} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mm-fb-frets" aria-hidden="true">
                <div style={{ width: 16 }} />
                <div className="mm-fb-fret" style={{ flex: "none", width: 52 }}>
                  0
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  {FRETS.map((fret) => (
                    <div key={fret} className="mm-fb-fret">
                      {fret}
                      {INLAY_FRETS.has(fret) && <span className="mm-fb-inlay" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mm-fb-legend">
            <span>
              <span className="mm-fb-swatch" style={{ background: "var(--mm-ink)" }} />
              Tônica
            </span>
            <span>
              <span className="mm-fb-swatch" style={{ background: "var(--mm-blue)" }} />
              Notas da escala
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
