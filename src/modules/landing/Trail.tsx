import { useRef } from "react";
import { TRAIL, padIndex } from "./content";
import { gsap, useGSAP, withMotion } from "./gsap";

export function Trail() {
  const trailRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    withMotion(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: trailRef.current, start: "top 70%", end: "bottom 55%", scrub: 0.6 },
        },
      );
    });
  });

  return (
    <section id="trilha" className="mm-container" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="mm-section-head" data-anim="reveal" style={{ marginBottom: 64 }}>
        <div style={{ maxWidth: 680 }}>
          <div className="mm-eyebrow">A trilha</div>
          <h2 className="mm-section-title">Do primeiro intervalo ao modo lídio, em ordem.</h2>
        </div>
        <p className="mm-section-aside" style={{ maxWidth: 380 }}>
          Cada etapa prepara a próxima. Você sempre sabe o que estudar a seguir.
        </p>
      </div>

      <div ref={trailRef} className="mm-trail">
        <div className="mm-trail-rail" />
        <div ref={progressRef} className="mm-trail-progress" />

        <ol className="mm-trail-list">
          {TRAIL.map((step, i) => (
            <li key={step.title} className="mm-trail-step" data-anim="reveal">
              <div className="mm-trail-num" aria-hidden="true">
                {padIndex(i)}
              </div>
              <div className="mm-trail-card">
                <div style={{ flex: "1 1 320px" }}>
                  <h3>{step.title}</h3>
                  <p className="mm-body">{step.description}</p>
                </div>
                <div className="mm-chips">
                  {step.topics.map((topic) => (
                    <span key={topic} className="mm-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
