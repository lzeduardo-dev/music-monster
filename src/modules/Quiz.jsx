import { useState } from "react";
import { PageHeader } from "../components/Common.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

// ── Question bank ───────────────────────────────────────────────────────────

const QUESTIONS = [
  // ── Fundamentos ────────────────────────────────────────────────────────
  {
    id: "f1",
    category: "Fundamentos",
    q: "Quantos semitons existem em uma oitava completa?",
    options: ["6", "8", "12", "24"],
    correct: 2,
    explanation:
      "A oitava divide-se em 12 semitons iguais no sistema temperado ocidental (12-TET).",
  },
  {
    id: "f2",
    category: "Fundamentos",
    q: "Qual é a fórmula de tons e semitons da escala maior?",
    options: [
      "T-st-T-T-st-T-T",
      "T-T-st-T-T-T-st",
      "T-T-T-st-T-T-st",
      "st-T-T-T-st-T-T",
    ],
    correct: 1,
    explanation:
      "T-T-st-T-T-T-st define os intervalos entre graus consecutivos da escala maior (jônica).",
  },
  {
    id: "f3",
    category: "Fundamentos",
    q: "Qual intervalo equivale a 6 semitons — metade de uma oitava?",
    options: ["Quarta justa", "Quinta justa", "Trítono", "Sexta menor"],
    correct: 2,
    explanation:
      "O trítono (4ª aumentada = 5ª diminuta) tem exatamente 6 semitons e divide a oitava ao meio.",
  },
  {
    id: "f4",
    category: "Fundamentos",
    q: "Quantas notas distintas possui a escala maior diatônica?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    explanation:
      "A escala maior tem 7 notas (o 8º grau é a fundamental uma oitava acima).",
  },
  {
    id: "f5",
    category: "Fundamentos",
    q: "Qual nota está a uma terça maior (4 semitons) acima de C?",
    options: ["D", "Eb", "E", "F"],
    correct: 2,
    explanation: "Terça maior = 4 semitons. C(0) + 4 = E(4). C→C#→D→D#→E.",
  },
  {
    id: "f6",
    category: "Fundamentos",
    q: "Quantos sustenidos tem a escala de G maior?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    explanation:
      "G maior tem 1 sustenido: F#. Segue a ordem F-C-G-D-A-E-B dos sustenidos.",
  },
  {
    id: "f7",
    category: "Fundamentos",
    q: "Quantos semitons tem uma terça menor?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    explanation:
      "Terça menor = 3 semitons. Terça maior = 4 semitons. A diferença de 1 semitom define maior vs. menor.",
  },
  {
    id: "f8",
    category: "Fundamentos",
    q: "Qual intervalo tem exatamente 7 semitons?",
    options: ["Quarta justa", "Trítono", "Quinta justa", "Sexta maior"],
    correct: 2,
    explanation:
      "A quinta justa tem 7 semitons — o intervalo mais estável depois da oitava.",
  },
  {
    id: "f9",
    category: "Fundamentos",
    q: "Na escala de C maior, qual é a nota do 7º grau?",
    options: ["A", "Bb", "B", "G#"],
    correct: 2,
    explanation:
      "C-D-E-F-G-A-B. O 7º grau é B (Si) — a sensível, a 1 semitom da tônica.",
  },
  {
    id: "f10",
    category: "Fundamentos",
    q: "O que é um semitom na guitarra?",
    options: [
      "A distância entre duas casas separadas por uma corda",
      "A menor distância entre duas notas — equivale a 1 casa (fret)",
      "O equivalente a dois tons inteiros",
      "A distância entre a tônica e a dominante",
    ],
    correct: 1,
    explanation:
      "Semitom = menor intervalo no sistema temperado. Na guitarra, equivale a subir ou descer 1 casa em qualquer corda.",
  },

  // ── Harmonia ────────────────────────────────────────────────────────────
  {
    id: "h1",
    category: "Harmonia",
    q: "Qual é a fórmula de uma tríade maior?",
    options: ["1 – b3 – 5", "1 – 3 – 5", "1 – 3 – #5", "1 – b3 – b5"],
    correct: 1,
    explanation:
      "Tríade maior: fundamental (1), terça maior (3) e quinta justa (5).",
  },
  {
    id: "h2",
    category: "Harmonia",
    q: "O que diferencia uma tétrade de uma tríade?",
    options: ["Adiciona a 9ª", "Adiciona a 7ª", "Remove a 5ª", "Adiciona a 6ª"],
    correct: 1,
    explanation:
      "Tétrades somam a 7ª às tríades (1-3-5), criando acordes de quatro notas com mais cor harmônica.",
  },
  {
    id: "h3",
    category: "Harmonia",
    q: "Qual é a fórmula do acorde diminuto (tríade)?",
    options: ["1 – b3 – 5", "1 – 3 – b5", "1 – b3 – b5", "1 – 3 – #5"],
    correct: 2,
    explanation:
      "Acorde diminuto: terça menor (b3) + quinta diminuta (b5) = 1-b3-b5.",
  },
  {
    id: "h4",
    category: "Harmonia",
    q: "Em C maior, qual é o acorde do IV grau?",
    options: ["Dm", "Em", "F", "G"],
    correct: 2,
    explanation:
      "O IV grau de C maior é F (Fá) — acorde maior com função subdominante.",
  },
  {
    id: "h5",
    category: "Harmonia",
    q: "O acorde XM7 contém qual tipo de sétima?",
    options: [
      "7ª menor (b7)",
      "7ª maior (7M)",
      "7ª diminuta (bb7)",
      "6ª maior",
    ],
    correct: 1,
    explanation:
      "XM7 = 1-3-5-7M. A sétima maior fica a 11 semitons da fundamental.",
  },
  {
    id: "h6",
    category: "Harmonia",
    q: "Qual fórmula descreve um acorde dominante (X7)?",
    options: [
      "1 – 3 – 5 – 7M",
      "1 – 3 – 5 – b7",
      "1 – b3 – 5 – b7",
      "1 – 3 – #5 – b7",
    ],
    correct: 1,
    explanation:
      "X7 (dominante) = 1-3-5-b7. A b7 cria a tensão característica que pede resolução para a tônica.",
  },
  {
    id: "h7",
    category: "Harmonia",
    q: "Qual é a qualidade do II grau na escala maior?",
    options: ["Maior", "Menor", "Diminuto", "Aumentado"],
    correct: 1,
    explanation:
      "Na escala maior: I, IV, V = maiores; II, III, VI = menores; VII = diminuto.",
  },
  {
    id: "h8",
    category: "Harmonia",
    q: "Uma tríade com a 3ª no baixo está em qual inversão?",
    options: [
      "Estado fundamental",
      "1ª inversão",
      "2ª inversão",
      "3ª inversão",
    ],
    correct: 1,
    explanation:
      "1ª inversão = 3ª no baixo. Fundamental no baixo = estado fundamental. 5ª no baixo = 2ª inversão.",
  },
  {
    id: "h9",
    category: "Harmonia",
    q: "Em C maior, quantos acordes são maiores?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    explanation:
      "I (C), IV (F) e V (G) são maiores — 3 no total. II, III, VI são menores; VII é diminuto.",
  },
  {
    id: "h10",
    category: "Harmonia",
    q: "O acorde Xm7b5 é também conhecido como:",
    options: [
      "Aumentado com 7ª",
      "Meio-diminuto",
      "Super-diminuto",
      "Suspenso",
    ],
    correct: 1,
    explanation:
      'Xm7b5 (1-b3-b5-b7) = "meio-diminuto" — quinta diminuta mas sétima menor (não bb7 como no X°7).',
  },
  {
    id: "h11",
    category: "Harmonia",
    q: "Em qual grau da escala maior aparece o acorde diminuto?",
    options: ["III", "V", "VI", "VII"],
    correct: 3,
    explanation:
      "O VII grau da escala maior é sempre diminuto (ex.: Bdim em C maior).",
  },
  {
    id: "h12",
    category: "Harmonia",
    q: "A fórmula do acorde X°7 (diminuto com 7ª) é:",
    options: [
      "1 – b3 – b5 – b7",
      "1 – b3 – b5 – bb7",
      "1 – 3 – b5 – b7",
      "1 – b3 – b5 – 7M",
    ],
    correct: 1,
    explanation:
      "X°7 = 1-b3-b5-bb7. Intervalos de terça menor simétricos — por isso tem 4 nomes enarmônicos.",
  },

  // ── Harmonia Funcional ───────────────────────────────────────────────────
  {
    id: "hf1",
    category: "Harmonia Funcional",
    q: "Qual é a função harmônica do V grau?",
    options: ["Tônica", "Subdominante", "Dominante", "Modal"],
    correct: 2,
    explanation:
      "V grau = função Dominante — cria máxima tensão que resolve para a Tônica (I).",
  },
  {
    id: "hf2",
    category: "Harmonia Funcional",
    q: "Na progressão II-V-I, o II grau tem função de:",
    options: ["Tônica", "Subdominante", "Dominante", "Ambígua"],
    correct: 1,
    explanation:
      "II grau = função Subdominante — prepara o V, que resolve para o I (cadência perfeita II-V-I).",
  },
  {
    id: "hf3",
    category: "Harmonia Funcional",
    q: "Em C maior, para onde G7 resolve naturalmente?",
    options: ["F", "Am", "C", "Dm"],
    correct: 2,
    explanation:
      "G7 é o V7 de C maior. A sensível B→C e a b7 F→E criam a resolução perfeita para C (tônica).",
  },
  {
    id: "hf4",
    category: "Harmonia Funcional",
    q: "A progressão I-IV-V-I é um exemplo de:",
    options: [
      "Cadência de engano",
      "Cadência plagal",
      "Cadência autêntica",
      "Cadência interrompida",
    ],
    correct: 2,
    explanation:
      "Cadência autêntica inclui a função dominante (V) resolvendo para a tônica (I).",
  },
  {
    id: "hf5",
    category: "Harmonia Funcional",
    q: 'O que é uma "cadência de engano"?',
    options: [
      "V resolve para I",
      "V resolve para vi",
      "IV resolve para I",
      "ii resolve para V",
    ],
    correct: 1,
    explanation:
      "Cadência de engano: V resolve para o vi (tônica relativa) em vez do I esperado — cria surpresa.",
  },
  {
    id: "hf6",
    category: "Harmonia Funcional",
    q: "Qual é a 7ª menor (b7) do acorde G7?",
    options: ["D", "E", "F", "A"],
    correct: 2,
    explanation:
      "G7 = G-B-D-F. O F é a b7. Junto com B (sensível), forma o trítono que resolve em C maior.",
  },

  // ── Escalas & Solos ──────────────────────────────────────────────────────
  {
    id: "es1",
    category: "Escalas",
    q: "Quantas notas tem a escala pentatônica?",
    options: ["4", "5", "6", "7"],
    correct: 1,
    explanation:
      '"Penta" = cinco. A pentatônica deriva da escala maior removendo o 4º e 7º graus.',
  },
  {
    id: "es2",
    category: "Escalas",
    q: "A pentatônica menor de A contém quais notas?",
    options: ["A-B-C-E-G", "A-C-D-E-G", "A-C-D-F-G", "A-B-D-E-G"],
    correct: 1,
    explanation:
      "Am pent: A-C-D-E-G (1-b3-4-5-b7). São as mesmas notas da pentatônica maior de C.",
  },
  {
    id: "es3",
    category: "Escalas",
    q: "O que diferencia a escala blues da pentatônica menor?",
    options: [
      "Adiciona a b2",
      "Adiciona a b5 (blue note)",
      "Remove a 5ª justa",
      "Adiciona a 7ª maior",
    ],
    correct: 1,
    explanation:
      'A escala blues (hexatônica) adiciona a b5 — a famosa "blue note" — à pentatônica menor.',
  },
  {
    id: "es4",
    category: "Escalas",
    q: "Quantas notas tem a escala blues?",
    options: ["5", "6", "7", "8"],
    correct: 1,
    explanation: "Blues é hexatônica — 6 notas (pentatônica menor + b5).",
  },
  {
    id: "es5",
    category: "Escalas",
    q: "A pentatônica maior é a escala maior sem quais graus?",
    options: ["3ª e 7ª", "4ª e 7ª", "2ª e 6ª", "4ª e 6ª"],
    correct: 1,
    explanation:
      "Pentatônica maior = 1-2-3-5-6. Remove o 4º e 7º graus da escala maior.",
  },
  {
    id: "es6",
    category: "Escalas",
    q: "A pentatônica de Am tem as mesmas notas que a pentatônica maior de:",
    options: ["G maior", "F maior", "C maior", "D maior"],
    correct: 2,
    explanation:
      "Am pent (A-C-D-E-G) = C major pent (C-D-E-G-A) — mesmas notas, tônica diferente. Escala relativa.",
  },

  // ── Arpejos ──────────────────────────────────────────────────────────────
  {
    id: "ar1",
    category: "Arpejos",
    q: "Qual arpejo tem a fórmula 1 – 3 – 5 – b7?",
    options: ["XM7", "X7 (Dominante)", "Xm7", "Xm7b5"],
    correct: 1,
    explanation:
      "X7 (dominante) = 1-3-5-b7. A terça maior + b7 criam o som característico de dominante.",
  },
  {
    id: "ar2",
    category: "Arpejos",
    q: "Em qual grau da escala maior aparece naturalmente o acorde Xm7b5?",
    options: ["II", "V", "VI", "VII"],
    correct: 3,
    explanation:
      'VII grau da escala maior = Xm7b5 (ex.: Bm7b5 em C maior). É o "ii" da tonalidade menor relativa.',
  },
  {
    id: "ar3",
    category: "Arpejos",
    q: "Qual arpejo tem intervalos de terça menor simétricos em todas as vozes?",
    options: ["XM7", "X7 Dominante", "Xm7", "X°7 (Diminuto)"],
    correct: 3,
    explanation:
      "X°7 = 1-b3-b5-bb7 — empilha quatro terças menores simétricas. Por isso tem 4 nomes enarmônicos.",
  },
  {
    id: "ar4",
    category: "Arpejos",
    q: "A fórmula do acorde Xm7 é:",
    options: ["1-3-5-b7", "1-b3-5-b7", "1-b3-b5-b7", "1-3-5-7M"],
    correct: 1,
    explanation:
      "Xm7 = 1-b3-5-b7. Terça menor (b3) + quinta justa (5) + sétima menor (b7).",
  },
  {
    id: "ar5",
    category: "Arpejos",
    q: "Qual arpejo é mais indicado sobre um acorde de tônica XM7?",
    options: ["X7", "XM7", "Xm7", "Xm7b5"],
    correct: 1,
    explanation:
      "O arpejo XM7 (1-3-5-7M) traça exatamente as notas do acorde de tônica com 7ª maior.",
  },

  // ── Sistema CAGED ────────────────────────────────────────────────────────
  {
    id: "ca1",
    category: "Sistema CAGED",
    q: "Quantas formas de acorde compõem o sistema CAGED?",
    options: ["4", "5", "6", "7"],
    correct: 1,
    explanation:
      "CAGED usa 5 formas baseadas nos acordes abertos de C, A, G, E e D.",
  },
  {
    id: "ca2",
    category: "Sistema CAGED",
    q: "O CAGED é baseado em quais acordes abertos?",
    options: [
      "E, A, D, G, B",
      "C, A, G, E, D",
      "C, D, E, F, G",
      "A, B, C, D, E",
    ],
    correct: 1,
    explanation:
      "CAGED = C, A, G, E, D — os 5 acordes maiores abertos mais comuns na guitarra.",
  },
  {
    id: "ca3",
    category: "Sistema CAGED",
    q: 'Na "E shape" com barra na 5ª casa, qual acorde maior se forma?',
    options: ["E", "A", "B", "G"],
    correct: 1,
    explanation:
      "E shape aberto = E maior. Barra na 5ª casa: E + 5 semitons = A maior.",
  },
  {
    id: "ca4",
    category: "Sistema CAGED",
    q: "Qual é a principal vantagem do sistema CAGED?",
    options: [
      "Permite tocar mais rápido",
      "Permite visualizar qualquer acorde em 5 posições pelo braço todo",
      "Facilita o uso do capotraste",
      "Simplifica a leitura de partitura",
    ],
    correct: 1,
    explanation:
      'CAGED mapeia o braço em 5 formas — você nunca fica "preso" em uma região do instrumento.',
  },
  {
    id: "ca5",
    category: "Sistema CAGED",
    q: 'Na "A shape" com barra na 3ª casa, qual acorde maior se forma?',
    options: ["A", "B", "C", "D"],
    correct: 2,
    explanation:
      "A shape aberto = A maior. Barra na 3ª casa: A + 3 semitons = C maior.",
  },

  // ── Técnicas ─────────────────────────────────────────────────────────────
  {
    id: "tec1",
    category: "Técnicas",
    q: 'O que são "chord tones" (notas de repouso)?',
    options: [
      "Notas fora da tonalidade que criam tensão",
      "As notas do acorde ativo — soam estáveis ao improvisar",
      "Notas exclusivas da escala pentatônica",
      "Notas usadas apenas na melodia",
    ],
    correct: 1,
    explanation:
      'Chord tones = 1, 3, 5, 7 do acorde ativo. São as "âncoras" melódicas durante o solo.',
  },
  {
    id: "tec2",
    category: "Técnicas",
    q: 'O que é uma "approach note"?',
    options: [
      "Uma nota muito grave no baixo",
      "Nota a meio-tom ou tom que resolve para uma chord tone",
      "Uma nota de ornamentação no agudo",
      "A fundamental do acorde",
    ],
    correct: 1,
    explanation:
      'Approach note: nota de aproximação (cromática ou diatônica) que "aponta" para uma nota do acorde.',
  },
  {
    id: "tec3",
    category: "Técnicas",
    q: 'No modo Jônico (escala maior), qual grau é considerado "avoid note"?',
    options: ["2º grau", "4º grau", "6º grau", "7º grau"],
    correct: 1,
    explanation:
      "O 4º grau forma trítono com a 7M — cria dissonância intensa sobre acordes Maj7 em repouso.",
  },
  {
    id: "tec4",
    category: "Técnicas",
    q: "Qual é a escala menor relativa de C maior?",
    options: ["G menor", "D menor", "A menor", "E menor"],
    correct: 2,
    explanation:
      "A menor relativa de C maior é A menor — ambas compartilham as mesmas 7 notas.",
  },
  {
    id: "tec5",
    category: "Técnicas",
    q: "Sobre um acorde X7 (dominante), qual nota cria conflito e deve ser evitada?",
    options: ["b7", "5ª justa", "3ª maior", "7ª maior (7M)"],
    correct: 3,
    explanation:
      "A 7M conflita com a b7 do acorde X7 — estão a apenas 1 semitom, causando batimento forte.",
  },

  // ── Escalas Avançadas / Modos ────────────────────────────────────────────
  {
    id: "ea1",
    category: "Escalas Avançadas",
    q: "Qual modo da menor harmônica é usado sobre V7 com tensões b9 e #5?",
    options: ["Lócrio ♮6", "Jônico #5", "Frígio Dominante", "Lídio #2"],
    correct: 2,
    explanation:
      "Frígio Dominante (V da menor harmônica): 1-b2-3-4-5-b6-b7. Dominante com b9 — sons flamenco/árabe.",
  },
  {
    id: "ea2",
    category: "Escalas Avançadas",
    q: 'A "escala alterada" (Super Lócrio) é qual modo da menor melódica?',
    options: ["IV modo", "V modo", "VI modo", "VII modo"],
    correct: 3,
    explanation:
      "Escala alterada = VII modo da menor melódica. Contém todas as tensões alteradas: b9, #9, b5, #5.",
  },
  {
    id: "ea3",
    category: "Escalas Avançadas",
    q: "O Lídio Dominante (IV da menor melódica) se distingue por ter:",
    options: ["b3 + b7", "#4 + b7", "#5 + 7M", "b2 + b7"],
    correct: 1,
    explanation:
      "Lídio Dominante = 1-2-3-#4-5-6-b7. Usado sobre X7#11 — som brilhante e suspenso.",
  },
  {
    id: "ea4",
    category: "Escalas Avançadas",
    q: "O que diferencia a menor harmônica da menor natural?",
    options: [
      "b3 em vez de 3",
      "7M em vez de b7",
      "#5 em vez de 5",
      "b6 em vez de 6",
    ],
    correct: 1,
    explanation:
      "Menor harmônica: eleva o 7º grau de b7 para 7M — cria sensível para a tônica, ideal para cadências V-i.",
  },
  {
    id: "ea5",
    category: "Escalas Avançadas",
    q: "O modo Dórico se distingue da escala menor natural por ter:",
    options: [
      "b6 em vez de 6",
      "6ª maior (natural) em vez de b6",
      "#7 em vez de b7",
      "b2 em vez de 2",
    ],
    correct: 1,
    explanation:
      'Dórico = menor natural com 6ª maior. Essa 6M é sua "assinatura" — som menos sombrio, mais "latino".',
  },
  {
    id: "ea6",
    category: "Escalas Avançadas",
    q: "O modo Mixolídio é idêntico à escala maior, exceto pelo:",
    options: [
      "#4 (4ª aumentada)",
      "b7 (sétima menor)",
      "b6 (6ª menor)",
      "b3 (3ª menor)",
    ],
    correct: 1,
    explanation:
      "Mixolídio = maior com b7. É o modo do V grau — blues, rock e funk amam esse som.",
  },
  {
    id: "ea7",
    category: "Escalas Avançadas",
    q: "Qual característica sonora define o modo Frígio?",
    options: [
      "Brilhante e eufórico, com #4",
      "Sombrio e ibérico — b2 e b6 criam o som de flamenco",
      "Neutro e suave como a escala maior",
      "Instável com b2 e b5 (similar ao Lócrio)",
    ],
    correct: 1,
    explanation:
      "Frígio tem b2, b3, b6, b7. A b2 cria o som característico do flamenco e da música árabe.",
  },
  {
    id: "ea8",
    category: "Escalas Avançadas",
    q: "O modo Lídio se diferencia do Jônico (maior) pelo:",
    options: ["b3", "b7", "#4", "#2"],
    correct: 2,
    explanation:
      'Lídio = maior com #4. Aquela 4ª aumentada cria o som "sonhador/fantástico" muito usado em trilhas.',
  },

  // ── Jazz & Blues ─────────────────────────────────────────────────────────
  {
    id: "jb1",
    category: "Jazz & Blues",
    q: "Quantos compassos tem o blues clássico?",
    options: ["8", "10", "12", "16"],
    correct: 2,
    explanation:
      "O blues de 12 compassos é a forma mais comum: 4 de I, 2 de IV, 2 de I, 2 de V-IV, 2 de I-V.",
  },
  {
    id: "jb2",
    category: "Jazz & Blues",
    q: 'O que é um "turnaround" no blues?',
    options: [
      "O tema principal da música",
      "Os 2 últimos compassos que preparam o retorno ao início",
      "O solo de guitarra obrigatório",
      "A variação harmônica do meio da forma",
    ],
    correct: 1,
    explanation:
      'Turnaround: compassos 11-12 do blues (geralmente I-V ou variações) que "viram" o ciclo de volta.',
  },
  {
    id: "jb3",
    category: "Jazz & Blues",
    q: "Por que o blues usa X7 mesmo no I grau, que teoricamente seria XM7?",
    options: [
      "Por causa de substituição de trítono",
      "Para criar tensão em direção ao IV",
      "Tradição da música africana — mistura natural de escala maior e menor (blue notes)",
      "Para facilitar o solo na pentatônica menor",
    ],
    correct: 2,
    explanation:
      'O blues nasceu da sobreposição de tradições africanas com harmonia europeia. As "blue notes" são expressivamente essenciais.',
  },
  {
    id: "jb4",
    category: "Jazz & Blues",
    q: "O jazz blues adiciona ao blues tradicional principalmente:",
    options: [
      "Mais compassos na forma",
      "Progressões ii-V-I e rearmônizações sofisticadas",
      "Pentatônicas diferentes em cada grau",
      "Linhas de baixo walking exclusivas",
    ],
    correct: 1,
    explanation:
      "Jazz blues incorpora II-V-I, tritone subs e dominantes secundários — enriquece sem perder o caráter do blues.",
  },
  {
    id: "jb5",
    category: "Jazz & Blues",
    q: "Qual escala é mais associada ao solo sobre I7 no blues?",
    options: [
      "Escala maior do I",
      "Modo Lídio",
      "Pentatônica menor + blue note",
      "Escala alterada",
    ],
    correct: 2,
    explanation:
      'A pentatônica menor com a blue note (b5) é a "língua-mãe" do blues — funciona sobre I7, IV7 e V7.',
  },

  // ── Tétrades & Voicings ──────────────────────────────────────────────────
  {
    id: "tv1",
    category: "Tétrades & Voicings",
    q: 'O que é um voicing "Drop 2"?',
    options: [
      "Remove duas notas do acorde fechado",
      "A 2ª voz mais aguda de um voicing fechado desce uma oitava",
      "As 2 vozes mais graves descem uma oitava",
      "Um voicing com apenas 2 notas (diádico)",
    ],
    correct: 1,
    explanation:
      "Drop 2: a 2ª nota mais aguda do voicing fechado baixa uma oitava — abre o espaço entre as vozes.",
  },
  {
    id: "tv2",
    category: "Tétrades & Voicings",
    q: "Quantas inversões tem uma tétrade (4 notas)?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    explanation:
      "Uma tétrade tem 4 inversões: estado fundamental + 1ª, 2ª e 3ª inversões (cada nota como baixo).",
  },
  {
    id: "tv3",
    category: "Tétrades & Voicings",
    q: "No Drop 2 para guitarra, em qual conjunto de cordas é mais usado?",
    options: ["E-A-D-G", "A-D-G-B", "D-G-B-e", "Apenas em cordas soltas"],
    correct: 2,
    explanation:
      "Drop 2 em D-G-B-e é o padrão do jazz — produz 4 posições distintas cobrindo toda a extensão do braço.",
  },
  {
    id: "tv4",
    category: "Tétrades & Voicings",
    q: "Qual é a diferença entre Drop 2 e Drop 3?",
    options: [
      "Drop 2 abaixa as 2 vozes do meio; Drop 3 abaixa 3 vozes",
      "Drop 2 abaixa a 2ª voz mais aguda; Drop 3 abaixa a 3ª voz mais aguda",
      "São nomes diferentes para o mesmo voicing",
      "Drop 3 é usado apenas em cordas soltas",
    ],
    correct: 1,
    explanation:
      "Drop 2: 2ª nota mais aguda → oitava abaixo. Drop 3: 3ª nota mais aguda → oitava abaixo. Layouts distintos.",
  },
];

