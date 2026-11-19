import { Fragment } from "react";
import { AREAS, LESSON_COUNT } from "./content";
import { ArrowRightIcon } from "./icons";
import type { LandingActions } from "./types";

const TITLE_LINES = ["Entenda o braço", "da guitarra.", "De verdade."];

export function Hero({ onAuth, onNavigate }: LandingActions) {
  return (
    <section id="topo" className="mm-hero">
      <div className="mm-container mm-hero-inner">
        <div className="mm-hero-content">
          <div className="mm-hero-badge" data-anim="hero-fade">
            <span className="mm-hero-badge-count">{LESSON_COUNT} lições</span>
            Do iniciante ao avançado
          </div>

          <h1 className="mm-hero-title">
            {TITLE_LINES.map((line, i) => (
              <span key={line} className="mm-hero-line">
                <span
                  data-anim="hero-line"
                  style={i === TITLE_LINES.length - 1 ? { color: "var(--mm-blue)" } : undefined}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="mm-hero-lead" data-anim="hero-fade">
            Fundamentos, CAGED, escalas, harmonia funcional, blues e visualização das notas no
            braço — numa trilha só, no seu ritmo.
          </p>

          <div className="mm-hero-ctas" data-anim="hero-fade">
            <button type="button" className="mm-btn mm-btn-primary" onClick={() => onAuth("register")}>
              Começar a trilha
              <ArrowRightIcon />
            </button>
            <button type="button" className="mm-btn mm-btn-outline" onClick={() => onNavigate("pratique")}>
              Testar o braço interativo
            </button>
          </div>

          <div className="mm-hero-areas" data-anim="hero-fade">
            {AREAS.map((area, i) => (
              <Fragment key={area}>
                {i > 0 && <span className="mm-sep">/</span>}
                <span>{area}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
