import { useRef } from "react";
import { TOPICS } from "./content";
import { gsap, useGSAP, withMotion } from "./gsap";

function TopicGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="mm-marquee-group" aria-hidden={hidden || undefined}>
      {TOPICS.map((topic) => (
        <div key={topic} className="mm-marquee-item">
          {topic}
          <span className="mm-marquee-dot" />
        </div>
      ))}
    </div>
  );
}

export function TopicsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    withMotion(() => {
      // Two identical groups: sliding by half the track loops seamlessly.
      gsap.to(trackRef.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    });
  });

  return (
    <section className="mm-marquee" aria-label="Tópicos">
      <div ref={trackRef} className="mm-marquee-track">
        <TopicGroup />
        <TopicGroup hidden />
      </div>
    </section>
  );
}
