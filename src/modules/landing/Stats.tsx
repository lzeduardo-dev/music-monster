import { useRef } from "react";
import { STATS } from "./content";
import { gsap, onceInView, useGSAP, withMotion } from "./gsap";

export function Stats() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const counter = { value: 0 };
          gsap.to(counter, {
            value: end,
            duration: 1.8,
            ease: "power2.out",
            onStart: () => {
              el.textContent = "0";
            },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
            onComplete: () => {
              el.textContent = String(end);
            },
            ...onceInView(el, "top 92%"),
          });
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="mm-container" style={{ paddingTop: 88, paddingBottom: 24 }}>
      <div className="mm-stats" data-anim="stagger">
        {STATS.map((stat) => (
          <div key={stat.label} className="mm-stat">
            <div className="mm-stat-value">
              <span data-count={stat.value}>{stat.value}</span>
            </div>
            <div className="mm-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
