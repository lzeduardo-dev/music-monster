// Music theory helpers — single source of truth for notes, intervals, scales, chords.

export const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const NOTES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Standard root names for pickers (prefer enharmonic-common spellings)
export const COMMON_ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

// Map any spelling to its semitone index (0..11)
const NOTE_INDEX = (() => {
  const m = {}
  NOTES_SHARP.forEach((n, i) => { m[n] = i })
  NOTES_FLAT.forEach((n, i) => { m[n] = i })
  return m
})()

export function noteIndex(note) {
  // Strip octave digits if present
  const base = note.replace(/[0-9]+$/, '')
  return NOTE_INDEX[base]
}

export function noteName(index, useFlats = false) {
  const i = ((index % 12) + 12) % 12
  return useFlats ? NOTES_FLAT[i] : NOTES_SHARP[i]
}

// ─── Enharmonic spelling helpers ──────────────────────────────────────────────

const LETTER_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const LETTER_ST    = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

// Roots whose key signatures use flats
const FLAT_ROOTS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'])

export function needsFlats(rootStr) {
  const base = rootStr.replace(/[0-9]+$/, '')
  if (FLAT_ROOTS.has(base)) return true
  if (base.length > 1 && base[1] === 'b') return true
  return false
}

function parseRoot(rootStr) {
  const base = rootStr.replace(/[0-9]+$/, '')
  const letter = base[0]
  const acc = base.slice(1)
  const accVal = acc.split('').reduce((v, c) => v + (c === '#' ? 1 : c === 'b' ? -1 : 0), 0)
  const semitone = ((LETTER_ST[letter] + accVal) % 12 + 12) % 12
  return { letter, accVal, semitone, letterIdx: LETTER_ORDER.indexOf(letter) }
}

function stToAcc(diff) {
  if (diff === 0) return ''
  if (diff === 1) return '#'
  if (diff === 2) return '##'
  if (diff === 11) return 'b'
  if (diff === 10) return 'bb'
  return '#'
}

// Letter offsets (mod 7) for each chord tone — stacks in thirds
const CHORD_LETTER_OFFSETS = {
  maj:     [0, 2, 4],
  min:     [0, 2, 4],
  dim:     [0, 2, 4],
  aug:     [0, 2, 4],
  maj7:    [0, 2, 4, 6],
  '7':     [0, 2, 4, 6],
  min7:    [0, 2, 4, 6],
  m7b5:    [0, 2, 4, 6],
  dim7:    [0, 2, 4, 6],
  '9':     [0, 2, 4, 6, 1],
  maj9:    [0, 2, 4, 6, 1],
  min9:    [0, 2, 4, 6, 1],
  sus2:    [0, 1, 4],
  sus4:    [0, 3, 4],
  '7sus4': [0, 3, 4, 6],
  add9:    [0, 2, 4, 1],
  '7b9':   [0, 2, 4, 6, 1],
  '7#9':   [0, 2, 4, 6, 1],
  '7#11':  [0, 2, 4, 6, 3],
  '13':    [0, 2, 4, 6, 1, 5],
  maj13:   [0, 2, 4, 6, 1, 5],
  min11:   [0, 2, 4, 6, 1, 3],
}

// Build scale with correct enharmonic spelling (one letter per scale degree for diatonic scales)
export function buildScaleNotes(rootStr, scaleKey) {
  const formula = SCALES[scaleKey] || SCALES.major
  const { semitone: rootST, letterIdx } = parseRoot(rootStr)
  if (formula.length === 7) {
    return formula.map((offset, i) => {
      const targetST = (rootST + offset) % 12
      const targetLetterIdx = (letterIdx + i) % 7
      const targetLetter = LETTER_ORDER[targetLetterIdx]
      const diff = (targetST - LETTER_ST[targetLetter] + 12) % 12
      return targetLetter + stToAcc(diff)
    })
  }
  const useFlats = needsFlats(rootStr)
  return formula.map(offset => noteName((rootST + offset) % 12, useFlats))
}

