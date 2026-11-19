const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL_PC = [0, 2, 4, 5, 7, 9, 11];
const ACCIDENTALS: Record<number, string> = { [-2]: "♭♭", [-1]: "♭", 0: "", 1: "♯", 2: "𝄪" };

export type KeyId = "C" | "D" | "E" | "F" | "G" | "A";
export type ScaleId = "maior" | "menor" | "pentM" | "pentm" | "blues";
export type LabelMode = "note" | "interval";

export interface MusicalKey {
  id: KeyId;
  pitchClass: number;
  letterIndex: number;
  name: string;
}

interface ScaleDegree {
  semitones: number;
  degree: number;
  interval: string;
}

export interface Scale {
  id: ScaleId;
  name: string;
  degrees: ScaleDegree[];
  title: (keyName: string) => string;
}

export interface FretNote {
  note: string;
  interval: string;
  isRoot: boolean;
}

export const KEYS: MusicalKey[] = [
  { id: "C", pitchClass: 0, letterIndex: 0, name: "Dó" },
  { id: "D", pitchClass: 2, letterIndex: 1, name: "Ré" },
  { id: "E", pitchClass: 4, letterIndex: 2, name: "Mi" },
  { id: "F", pitchClass: 5, letterIndex: 3, name: "Fá" },
  { id: "G", pitchClass: 7, letterIndex: 4, name: "Sol" },
  { id: "A", pitchClass: 9, letterIndex: 5, name: "Lá" },
];

const deg = (semitones: number, degree: number, interval: string): ScaleDegree => ({
  semitones,
  degree,
  interval,
});

export const SCALES: Scale[] = [
  {
    id: "maior",
    name: "Maior",
    degrees: [deg(0, 1, "1"), deg(2, 2, "2"), deg(4, 3, "3"), deg(5, 4, "4"), deg(7, 5, "5"), deg(9, 6, "6"), deg(11, 7, "7")],
    title: (k) => `${k} maior`,
  },
  {
    id: "menor",
    name: "Menor natural",
    degrees: [deg(0, 1, "1"), deg(2, 2, "2"), deg(3, 3, "♭3"), deg(5, 4, "4"), deg(7, 5, "5"), deg(8, 6, "♭6"), deg(10, 7, "♭7")],
    title: (k) => `${k} menor natural`,
  },
  {
    id: "pentM",
    name: "Pentatônica maior",
    degrees: [deg(0, 1, "1"), deg(2, 2, "2"), deg(4, 3, "3"), deg(7, 5, "5"), deg(9, 6, "6")],
    title: (k) => `${k} maior pentatônica`,
  },
  {
    id: "pentm",
    name: "Pentatônica menor",
    degrees: [deg(0, 1, "1"), deg(3, 3, "♭3"), deg(5, 4, "4"), deg(7, 5, "5"), deg(10, 7, "♭7")],
    title: (k) => `${k} menor pentatônica`,
  },
  {
    id: "blues",
    name: "Blues",
    degrees: [deg(0, 1, "1"), deg(3, 3, "♭3"), deg(5, 4, "4"), deg(6, 5, "♭5"), deg(7, 5, "5"), deg(10, 7, "♭7")],
    title: (k) => `Blues em ${k}`,
  },
];

export const LABEL_MODES: { id: LabelMode; name: string }[] = [
  { id: "note", name: "Notas" },
  { id: "interval", name: "Intervalos" },
];

// High e to low E, as the strings appear when looking at the guitar.
export const TUNING = [
  { name: "e", pitchClass: 4 },
  { name: "B", pitchClass: 11 },
  { name: "G", pitchClass: 7 },
  { name: "D", pitchClass: 2 },
  { name: "A", pitchClass: 9 },
  { name: "E", pitchClass: 4 },
];

export const FRET_COUNT = 12;
export const INLAY_FRETS = new Set([3, 5, 7, 9, 12]);

// Spells by scale degree so the letter matches the degree (e.g. F major gives B♭, not A♯).
export function spell(key: MusicalKey, semitones: number, degree: number) {
  const letterIndex = (key.letterIndex + degree - 1) % 7;
  const pitchClass = (key.pitchClass + semitones) % 12;
  let offset = (((pitchClass - NATURAL_PC[letterIndex]) % 12) + 12) % 12;
  if (offset > 6) offset -= 12;
  return LETTERS[letterIndex] + ACCIDENTALS[offset];
}

export function buildFretMap(key: MusicalKey, scale: Scale) {
  const map = new Map<number, FretNote>();
  for (const d of scale.degrees) {
    map.set((key.pitchClass + d.semitones) % 12, {
      note: spell(key, d.semitones, d.degree),
      interval: d.interval,
      isRoot: d.semitones === 0,
    });
  }
  return map;
}
