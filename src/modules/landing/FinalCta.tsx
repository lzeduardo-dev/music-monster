import { useRef } from "react";
import { gsap, useGSAP, withMotion } from "./gsap";
import { ArrowRightIcon } from "./icons";
import type { AuthMode } from "./types";

const EQ_BARS = 32;

export function FinalCta({ onAuth }: { onAuth: (mode: AuthMode) => void }) {
  const eqRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap.utils.toArray<HTMLElement>("span").forEach((bar, i) => {
          gsap.fromTo(
            bar,
            { scaleY: 0.15 },
            {
              scaleY: () => 0.25 + Math.random() * 0.75,
              duration: 0.45 + Math.random() * 0.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              repeatRefresh: true,
              delay: i * 0.03,
            },
          );
        });
      });
    },
    { scope: eqRef },
  );

  return (
    <section className="mm-container" style={{ maxWidth: 1000, paddingBottom: 96 }}>
      <div className="mm-cta" data-anim="reveal">
        <h2>Pronto para dominar o braço?</h2>
        <p>Comece pelos Fundamentos hoje e chegue aos modos gregos no seu ritmo.</p>
        <button type="button" className="mm-btn" onClick={() => onAuth("register")}>
          Começar agora
          <ArrowRightIcon strokeWidth={2.4} />
        </button>
        <div ref={eqRef} className="mm-eq" aria-hidden="true">
          {Array.from({ length: EQ_BARS }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
