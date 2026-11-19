import { HOW_STEPS, padIndex } from "./content";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mm-container" style={{ paddingTop: 120, paddingBottom: 120 }}>
      <div data-anim="reveal" style={{ maxWidth: 680, marginBottom: 56 }}>
        <div className="mm-eyebrow">Como funciona</div>
        <h2 className="mm-section-title">Três passos. Nenhuma enrolação.</h2>
      </div>

      <div className="mm-steps" data-anim="stagger">
        {HOW_STEPS.map((step, i) => (
          <div key={step.title} className="mm-step">
            <span className="mm-step-num">{padIndex(i)}</span>
            <h3>{step.title}</h3>
            <p className="mm-body">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
