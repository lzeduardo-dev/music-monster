import { useEffect, useMemo, useState } from 'react'
import { PageHeader, Section, TheoryBlock, Pill } from '../components/Common.jsx'
import { INTERVALS, NOTES_SHARP } from '../lib/theory.js'
import { playInterval, playNote, transpose } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'

const MODES = [
  { key: 'intervals', label: 'Intervalos' },
  { key: 'notes', label: 'Notas isoladas' }
]

const INTERVAL_POOL_EASY = [0, 2, 4, 5, 7, 9, 12]
const INTERVAL_POOL_HARD = INTERVALS.map((i) => i.semitones)

export default function EarLab() {
  const [mode, setMode] = useState('intervals')
  const [difficulty, setDifficulty] = useState('easy')
  const [challenge, setChallenge] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const { progress, addEarResult } = useProgress()

  const newChallenge = () => {
    setFeedback(null)
    if (mode === 'intervals') {
      const pool = difficulty === 'easy' ? INTERVAL_POOL_EASY : INTERVAL_POOL_HARD
      const semis = pool[Math.floor(Math.random() * pool.length)]
      const rootNote = NOTES_SHARP[Math.floor(Math.random() * 12)] + '4'
      setChallenge({ type: 'interval', root: rootNote, semitones: semis })
      setTimeout(() => playInterval(rootNote, semis), 100)
    } else {
      const idx = Math.floor(Math.random() * 12)
      const pitch = `${NOTES_SHARP[idx]}4`
      setChallenge({ type: 'note', pitch, idx })
      setTimeout(() => playNote(pitch, 0.9), 100)
    }
  }

  // Reset state on mode/difficulty change — sem tocar som automaticamente
  useEffect(() => {
    setChallenge(null)
    setFeedback(null)
  }, [mode, difficulty])

  const replay = () => {
    if (!challenge) return
    if (challenge.type === 'interval') playInterval(challenge.root, challenge.semitones)
    else playNote(challenge.pitch, 0.9)
  }

  const answer = (value) => {
    if (!challenge || feedback) return
    let correct = false
    if (challenge.type === 'interval') correct = value === challenge.semitones
    else correct = value === challenge.idx
    addEarResult(correct)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const acc = progress.ear.attempts > 0 ? Math.round((progress.ear.score / progress.ear.attempts) * 100) : 0

  return (
    <div>
      <PageHeader
        chip="Lab Auditivo"
        title="Treine o seu ouvido"
        description="Identifique intervalos e notas isoladas. Quanto mais você pratica, mais rápido seu cérebro reconhece padrões musicais."
      />

      <div className="card p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50">Desempenho</div>
          <div className="text-2xl font-bold">{progress.ear.score}<span className="text-white/40 text-base font-normal"> / {progress.ear.attempts}</span> <span className="ml-2 text-accent-emerald text-base">{acc}%</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            {MODES.map((m) => (
              <Pill key={m.key} active={mode === m.key} onClick={() => setMode(m.key)}>{m.label}</Pill>
            ))}
          </div>
          {mode === 'intervals' && (
            <div className="flex gap-1">
              <Pill active={difficulty === 'easy'} tone="amber" onClick={() => setDifficulty('easy')}>Fácil</Pill>
              <Pill active={difficulty === 'hard'} tone="amber" onClick={() => setDifficulty('hard')}>Difícil</Pill>
            </div>
          )}
        </div>
      </div>

      <Section title={mode === 'intervals' ? 'Qual é o intervalo?' : 'Qual é a nota?'} action={
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={replay} disabled={!challenge}>↻ Tocar novamente</button>
          <button className="btn btn-primary" onClick={newChallenge}>Novo desafio →</button>
        </div>
      }>
        {challenge ? (
          mode === 'intervals' ? (
            <IntervalChoices difficulty={difficulty} feedback={feedback} expected={challenge.semitones} onAnswer={answer} />
          ) : (
            <NoteChoices feedback={feedback} expected={challenge.idx} onAnswer={answer} />
          )
        ) : (
          <div className="card p-10 text-center">
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Clique em <strong style={{ color: 'var(--text-base)' }}>Novo desafio</strong> para ouvir e identificar.
            </p>
          </div>
        )}

        {feedback && (
          <div className={`mt-4 card p-4 ${feedback === 'correct' ? 'border-accent-emerald/40' : 'border-accent-coral/40'}`}>
            {feedback === 'correct' ? (
              <span className="text-accent-emerald font-bold">✓ Correto! Mandando outro…</span>
            ) : (
              <span className="text-accent-coral font-bold">✗ Quase! A resposta era {explainAnswer(mode, challenge)}.</span>
            )}
          </div>
        )}
      </Section>

      <TheoryBlock>
        <p>
          <b>Dica:</b> associe cada intervalo a uma música conhecida que comece com ele. Por exemplo:
          a 2ª maior é o início de "Frère Jacques"; a 4ª justa é "Amazing Grace"; a 5ª justa é o tema de Star Wars.
          Esse "atalho" acelera muito o reconhecimento.
        </p>
      </TheoryBlock>
    </div>
  )
}

function explainAnswer(mode, challenge) {
  if (!challenge) return '?'
  if (challenge.type === 'interval') {
    const iv = INTERVALS.find((x) => x.semitones === challenge.semitones)
    return `${iv.name} (${iv.short})`
  }
  return NOTES_SHARP[challenge.idx]
}

function IntervalChoices({ difficulty, feedback, expected, onAnswer }) {
  const pool = difficulty === 'easy' ? INTERVAL_POOL_EASY : INTERVAL_POOL_HARD
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {pool.map((s) => {
        const iv = INTERVALS.find((x) => x.semitones === s)
        const isCorrect = feedback && expected === s
        return (
          <button
            key={s}
            onClick={() => onAnswer(s)}
            disabled={!!feedback}
            className={`p-4 rounded-xl text-left border transition ${
              isCorrect ? 'bg-accent-emerald/15 border-accent-emerald text-accent-emerald'
              : feedback ? 'bg-white/5 border-white/10 opacity-50'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="font-bold">{iv.name}</div>
            <div className="text-xs text-white/50">{iv.short} · {s} semitons</div>
          </button>
        )
      })}
    </div>
  )
}

function NoteChoices({ feedback, expected, onAnswer }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
      {NOTES_SHARP.map((n, i) => {
        const isCorrect = feedback && expected === i
        return (
          <button
            key={n}
            onClick={() => onAnswer(i)}
            disabled={!!feedback}
            className={`p-4 rounded-xl font-bold border transition ${
              isCorrect ? 'bg-accent-emerald/15 border-accent-emerald text-accent-emerald'
              : feedback ? 'bg-white/5 border-white/10 opacity-50'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}
