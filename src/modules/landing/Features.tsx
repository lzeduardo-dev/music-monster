import type { ComponentType } from "react";
import { LESSON_COUNT } from "./content";
import { ChartIcon, CircleIcon, GridIcon, ShapesIcon } from "./icons";

interface Feature {
  title: string;
  description: string;
  Icon: ComponentType;
}

const FEATURES: Feature[] = [
  {
    title: "Notas no braço",
    description: "Escalas, arpejos e intervalos desenhados direto no braço da guitarra.",
    Icon: GridIcon,
  },
  {
    title: "Sistema CAGED",
    description: "Cinco formas que conectam o braço inteiro, de ponta a ponta.",
    Icon: ShapesIcon,
  },
  {
    title: "Harmonia funcional",
    description: "Ciclo das quintas, campo harmônico e T / S / D aplicados ao pop e ao rock.",
    Icon: CircleIcon,
  },
  {
    title: "Progresso salvo",
    description: `Marque as ${LESSON_COUNT} lições, busque qualquer assunto e retome de onde parou.`,
    Icon: ChartIcon,
  },
];

export function Features() {
  return (
    <section id="recursos" className="mm-container" style={{ paddingTop: 80, paddingBottom: 120 }}>
      <div data-anim="reveal" style={{ maxWidth: 720, marginBottom: 56 }}>
        <div className="mm-eyebrow">Recursos</div>
        <h2 className="mm-section-title">Teoria que você vê. Não só lê.</h2>
      </div>

      <div className="mm-features" data-anim="stagger">
        {FEATURES.map(({ title, description, Icon }) => (
          <div key={title} className="mm-feature">
            <span className="mm-feature-icon">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p className="mm-body">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