const ALL_CATEGORIES = ["Todos", ...new Set(QUESTIONS.map((q) => q.category))];
const QUIZ_SIZE = 20;

// ── Helper components ───────────────────────────────────────────────────────

function ProgressBar({ value, max }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      style={{
        background: "var(--ink-08)",
        borderRadius: 999,
        height: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg,#3b82f6,#a78bfa)",
          borderRadius: 999,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function OptionBtn({ text, state, onClick }) {
  const styles = {
    default: {
      bg: "var(--ink-05)",
      border: "var(--ink-10)",
      color: "var(--text-base)",
    },
    correct: {
      bg: "rgba(99,102,241,0.18)",
      border: "#6366f1",
      color: "#c7d2fe",
    },
    wrong: { bg: "rgba(236,72,153,0.15)", border: "#ec4899", color: "#fbcfe8" },
    reveal: {
      bg: "rgba(99,102,241,0.07)",
      border: "rgba(99,102,241,0.35)",
      color: "#818cf8",
    },
    dimmed: {
      bg: "var(--ink-03)",
      border: "var(--ink-05)",
      color: "var(--text-ultra)",
    },
  };
  const s = styles[state] ?? styles.default;
  const icon = state === "correct" ? "✓ " : state === "wrong" ? "✗ " : "";
  return (
    <button
      onClick={onClick}
      disabled={state !== "default"}
      style={{
        width: "100%",
        padding: "13px 16px",
        borderRadius: 10,
        textAlign: "left",
        cursor: state === "default" ? "pointer" : "default",
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        color: s.color,
        fontSize: 14,
        fontWeight: 500,
        transition: "all 0.15s",
      }}
    >
      {icon}
      {text}
    </button>
  );
}

// ── Start screen ────────────────────────────────────────────────────────────

function StartScreen({ category, setCategory, onStart }) {
  return (
    <div>
      <PageHeader
        chip="Quiz"
        title="Quiz Musical"
        description="Teste seus conhecimentos em todos os módulos — Fundamentos, Harmonia, Modos, Blues, CAGED e mais."
      />

      <div className="card p-6 md:p-8 mb-6">
        <h2
          className="text-lg font-bold mb-4"
          style={{ color: "var(--text-base)" }}
        >
          Escolha uma categoria
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: category === cat ? "#2563eb" : "var(--ink-05)",
                color: category === cat ? "#fff" : "var(--text-muted)",
                border:
                  category === cat
                    ? "1px solid #2563eb"
                    : "1px solid transparent",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="mt-6 p-4 card"
          style={{ background: "rgba(59,130,246,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="font-semibold"
                style={{ color: "var(--text-base)" }}
              >
                {category === "Todos"
                  ? `${Math.min(
                      QUIZ_SIZE,
                      QUESTIONS.length
                    )} questões aleatórias`
                  : `${
                      QUESTIONS.filter((q) => q.category === category).length
                    } questões — ${category}`}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-ultra)" }}
              >
                {category === "Todos"
                  ? `Banco com ${QUESTIONS.length} questões cobrindo todos os módulos`
                  : "Todas as questões desta categoria serão exibidas"}
              </div>
            </div>
            <button
              onClick={onStart}
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap" }}
            >
              Iniciar Quiz →
            </button>
          </div>
        </div>
      </div>

      {/* Category grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 10,
        }}
      >
        {ALL_CATEGORIES.filter((c) => c !== "Todos").map((cat) => {
          const count = QUESTIONS.filter((q) => q.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
              }}
              className="card p-4 text-left hover:-translate-y-0.5 transition-transform"
              style={{ cursor: "pointer" }}
            >
              <div
                className="font-semibold text-sm"
                style={{ color: "var(--text-base)" }}
              >
                {cat}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-ultra)" }}
              >
                {count} questões
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Results screen ──────────────────────────────────────────────────────────

function ResultsScreen({ questions, answers, score, onRetry, onNewCategory }) {
  const pct = Math.round((score / questions.length) * 100);
  const msg =
    pct >= 80
      ? { text: "Excelente! Você domina o conteúdo.", color: "#6366f1" }
      : pct >= 60
      ? { text: "Muito bem! Continue praticando.", color: "#a78bfa" }
      : { text: "Continue estudando — revise os módulos!", color: "#f472b6" };

  // Category breakdown
  const breakdown = {};
  questions.forEach((q, i) => {
    if (!breakdown[q.category])
      breakdown[q.category] = { total: 0, correct: 0 };
    breakdown[q.category].total++;
    if (answers[i] === q.correct) breakdown[q.category].correct++;
  });

  return (
    <div>
      <PageHeader chip="Resultado" title="Quiz concluído!" description="" />

      <div className="card p-8 mb-6 text-center">
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: msg.color,
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
        <div
          className="text-lg mt-2 font-semibold"
          style={{ color: "var(--text-base)" }}
        >
          {score} corretas de {questions.length}
        </div>
        <div
          className="mt-3 text-sm"
          style={{ color: msg.color, fontWeight: 600 }}
        >
          {msg.text}
        </div>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button onClick={onRetry} className="btn btn-primary">
            ↻ Tentar novamente
          </button>
          <button
            onClick={onNewCategory}
            className="btn btn-ghost"
            style={{ color: "var(--text-base)" }}
          >
            Mudar categoria
          </button>
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h2
          className="text-lg font-bold mb-3"
          style={{ color: "var(--text-base)" }}
        >
          Resultado por categoria
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
            gap: 10,
          }}
        >
          {Object.entries(breakdown).map(([cat, { total, correct }]) => {
            const p = Math.round((correct / total) * 100);
            const color = p >= 80 ? "#6366f1" : p >= 60 ? "#a78bfa" : "#f472b6";
            return (
              <div key={cat} className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-base)" }}
                  >
                    {cat}
                  </span>
                  <span className="text-xs font-bold" style={{ color }}>
                    {correct}/{total}
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--ink-08)",
                    borderRadius: 999,
                    height: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${p}%`,
                      height: "100%",
                      background: color,
                      borderRadius: 999,
                      transition: "width 0.5s",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mistake review */}
      {answers.some((a, i) => a !== questions[i].correct) && (
        <div className="mt-8">
          <h2
            className="text-lg font-bold mb-3"
            style={{ color: "var(--text-base)" }}
          >
            Revise os erros
          </h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              if (answers[i] === q.correct) return null;
              return (
                <div key={q.id} className="card p-4">
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    {q.category}
                  </div>
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "var(--text-base)" }}
                  >
                    {q.q}
                  </div>
                  <div className="text-sm mb-1" style={{ color: "#f472b6" }}>
                    Sua resposta: <strong>{q.options[answers[i]]}</strong>
                  </div>
                  <div className="text-sm mb-2" style={{ color: "#a5b4fc" }}>
                    Resposta correta: <strong>{q.options[q.correct]}</strong>
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--text-muted)",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: 8,
                    }}
                  >
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Quiz() {
  const [phase, setPhase] = useState("start");
  const [category, setCategory] = useState("Todos");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const { markLesson } = useProgress();

  const startQuiz = (cat = category) => {
    setCategory(cat);
    const pool =
      cat === "Todos" ? QUESTIONS : QUESTIONS.filter((q) => q.category === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length));
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setScore(0);
    setPhase("quiz");
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setAnswers((prev) => [...prev, idx]);
    if (idx === questions[current].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      markLesson("quiz", "completed");
      setPhase("done");
    }
  };

  if (phase === "start") {
    return (
      <StartScreen
        category={category}
        setCategory={setCategory}
        onStart={() => startQuiz(category)}
      />
    );
  }

  if (phase === "done") {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        score={score}
        onRetry={() => startQuiz(category)}
        onNewCategory={() => setPhase("start")}
      />
    );
  }

  const q = questions[current];

  const getOptionState = (i) => {
    if (!answered) return "default";
    if (i === q.correct) return "correct";
    if (i === selected) return "wrong";
    return "dimmed";
  };

  return (
    <div>
      <PageHeader chip="Quiz" title="Quiz Musical" description="" />

      {/* Progress bar */}
      <div className="card p-4 mb-5">
        <div
          className="flex justify-between text-xs mb-2"
          style={{ color: "var(--text-ultra)" }}
        >
          <span>
            Questão {current + 1} / {questions.length}
          </span>
          <span style={{ color: "#a5b4fc" }}>
            {score} certa{score !== 1 ? "s" : ""}
          </span>
        </div>
        <ProgressBar value={current} max={questions.length} />
      </div>

      {/* Question card */}
      <div className="card p-5 md:p-6 mb-4">
        <span
          className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
        >
          {q.category}
        </span>
        <h2
          className="text-lg md:text-xl font-bold leading-snug"
          style={{ color: "var(--text-base)" }}
        >
          {q.q}
        </h2>
      </div>

      {/* Options */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {q.options.map((opt, i) => (
          <OptionBtn
            key={i}
            text={opt}
            state={getOptionState(i)}
            onClick={() => handleAnswer(i)}
          />
        ))}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div
          className="card p-5"
          style={{
            borderColor:
              selected === q.correct
                ? "rgba(99,102,241,0.35)"
                : "rgba(236,72,153,0.35)",
          }}
        >
          <div
            className="font-bold mb-2"
            style={{
              color: selected === q.correct ? "#a5b4fc" : "#f9a8d4",
              fontSize: 15,
            }}
          >
            {selected === q.correct ? "✓ Correto!" : "✗ Incorreto"}
          </div>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {q.explanation}
          </p>
          <button onClick={handleNext} className="btn btn-primary">
            {current < questions.length - 1
              ? "Próxima questão →"
              : "Ver resultado →"}
          </button>
        </div>
      )}
    </div>
  );
}
