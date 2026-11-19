export interface Stat {
  value: number;
  label: string;
}

export interface TrailStep {
  title: string;
  description: string;
  topics: string[];
}

export interface HowStep {
  title: string;
  description: string;
}

export const LESSON_COUNT = 131;

export const AREAS = ["Teoria", "Domínio", "Ferramentas", "Vocabulário", "Treino"];

export const TOPICS = [
  "Fundamentos",
  "Ciclo das Quintas",
  "Harmonia",
  "Harmonia Funcional",
  "Figuras Rítmicas",
  "Escalas",
  "Sistema CAGED",
  "Padrões na Pentatônica",
  "Arpejos",
  "Escalas Avançadas",
  "Modos Gregos",
  "Blues",
];

export const STATS: Stat[] = [
  { value: LESSON_COUNT, label: "lições na trilha completa" },
  { value: 5, label: "áreas, da teoria ao treino" },
  { value: 12, label: "tonalidades no ciclo das quintas" },
  { value: 7, label: "modos gregos para explorar" },
];

export const TRAIL: TrailStep[] = [
  {
    title: "Teoria Musical",
    description:
      "Som, escala maior, intervalos e a fórmula T-T-st-T-T-T-st. Depois, o mapa da harmonia.",
    topics: ["Fundamentos", "Ciclo das Quintas", "Harmonia", "Harmonia Funcional", "Figuras Rítmicas"],
  },
  {
    title: "Domínio",
    description:
      "Escalas, CAGED, pentatônica e arpejos aplicados direto no braço, até os modos gregos.",
    topics: ["Escalas", "Sistema CAGED", "Padrões na Pentatônica", "Arpejos", "Escalas Avançadas", "Modos Gregos"],
  },
  {
    title: "Ferramentas",
    description: "Recursos práticos para consultar e apoiar o estudo no dia a dia.",
    topics: ["Braço da Guitarra", "Máquina de Acordes", "Lab Auditivo"],
  },
  {
    title: "Vocabulário",
    description: "Frases e linguagem para transformar teoria em música de verdade.",
    topics: ["Vocabulário de Licks", "Clichês do Blues"],
  },
  {
    title: "Treino",
    description: "Prática guiada para fixar o que você aprendeu e ganhar velocidade no braço.",
    topics: ["Laboratório de Improviso", "Quiz Musical"],
  },
];

export const HOW_STEPS: HowStep[] = [
  {
    title: "Crie sua conta",
    description: "Entre e comece pelos Fundamentos — ou pule direto para onde você já está.",
  },
  {
    title: "Siga a trilha",
    description: "Lições curtas e visuais, com as notas desenhadas no braço da guitarra.",
  },
  {
    title: "Marque e evolua",
    description: "Conclua lições, veja seu progresso crescer e volte sempre de onde parou.",
  },
];

export function padIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}
