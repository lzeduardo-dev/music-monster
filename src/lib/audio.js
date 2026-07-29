// Audio engine wrapper around Tone.js — single shared synth.
import * as Tone from 'tone'

export const INSTRUMENT_PRESETS = {
  violao: {
    label: 'Violão',
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.008, decay: 0.48, sustain: 0.1, release: 1.2 },
    volume: -8,
  },
  guitarra: {
    label: 'Guitarra Elétrica',
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.13, sustain: 0.58, release: 0.5 },
    volume: -10,
  },
  piano: {
    label: 'Piano',
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 1.6, sustain: 0.02, release: 2.5 },
    volume: -7,
  },
  baixo: {
    label: 'Baixo',
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.015, decay: 0.65, sustain: 0.38, release: 1.1 },
    volume: -5,
  },
  sintetizador: {
    label: 'Sintetizador',
    oscillator: { type: 'square' },
    envelope: { attack: 0.08, decay: 0.28, sustain: 0.75, release: 0.9 },
    volume: -14,
  },
}

let synth = null
let started = false
let currentPreset = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('hh_instrument') ?? 'violao')
  : 'violao'

function buildSynth() {
  if (synth) { try { synth.disconnect(); synth.dispose() } catch {} }
  const p = INSTRUMENT_PRESETS[currentPreset] ?? INSTRUMENT_PRESETS.violao
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: p.oscillator,
    envelope: p.envelope,
  }).toDestination()
  synth.volume.value = p.volume
}

async function ensureStarted() {
  if (!started) {
    await Tone.start()
    started = true
  }
  if (!synth) buildSynth()
}

export function setInstrument(key) {
  currentPreset = key
  if (typeof localStorage !== 'undefined') localStorage.setItem('hh_instrument', key)
  if (started) buildSynth()
}

export function getCurrentInstrument() {
  return currentPreset
}

export async function playNote(note, durationSec = 0.7) {
  await ensureStarted()
  synth.triggerAttackRelease(note, durationSec)
}

export async function playChord(notes, durationSec = 1.2) {
  await ensureStarted()
  synth.triggerAttackRelease(notes, durationSec)
}

export async function playSequence(notes, perNoteSec = 0.32, chordAtEnd = false) {
  await ensureStarted()
  const now = Tone.now()
  notes.forEach((n, i) => synth.triggerAttackRelease(n, perNoteSec * 0.95, now + i * perNoteSec))
  if (chordAtEnd) {
    synth.triggerAttackRelease(notes, perNoteSec * 2, now + notes.length * perNoteSec + 0.05)
  }
}

export async function playChordSequence(chordPitchArrays, perChordSec = 1.2) {
  await ensureStarted()
  const now = Tone.now()
  chordPitchArrays.forEach((notes, i) => {
    synth.triggerAttackRelease(notes, perChordSec * 0.85, now + i * perChordSec)
  })
}

export async function playInterval(rootNote, semitones) {
  await ensureStarted()
  const second = transpose(rootNote, semitones)
  const now = Tone.now()
  synth.triggerAttackRelease(rootNote, 0.55, now)
  synth.triggerAttackRelease(second, 0.55, now + 0.5)
  synth.triggerAttackRelease([rootNote, second], 0.9, now + 1.05)
}

const ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
export function transpose(pitch, semitones) {
  const m = pitch.match(/^([A-G]#?)(-?\d+)$/)
  if (!m) return pitch
  const [, name, octStr] = m
  const idx = ORDER.indexOf(name)
  const oct = parseInt(octStr, 10)
  const totalSemis = oct * 12 + idx + semitones
  const newOct = Math.floor(totalSemis / 12)
  const newIdx = ((totalSemis % 12) + 12) % 12
  return `${ORDER[newIdx]}${newOct}`
}