// Build chord with correct enharmonic spelling (stacks thirds properly)
export function buildChordNotes(rootStr, chordKey) {
  const recipe = CHORDS[chordKey]
  if (!recipe) return []
  const offsets = CHORD_LETTER_OFFSETS[chordKey]
  const { semitone: rootST, letterIdx } = parseRoot(rootStr)
  if (!offsets) {
    const useFlats = needsFlats(rootStr)
    return recipe.intervals.map(s => noteName((rootST + s) % 12, useFlats))
  }
  return recipe.intervals.map((s, i) => {
    const targetST = (rootST + s) % 12
    const targetLetterIdx = (letterIdx + offsets[i]) % 7
    const targetLetter = LETTER_ORDER[targetLetterIdx]
    const diff = (targetST - LETTER_ST[targetLetter] + 12) % 12
    return targetLetter + stToAcc(diff)
  })
}

// Semitone formulas
export const SCALES = {
  major:           [0, 2, 4, 5, 7, 9, 11],   // T-T-st-T-T-T-st
  minorNatural:    [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues:           [0, 3, 5, 6, 7, 10],
  bluesMajor:      [0, 2, 3, 4, 7, 9],        // 1, 2, b3, 3, 5, 6
  // Greek modes (relative to root)
  ionian:     [0, 2, 4, 5, 7, 9, 11],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  phrygian:   [0, 1, 3, 5, 7, 8, 10],
  lydian:     [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian:    [0, 2, 3, 5, 7, 8, 10],
  locrian:    [0, 1, 3, 5, 6, 8, 10],
  // Menor Melódica (Jazz) — mesma ascending e descending
  melodicMinor:    [0, 2, 3, 5, 7, 9, 11],
  // Menor Harmônica e seus modos
  harmonicMinor:      [0, 2, 3, 5, 7, 8, 11],   // 1-2-b3-4-5-b6-7
  locrianNat6:        [0, 1, 3, 5, 6, 9, 10],   // II: Lócrio ♮6
  ionianSharp5:       [0, 2, 4, 5, 8, 9, 11],   // III: Jônico #5
  dorianSharp4:       [0, 2, 3, 6, 7, 9, 10],   // IV: Dórico #4 (Romeno)
  phrygianDominant:   [0, 1, 4, 5, 7, 8, 10],   // V: Frígio Dominante
  lydianSharp2:       [0, 3, 4, 6, 7, 9, 11],   // VI: Lídio #2
  superLocrianBb7:    [0, 1, 3, 4, 6, 8, 9],    // VII: Super Lócrio bb7
  // Modos da menor melódica
  dorianB2:        [0, 1, 3, 5, 7, 9, 10],    // II grau: Dórico b2 (Frígio natural 6)
  lydianAugmented: [0, 2, 4, 6, 8, 9, 11],    // III grau: Lídio Aumentado
  lydianDominant:  [0, 2, 4, 6, 7, 9, 10],    // IV grau: Lídio b7 / Dominante
  mixolydianB6:    [0, 2, 4, 5, 7, 8, 10],    // V grau: Mixolídio b6 (Hindu)
  locrianSharp2:   [0, 2, 3, 5, 6, 8, 10],    // VI grau: Lócrio #2 (Semidim. Jazz)
  altered:         [0, 1, 3, 4, 6, 8, 10],    // VII grau: Super Lócrio / Alterada
}

export const SCALE_LABELS = {
  major: 'Escala Maior',
  minorNatural: 'Menor Natural',
  pentatonicMajor: 'Pentatônica Maior',
  pentatonicMinor: 'Pentatônica Menor',
  blues: 'Blues (Hexatônica)',
  bluesMajor: 'Blues Maior',
  ionian: 'Jônico',
  dorian: 'Dórico',
  phrygian: 'Frígio',
  lydian: 'Lídio',
  mixolydian: 'Mixolídio',
  aeolian: 'Eólio',
  locrian: 'Lócrio',
  melodicMinor: 'Menor Melódica',
  harmonicMinor: 'Menor Harmônica',
  locrianNat6: 'Lócrio ♮6 (II)',
  ionianSharp5: 'Jônico #5 (III)',
  dorianSharp4: 'Dórico #4 / Romeno (IV)',
  phrygianDominant: 'Frígio Dominante (V)',
  lydianSharp2: 'Lídio #2 (VI)',
  superLocrianBb7: 'Super Lócrio bb7 (VII)',
  dorianB2: 'Dórico b2',
  lydianAugmented: 'Lídio Aumentado',
  lydianDominant: 'Lídio Dominante (b7)',
  mixolydianB6: 'Mixolídio b6 (Hindu)',
  locrianSharp2: 'Lócrio #2',
  altered: 'Escala Alterada (Super Lócrio)',
}

export const INTERVALS = [
  { semitones: 0,  name: 'Uníssono',     short: '1J' },
  { semitones: 1,  name: 'Segunda menor', short: '2m' },
  { semitones: 2,  name: 'Segunda maior', short: '2M' },
  { semitones: 3,  name: 'Terça menor',   short: '3m' },
  { semitones: 4,  name: 'Terça maior',   short: '3M' },
  { semitones: 5,  name: 'Quarta justa',  short: '4J' },
  { semitones: 6,  name: 'Trítono',       short: 'TT' },
  { semitones: 7,  name: 'Quinta justa',  short: '5J' },
  { semitones: 8,  name: 'Sexta menor',   short: '6m' },
  { semitones: 9,  name: 'Sexta maior',   short: '6M' },
  { semitones: 10, name: 'Sétima menor',  short: '7m' },
  { semitones: 11, name: 'Sétima maior',  short: '7M' },
  { semitones: 12, name: 'Oitava',        short: '8J' }
]

// Chord / arpeggio recipes (semitone offsets from root)
export const CHORDS = {
  maj:    { name: 'Maior (tríade)',         intervals: [0, 4, 7] },
  min:    { name: 'Menor (tríade)',         intervals: [0, 3, 7] },
  dim:    { name: 'Diminuto',               intervals: [0, 3, 6] },
  aug:    { name: 'Aumentado',              intervals: [0, 4, 8] },
  maj7:   { name: 'X M7 — 7ª Maior',       intervals: [0, 4, 7, 11] },
  '7':    { name: 'X 7 — Dominante',        intervals: [0, 4, 7, 10] },
  min7:   { name: 'Xm 7 — 7ª Menor',       intervals: [0, 3, 7, 10] },
  m7b5:   { name: 'Xm7b5 — Meio-dim.',     intervals: [0, 3, 6, 10] },
  dim7:   { name: 'X°7 — Dim. 7ª',         intervals: [0, 3, 6, 9] },
  '9':    { name: 'X 9 — Nona',            intervals: [0, 4, 7, 10, 14] },
  maj9:   { name: 'X M9 — Nona Maior',     intervals: [0, 4, 7, 11, 14] },
  min9:   { name: 'Xm 9 — Nona Menor',     intervals: [0, 3, 7, 10, 14] },
  sus2:   { name: 'Sus2',                  intervals: [0, 2, 7] },
  sus4:   { name: 'Sus4',                  intervals: [0, 5, 7] },
  '7sus4':{ name: 'X7sus4 — Dom. Sus4',    intervals: [0, 5, 7, 10] },
  add9:   { name: 'Xadd9 — Add9',          intervals: [0, 4, 7, 14] },
  '7b9':  { name: 'X7b9 — Dom. b9',        intervals: [0, 4, 7, 10, 13] },
  '7#9':  { name: 'X7#9 — Dom. #9',        intervals: [0, 4, 7, 10, 15] },
  '7#11': { name: 'X7#11 — Lídio Dom.',    intervals: [0, 4, 7, 10, 18] },
  '13':   { name: 'X13 — 13ª Dom.',         intervals: [0, 4, 7, 10, 14, 21] },
  maj13:  { name: 'XM13 — 13ª Maior',      intervals: [0, 4, 7, 11, 14, 21] },
  min11:  { name: 'Xm11 — Menor 11ª',      intervals: [0, 3, 7, 10, 14, 17] },
}

// Arpeggio groups for display
export const ARPEGGIO_GROUPS = [
  {
    title: 'Tríades',
    chip: 'chip',
    items: [
      { key: 'maj', label: 'Maior',     desc: '1 – 3 – 5' },
      { key: 'min', label: 'Menor',     desc: '1 – b3 – 5' },
      { key: 'aug', label: 'Aumentado', desc: '1 – 3 – #5' },
      { key: 'dim', label: 'Diminuto',  desc: '1 – b3 – b5' },
    ]
  },
  {
    title: 'Dominante',
    chip: 'chip-amber',
    items: [
      { key: '7',   label: 'X7',       desc: '1 – 3 – 5 – b7' },
      { key: '9',   label: 'X9',       desc: '1 – 3 – 5 – b7 – 9' }
    ]
  },
  {
    title: '7ª Maior (XM7)',
    chip: 'chip',
    items: [
      { key: 'maj7',  label: 'XM7',    desc: '1 – 3 – 5 – 7' },
      { key: 'maj9',  label: 'XM9',    desc: '1 – 3 – 5 – 7 – 9' }
    ]
  },
  {
    title: '7ª Menor (Xm7)',
    chip: 'chip-coral',
    items: [
      { key: 'min7',  label: 'Xm7',   desc: '1 – b3 – 5 – b7' },
      { key: 'min9',  label: 'Xm9',   desc: '1 – b3 – 5 – b7 – 9' }
    ]
  },
  {
    title: 'Diminutos',
    chip: 'chip-amber',
    items: [
      { key: 'm7b5',  label: 'Xm7b5', desc: '1 – b3 – b5 – b7' },
      { key: 'dim7',  label: 'X°7',   desc: '1 – b3 – b5 – bb7' }
    ]
  }
]

// Build a scale starting on `root` (note name like "C" or "F#")
export function buildScale(root, scaleKey) {
  const r = noteIndex(root)
  const formula = SCALES[scaleKey] || SCALES.major
  return formula.map((s) => (r + s) % 12)
}

// Build a chord starting on `root`
export function buildChord(root, chordKey) {
  const r = noteIndex(root)
  const recipe = CHORDS[chordKey] || CHORDS.maj
  return recipe.intervals.map((s) => (r + s) % 12)
}

// Diatonic triads of a major scale: I ii iii IV V vi vii°
export function diatonicTriads(rootNote) {
  const scaleNames = buildScaleNotes(rootNote, 'major')
  const qualities = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim']
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII°']
  return scaleNames.map((name, i) => ({
    root: name,
    quality: qualities[i],
    numeral: numerals[i],
    notes: buildChord(name, qualities[i]),
  }))
}

// Convert a semitone-index set to note names (for display)
export function indexesToNames(indexes, useFlats = false) {
  return indexes.map((i) => noteName(i, useFlats))
}

// Pitch with octave for the audio engine, e.g. ("C", 4) -> "C4"
export function withOctave(noteName, octave) {
  return `${noteName}${octave}`
}

// Given a starting MIDI-style "C4", produce the scale notes spelled with octaves.
export function scaleWithOctaves(root, scaleKey, startOctave = 4) {
  const { semitone: rootST } = parseRoot(root)
  const formula = SCALES[scaleKey] || SCALES.major
  const names = buildScaleNotes(root, scaleKey)
  const allNames = [...names, names[0]] // octave repeat
  let lastIdx = -1
  let oct = startOctave
  return formula.concat([12]).map((s, i) => {
    const idx = (rootST + s) % 12
    if (idx <= lastIdx) oct += 1
    lastIdx = idx
    return `${allNames[i]}${oct}`
  })
}

export function chordWithOctaves(root, chordKey, octave = 4) {
  const { semitone: rootST } = parseRoot(root)
  const recipe = CHORDS[chordKey] || CHORDS.maj
  const names = buildChordNotes(root, chordKey)
  let lastIdx = -1
  let oct = octave
  return recipe.intervals.map((s, i) => {
    const idx = (rootST + s) % 12
    if (idx <= lastIdx) oct += 1
    lastIdx = idx
    return `${names[i]}${oct}`
  })
}
