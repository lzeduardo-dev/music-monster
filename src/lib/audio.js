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

/**
 * Sync fallback: se algum play foi chamado antes do primeiro gesto ter
 * destravado o áudio, ainda tentamos resume() + build inline. iOS Safari
 * exige que isso rode no MESMO tick síncrono do user gesture, sem await.
 */
function ensureStartedSync() {
  if (!started) {
    try {
      const ctx = Tone.getContext().rawContext
      if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {})
      Tone.start().catch(() => {})
      started = true
    } catch {}
  }
  if (!synth) buildSynth()
}

/**
 * Destrava o AudioContext no PRIMEIRO gesto do usuário na página.
 * Chrome no Windows + iOS Safari + Chrome Android exigem isso: se o
 * AudioContext foi criado no page load (como o Tone.js faz no import),
 * qualquer play depois só funciona se um `Tone.start()` já rodou dentro
 * de um user gesture prévio.
 *
 * Usa capture=true pra rodar ANTES de qualquer outro handler
 * (não perde o user-gesture flag). Também constrói o synth eager —
 * senão o primeiro play em mobile perde o gesto no lazy build.
 */
export function initAudioUnlock() {
  if (typeof window === 'undefined') return
  if (started) return

  const unlock = () => {
    try {
      const ctx = Tone.getContext().rawContext
      if (ctx && ctx.state !== 'running') {
        ctx.resume().catch((err) => console.warn('[audio] resume falhou:', err))
      }
      Tone.start()
        .then(() => {
          started = true
          if (!synth) buildSynth()  // constrói agora, evita lazy build
          console.log('[audio] Tone.start OK, ctx=', ctx?.state)
        })
        .catch((err) => console.warn('[audio] Tone.start falhou:', err))
    } catch (err) {
      console.warn('[audio] unlock err:', err)
    }
    window.removeEventListener('pointerdown', unlock, true)
    window.removeEventListener('keydown', unlock, true)
    window.removeEventListener('touchstart', unlock, true)
  }

  window.addEventListener('pointerdown', unlock, { capture: true })
  window.addEventListener('keydown', unlock, { capture: true })
  window.addEventListener('touchstart', unlock, { capture: true, passive: true })
}

export function setInstrument(key) {
  currentPreset = key
  if (typeof localStorage !== 'undefined') localStorage.setItem('hh_instrument', key)
  if (started) buildSynth()
}

export function getCurrentInstrument() {
  return currentPreset
}

// Todas as funções de play são SÍNCRONAS — qualquer await perde o
// contexto de user-gesture em mobile (iOS Safari especialmente).

export function playNote(note, durationSec = 0.7) {
  ensureStartedSync()
  if (synth) synth.triggerAttackRelease(note, durationSec)
}

export function playChord(notes, durationSec = 1.2) {
  ensureStartedSync()
  if (synth) synth.triggerAttackRelease(notes, durationSec)
}

export function playSequence(notes, perNoteSec = 0.32, chordAtEnd = false) {
  ensureStartedSync()
  if (!synth) return
  const now = Tone.now()
  notes.forEach((n, i) => synth.triggerAttackRelease(n, perNoteSec * 0.95, now + i * perNoteSec))
  if (chordAtEnd) {
    synth.triggerAttackRelease(notes, perNoteSec * 2, now + notes.length * perNoteSec + 0.05)
  }
}

export function playChordSequence(chordPitchArrays, perChordSec = 1.2) {
  ensureStartedSync()
  if (!synth) return
  const now = Tone.now()
  chordPitchArrays.forEach((notes, i) => {
    synth.triggerAttackRelease(notes, perChordSec * 0.85, now + i * perChordSec)
  })
}

export function playInterval(rootNote, semitones) {
  ensureStartedSync()
  if (!synth) return
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
