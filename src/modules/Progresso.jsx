import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { PageHeader, Section } from '../components/Common.jsx'
import { useProgress } from '../context/ProgressContext.jsx'

// ─── Catalog ─────────────────────────────────────────────────────────────────

const CATALOG = [
  {
    moduleId: 'fundamentos', label: 'Fundamentos', category: 'aprender',
    route: '/fundamentos', color: '#3b82f6',
    lessons: [
      { id: 'waves',                    label: 'Som e frequência' },
      { id: 'scale',                    label: 'Escala maior' },
      { id: 'intervals',                label: 'Intervalos' },
      { id: 'formula',                  label: 'Fórmula T-T-st' },
      { id: 'intervalos_aprofundados',  label: 'Intervalos aprofundados' },
    ],
  },
  {
    moduleId: 'figuras_ritmicas', label: 'Figuras Rítmicas', category: 'aprender',
    route: '/figuras-ritmicas', color: '#3b82f6',
    lessons: [
      { id: 'introducao',          label: 'Introdução ao Ritmo' },
      { id: 'figuras',             label: 'Figuras Fundamentais' },
      { id: 'pausas',              label: 'Pausas Rítmicas' },
      { id: 'pontua_ligaduras',    label: 'Pontuação e Ligaduras' },
      { id: 'subdivisao',          label: 'Subdivisão do Tempo' },
      { id: 'tercinas',            label: 'Tercinas' },
      { id: 'sextinas',            label: 'Sextinas' },
      { id: 'metronomo_integrado', label: 'Metrônomo Integrado' },
    ],
  },
  {
    moduleId: 'ciclo_quintas', label: 'Ciclo das Quintas', category: 'aprender',
    route: '/ciclo-das-quintas', color: '#38bdf8',
    lessons: [
      { id: 'quintas', label: 'Ciclo das Quintas' },
      { id: 'quartas', label: 'Ciclo das Quartas' },
    ],
  },
  {
    moduleId: 'harmony', label: 'Tríades & Voicings', category: 'aprender',
    route: '/harmonia', color: '#c084fc',
    lessons: [
      { id: 'chord_qualities', label: 'Qualidades dos acordes' },
      { id: 'triads',          label: 'Tríades e tétrades' },
      { id: 'string_shapes',   label: 'Shapes por corda' },
      { id: 'inversions',      label: 'Inversões' },
    ],
  },
  {
    moduleId: 'harmonia_funcional', label: 'Harmonia Funcional', category: 'aprender',
    route: '/harmonia-funcional', color: '#60a5fa',
    lessons: [
      { id: 'tsdf',         label: 'T, S e D' },
      { id: 'progressions', label: 'Progressões clichê' },
      { id: 'ii_v_i',       label: 'ii–V–I e Jazz' },
    ],
  },
  {
    moduleId: 'scales', label: 'Escalas & Solos', category: 'dominio',
    route: '/escalas-solos', color: '#f472b6',
    lessons: [
      { id: 'pentatonicMinor', label: 'Pentatônica menor' },
      { id: 'pentatonicMajor', label: 'Pentatônica maior' },
      { id: 'blues',           label: 'Blues hexatônica' },
      { id: 'bluesMajor',      label: 'Blues maior' },
      { id: 'shapes_5',        label: 'Os 5 shapes da pentatônica' },
      { id: 'horizontalidade', label: 'Visão horizontal' },
    ],
  },
  {
    moduleId: 'penta_patterns', label: 'Padrões na Pentatônica', category: 'dominio',
    route: '/padroes-pentatonica', color: '#f472b6',
    lessons: [
      { id: 'col_4',        label: 'Colcheia/Semicolcheia — 4 notas' },
      { id: 'col_3',        label: 'Colcheia/Semicolcheia — 3 notas' },
      { id: 'tercina_3',    label: 'Tercina/Sextina — 3 notas' },
      { id: 'tercina_4',    label: 'Tercina — 4 notas' },
      { id: 'nao_seq_4',    label: 'Não sequencial — 4 notas' },
      { id: 'col_6',        label: 'Colcheia — 6 notas' },
      { id: 'cinco_sobre',  label: '5 sobre ritmo' },
      { id: 'salto',        label: 'Com salto' },
      { id: 'tercina_6',    label: 'Tercina/Sextina — 6 notas' },
    ],
  },
  {
    moduleId: 'arpejos', label: 'Arpejos', category: 'dominio',
    route: '/arpejos', color: '#a78bfa',
    lessons: [
      { id: 'maj',  label: 'Tríade Maior' },
      { id: 'min',  label: 'Tríade Menor' },
      { id: 'aug',  label: 'Tríade Aumentada' },
      { id: 'dim',  label: 'Tríade Diminuta' },
      { id: '7',    label: 'X7 Dominante' },
      { id: 'maj7', label: 'XM7 Maior' },
      { id: 'min7', label: 'Xm7 Menor' },
    ],
  },
  {
    moduleId: 'caged', label: 'Sistema CAGED', category: 'dominio',
    route: '/caged', color: '#38bdf8',
    lessons: [
      { id: 'concept', label: 'O sistema CAGED' },
      { id: 'c_shape', label: 'Forma C' },
      { id: 'a_shape', label: 'Forma A' },
      { id: 'g_shape', label: 'Forma G' },
      { id: 'e_shape', label: 'Forma E' },
      { id: 'd_shape', label: 'Forma D' },
    ],
  },
  {
    moduleId: 'escalas_avancadas', label: 'Escalas Avançadas', category: 'dominio',
    route: '/escalas-avancadas', color: '#a78bfa',
    lessons: [
      { id: 'harmonic_minor', label: 'Menor Harmônica' },
      { id: 'harmonic_modes', label: 'Modos da harm. menor' },
      { id: 'melodic_minor',  label: 'Menor Melódica' },
    ],
  },
  {
    moduleId: 'modos', label: 'Modos Gregos', category: 'dominio',
    route: '/avancado', color: '#a78bfa',
    lessons: [
      { id: 'ionian',     label: 'Jônico' },
      { id: 'dorian',     label: 'Dórico' },
      { id: 'phrygian',   label: 'Frígio' },
      { id: 'lydian',     label: 'Lídio' },
      { id: 'mixolydian', label: 'Mixolídio' },
      { id: 'aeolian',    label: 'Eólio' },
      { id: 'locrian',    label: 'Lócrio' },
    ],
  },
  {
    moduleId: 'maquina_acordes', label: 'Máquina de Acordes', category: 'ferramentas',
    route: '/maquina-acordes', color: '#6366f1',
    lessons: [
      { id: 'teoria',  label: 'Tétrades e voicings — teoria' },
      { id: 'maquina', label: 'Máquina de acordes — prática' },
    ],
  },
  {
    moduleId: 'groove', label: 'Laboratório do Groove', category: 'ferramentas',
    route: '/laboratorio-groove', color: '#60a5fa',
    lessons: [
      { id: 'mpq', label: 'Sistema MPQ (Motorzinho/Pulsação/Queridinha)' },
    ],
  },
  // ── Páginas de artistas individuais (desativadas) ────────────────────────
  // {
  //   moduleId: 'djavan', label: 'Djavan', category: 'lendas',
  //   route: '/lendas/djavan', color: '#a78bfa',
  //   lessons: [
  //     { id: 'oceano',     label: 'Oceano (1989)' },
  //     { id: 'samurai',    label: 'Samurai (1982)' },
  //     { id: 'nem-um-dia', label: 'Nem Um Dia (1995)' },
  //   ],
  // },
  // {
  //   moduleId: 'chico-buarque', label: 'Chico Buarque', category: 'lendas',
  //   route: '/lendas/chico-buarque', color: '#818cf8',
  //   lessons: [
  //     { id: 'construcao',  label: 'Construção (1971)' },
  //     { id: 'calice',      label: 'Cálice (1973)' },
  //     { id: 'o-que-sera',  label: 'O Que Será (1976)' },
  //   ],
  // },
  // {
  //   moduleId: 'cartola', label: 'Cartola', category: 'lendas',
  //   route: '/lendas/cartola', color: '#60a5fa',
  //   lessons: [
  //     { id: 'as-rosas-nao-falam', label: 'As Rosas Não Falam (1976)' },
  //     { id: 'o-mundo-e-moinho',   label: 'O Mundo é um Moinho (1976)' },
  //     { id: 'alvorada',           label: 'Alvorada (1968)' },
  //   ],
  // },
  // {
  //   moduleId: 'cazuza', label: 'Cazuza', category: 'lendas',
  //   route: '/lendas/cazuza', color: '#c084fc',
  //   lessons: [
  //     { id: 'codinome-beija-flor',  label: 'Codinome Beija-Flor (1985)' },
  //     { id: 'o-tempo-nao-para',     label: 'O Tempo Não Para (1988)' },
  //     { id: 'faz-parte-do-meu-show', label: 'Faz Parte do Meu Show (1988)' },
  //   ],
  // },
  // {
  //   moduleId: 'paralamas', label: 'Paralamas do Sucesso', category: 'lendas',
  //   route: '/lendas/paralamas', color: '#38bdf8',
  //   lessons: [
  //     { id: 'lanterna-dos-afogados', label: 'Lanterna dos Afogados (1989)' },
  //     { id: 'alagados',              label: 'Alagados (1986)' },
  //     { id: 'meu-erro',              label: 'Meu Erro (1984)' },
  //   ],
  // },
  // {
  //   moduleId: 'roupa-nova', label: 'Roupa Nova', category: 'lendas',
  //   route: '/lendas/roupa-nova', color: '#ec4899',
  //   lessons: [
  //     { id: 'dona',            label: 'Dona (1983)' },
  //     { id: 'whisky-a-go-go',  label: 'Whisky a Go-Go (1980)' },
  //     { id: 'a-viagem',        label: 'A Viagem (1984)' },
  //   ],
  // },
  // {
  //   moduleId: 'stevie-wonder', label: 'Stevie Wonder', category: 'lendas',
  //   route: '/lendas/stevie-wonder', color: '#e879f9',
  //   lessons: [
  //     { id: 'superstition',    label: 'Superstition (1972)' },
  //     { id: 'sir-duke',        label: 'Sir Duke (1976)' },
  //     { id: 'isnt-she-lovely', label: "Isn't She Lovely (1976)" },
  //   ],
  // },
  // {
  //   moduleId: 'michael-jackson', label: 'Michael Jackson', category: 'lendas',
  //   route: '/lendas/michael-jackson', color: '#ec4899',
  //   lessons: [
  //     { id: 'billie-jean',         label: 'Billie Jean (1982)' },
  //     { id: 'human-nature',        label: 'Human Nature (1982)' },
  //     { id: 'man-in-the-mirror',   label: 'Man in the Mirror (1988)' },
  //   ],
  // },
  {
    moduleId: 'licks', label: 'Vocabulário de Licks', category: 'lendas',
    route: '/lendas/licks', color: '#c084fc',
    lessons: [
      // Hendrix (6)
      { id: 'hendrix-little-wing',          label: 'Hendrix · Little Wing' },
      { id: 'hendrix-purple-haze',          label: 'Hendrix · Purple Haze' },
      { id: 'hendrix-voodoo-child',         label: 'Hendrix · Voodoo Child' },
      { id: 'hendrix-wind-cries-mary',      label: 'Hendrix · Wind Cries Mary' },
      { id: 'hendrix-hey-joe',              label: 'Hendrix · Hey Joe' },
      { id: 'hendrix-castles-made-of-sand', label: 'Hendrix · Castles Made of Sand' },
      // Jimmy Page (6)
      { id: 'page-stairway-solo',           label: 'Page · Stairway to Heaven' },
      { id: 'page-whole-lotta-love',        label: 'Page · Whole Lotta Love' },
      { id: 'page-black-dog',               label: 'Page · Black Dog' },
      { id: 'page-heartbreaker',            label: 'Page · Heartbreaker' },
      { id: 'page-kashmir',                 label: 'Page · Kashmir' },
      { id: 'page-since-ive-been',          label: "Page · Since I've Been Loving You" },
      // Mayer (6)
      { id: 'mayer-slow-dancing',           label: 'Mayer · Slow Dancing' },
      { id: 'mayer-gravity',                label: 'Mayer · Gravity' },
      { id: 'mayer-neon',                   label: 'Mayer · Neon' },
      { id: 'mayer-belief',                 label: 'Mayer · Belief' },
      { id: 'mayer-who-did-you-think',      label: 'Mayer · Who Did You Think' },
      { id: 'mayer-daughters',              label: 'Mayer · Daughters' },
      // Bonamassa (6)
      { id: 'bonamassa-blues-deluxe',       label: 'Bonamassa · Blues Deluxe' },
      { id: 'bonamassa-sloe-gin',           label: 'Bonamassa · Sloe Gin' },
      { id: 'bonamassa-mountain-time',      label: 'Bonamassa · Mountain Time' },
      { id: 'bonamassa-dust-bowl',          label: 'Bonamassa · Dust Bowl' },
      { id: 'bonamassa-just-cos-you-can',   label: 'Bonamassa · Just \'Cos You Can' },
      { id: 'bonamassa-driving-towards',    label: 'Bonamassa · Driving Towards' },
      // SRV (6)
      { id: 'srv-pride-and-joy',            label: 'SRV · Pride and Joy' },
      { id: 'srv-texas-flood',              label: 'SRV · Texas Flood' },
      { id: 'srv-scuttle-buttin',           label: 'SRV · Scuttle Buttin\'' },
      { id: 'srv-cold-shot',                label: 'SRV · Cold Shot' },
      { id: 'srv-crossfire',                label: 'SRV · Crossfire' },
      { id: 'srv-lenny',                    label: 'SRV · Lenny' },
      // B.B. King (6)
      { id: 'bbking-thrill-is-gone',        label: 'B.B. · The Thrill is Gone' },
      { id: 'bbking-sweet-little-angel',    label: 'B.B. · Sweet Little Angel' },
      { id: 'bbking-three-oclock',          label: 'B.B. · Three O\'Clock Blues' },
      { id: 'bbking-every-day',             label: 'B.B. · Every Day I Have the Blues' },
      { id: 'bbking-why-i-sing',            label: 'B.B. · Why I Sing the Blues' },
      { id: 'bbking-lucille',               label: 'B.B. · Lucille' },
      // Buddy Guy (6)
      { id: 'buddyguy-damn-right',          label: 'Buddy Guy · Damn Right' },
      { id: 'buddyguy-stone-crazy',         label: 'Buddy Guy · Stone Crazy' },
      { id: 'buddyguy-first-time',          label: 'Buddy Guy · First Time' },
      { id: 'buddyguy-skin-deep',           label: 'Buddy Guy · Skin Deep' },
      { id: 'buddyguy-hoodoo-man',          label: 'Buddy Guy · Hoodoo Man' },
      { id: 'buddyguy-mary-had',            label: 'Buddy Guy · Mary Had a Little Lamb' },
      // Clapton (6)
      { id: 'clapton-layla',                label: 'Clapton · Layla' },
      { id: 'clapton-tears-in-heaven',      label: 'Clapton · Tears in Heaven' },
      { id: 'clapton-crossroads',           label: 'Clapton · Crossroads' },
      { id: 'clapton-cocaine',              label: 'Clapton · Cocaine' },
      { id: 'clapton-wonderful-tonight',    label: 'Clapton · Wonderful Tonight' },
      { id: 'clapton-sunshine-of-love',     label: 'Clapton · Sunshine of Your Love' },
      // Clichês do Blues (10)
      { id: 'cliche-bb-box',                label: 'Clichê · A Caixa B.B. King' },
      { id: 'cliche-albert-king',           label: 'Clichê · O Bend Implorante' },
      { id: 'cliche-turnaround-a',          label: 'Clichê · Turnaround em Lá' },
      { id: 'cliche-chuck-berry',           label: 'Clichê · Double-stop Chuck Berry' },
      { id: 'cliche-blue-note-slide',       label: 'Clichê · Slide da Blue Note' },
      { id: 'cliche-pentatonic-descent',    label: 'Clichê · Frase Descendente' },
      { id: 'cliche-hammer-cascade',        label: 'Clichê · Cascata Hammer-Pull' },
      { id: 'cliche-walking-blues',         label: 'Clichê · Walking Bass + Pent.' },
      { id: 'cliche-octave-punch',          label: 'Clichê · Octave Punch (Wes)' },
      { id: 'cliche-i-iv-slide',            label: 'Clichê · I-IV Slide' },
    ],
  },
  {
    moduleId: 'quiz', label: 'Quiz Musical', category: 'treino',
    route: '/quiz', color: '#818cf8',
    lessons: [
      { id: 'completed', label: 'Quiz concluído' },
    ],
  },
  {
    moduleId: 'improviso', label: 'Laboratório de Improviso', category: 'treino',
    route: '/improviso', color: '#f59e0b',
    lessons: [
      { id: 'blues_g',      label: 'Blues Shuffle em G' },
      { id: 'neo_soul_am',  label: 'Neo-Soul em Am' },
      { id: 'ciclo_quartas', label: 'Ciclo de Quartas' },
    ],
  },
]

const CATEGORIES = [
  { id: 'aprender',    label: 'Aprender',    color: '#3b82f6', accent: 'rgba(59,130,246,1)'  },
  { id: 'dominio',     label: 'Domínio',     color: '#a78bfa', accent: 'rgba(167,139,250,1)' },
  { id: 'ferramentas', label: 'Ferramentas', color: '#60a5fa', accent: 'rgba(96,165,250,1)'  },
  { id: 'lendas',      label: 'Lendas',      color: '#c084fc', accent: 'rgba(192,132,252,1)' },
  { id: 'treino',      label: 'Treino',      color: '#f472b6', accent: 'rgba(244,114,182,1)' },
]

const TOTAL = CATALOG.reduce((acc, m) => acc + m.lessons.length, 0)

// ─── Circular gauge ──────────────────────────────────────────────────────────

function CircleGauge({ pct, color, size = 78, stroke = 6 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-05)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={size / 2} y={size / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={Math.round(size / 4.2)} fontWeight={800} fill="var(--text-base)"
      >
        {pct}%
      </text>
    </svg>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function Kpi({ label, value, sub, accent, trend }) {
  return (
    <div className="card" style={{ padding: 16, position: 'relative' }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ultra)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1 }}>{value}</span>
        {trend != null && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
            background: trend >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: trend >= 0 ? '#22c55e' : '#ef4444',
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <span style={{ fontSize: 9 }}>{trend >= 0 ? '↗' : '↘'}</span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-ultra)', marginTop: 6 }}>{sub}</div>}
      {/* Accent line */}
      <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: 2, background: accent }} />
    </div>
  )
}

// ─── Status pill ─────────────────────────────────────────────────────────────

function StatusPill({ pct }) {
  let bg, color, label, dot
  if (pct === 100) { bg = 'rgba(34,197,94,0.12)';  color = '#22c55e'; label = 'Concluído';   dot = '#22c55e' }
  else if (pct > 0) { bg = 'rgba(245,158,11,0.12)'; color = '#f59e0b'; label = 'Em progresso'; dot = '#f59e0b' }
  else { bg = 'rgba(148,163,184,0.10)';             color = '#94a3b8'; label = 'Não iniciado'; dot = '#64748b' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
      {label}
    </span>
  )
}

// ─── Mini bar ────────────────────────────────────────────────────────────────

function MiniBar({ pct, color }) {
  return (
    <div style={{ background: 'var(--ink-05)', borderRadius: 999, height: 4, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Progresso() {
  const { progress, reset } = useProgress()
  const completed = progress.completedLessons
  const totalCompleted = Object.keys(completed).length
  const overallPct = Math.round((totalCompleted / TOTAL) * 100)

  const [filter, setFilter] = useState('all') // category id or 'all'

  // Module-level stats
  const moduleStats = useMemo(() => CATALOG.map(mod => {
    const done = mod.lessons.filter(l => completed[`${mod.moduleId}:${l.id}`]).length
    const total = mod.lessons.length
    const pct = Math.round((done / total) * 100)
    const lastTs = mod.lessons
      .map(l => completed[`${mod.moduleId}:${l.id}`])
      .filter(Boolean)
      .reduce((a, b) => Math.max(a, b), 0)
    return { ...mod, done, total, pct, lastTs }
  }), [completed])

  // Category-level stats
  const categoryStats = useMemo(() => CATEGORIES.map(cat => {
    const mods = moduleStats.filter(m => m.category === cat.id)
    const total = mods.reduce((acc, m) => acc + m.total, 0)
    const done = mods.reduce((acc, m) => acc + m.done, 0)
    const pct = total === 0 ? 0 : Math.round((done / total) * 100)
    const completedModules = mods.filter(m => m.pct === 100).length
    const inProgressModules = mods.filter(m => m.pct > 0 && m.pct < 100).length
    return { ...cat, total, done, pct, completedModules, inProgressModules, totalModules: mods.length }
  }), [moduleStats])

  // KPI stats
  const inProgressCount = moduleStats.filter(m => m.pct > 0 && m.pct < 100).length
  const completedModulesCount = moduleStats.filter(m => m.pct === 100).length
  const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000
  const thisWeek = Object.values(completed).filter(ts => ts > oneWeekAgo).length
  const earAccuracy = progress.ear.attempts > 0
    ? Math.round((progress.ear.score / progress.ear.attempts) * 100)
    : 0

  const visibleModules = filter === 'all' ? moduleStats : moduleStats.filter(m => m.category === filter)

  // Recent activity
  const recent = Object.entries(completed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([key, ts]) => {
      const [moduleId, lessonId] = key.split(':')
      const mod = CATALOG.find(m => m.moduleId === moduleId)
      const lesson = mod?.lessons.find(l => l.id === lessonId)
      return { key, mod, lesson, ts }
    })

  return (
    <div>
      <PageHeader
        chip="Dashboard"
        title="Meu Progresso"
        description="Visão geral do seu avanço no Harmony Hub — métricas, categorias e atividade recente."
      />

      {/* ── KPI Row ────────────────────────────────────────────────────── */}
      <Section title="Visão Geral">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
          <Kpi label="Lições totais"     value={TOTAL}                sub={`${CATALOG.length} módulos disponíveis`}    accent="#3b82f6" />
          <Kpi label="Concluídas"        value={totalCompleted}       sub={`${overallPct}% do total`}                  accent="#22c55e" trend={thisWeek > 0 ? Math.round((thisWeek / Math.max(totalCompleted, 1)) * 100) : null} />
          <Kpi label="Em progresso"      value={inProgressCount}      sub={`${completedModulesCount} módulos concluídos`} accent="#f59e0b" />
          <Kpi label="Acerto Ear-Lab"   value={`${earAccuracy}%`}    sub={`${progress.ear.score}/${progress.ear.attempts} tentativas`} accent="#a78bfa" />
        </div>

        {/* Overall progress hero */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ultra)' }}>
                Progresso geral
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1, marginTop: 4 }}>
                {totalCompleted} <span style={{ fontSize: 16, color: 'var(--text-ultra)', fontWeight: 600 }}>de {TOTAL}</span>
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#3b82f6,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              {overallPct}%
            </div>
          </div>
          <div style={{ background: 'var(--ink-05)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
            <div
              style={{
                width: `${overallPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg,#3b82f6,#a78bfa,#f472b6)',
                borderRadius: 999,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      </Section>

      {/* ── Category performance ──────────────────────────────────────── */}
      <Section title="Performance por categoria">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {categoryStats.map(cat => (
            <div key={cat.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-base)' }}>{cat.label}</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-ultra)' }}>{cat.totalModules} módulos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <CircleGauge pct={cat.pct} color={cat.color} size={78} stroke={6} />
                <div style={{ flex: 1, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                    {cat.completedModules} concluído{cat.completedModules !== 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                    {cat.inProgressModules} em progresso
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
                    {cat.totalModules - cat.completedModules - cat.inProgressModules} não iniciados
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-ultra)' }}>
                <b style={{ color: cat.color }}>{cat.done}</b> de {cat.total} lições
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Module Table ──────────────────────────────────────────────── */}
      <Section
        title="Todos os módulos"
        action={
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[{ id: 'all', label: 'Todos' }, ...CATEGORIES].map(c => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                style={{
                  padding: '4px 11px', borderRadius: 999,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: filter === c.id ? 'var(--ink-08)' : 'transparent',
                  color: filter === c.id ? 'var(--text-base)' : 'var(--text-ultra)',
                  border: `1px solid ${filter === c.id ? 'var(--ink-15)' : 'var(--ink-05)'}`,
                  transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1.5fr 1.2fr 1fr 40px',
            gap: 12, padding: '10px 16px',
            borderBottom: '1px solid var(--border-card)',
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-ultra)',
          }}>
            <div>Módulo</div>
            <div>Categoria</div>
            <div>Progresso</div>
            <div>Status</div>
            <div>Última atividade</div>
            <div />
          </div>

          {/* Rows */}
          {visibleModules.map(mod => {
            const cat = CATEGORIES.find(c => c.id === mod.category)
            return (
              <Link
                key={mod.moduleId}
                to={mod.route}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1.5fr 1.2fr 1fr 40px',
                  gap: 12, padding: '12px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ink-03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: mod.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-base)' }}>{mod.label}</span>
                </div>
                <div style={{ fontSize: 11, color: cat?.color ?? 'var(--text-muted)', fontWeight: 600 }}>
                  {cat?.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MiniBar pct={mod.pct} color={mod.color} />
                  <span style={{ fontSize: 11, color: 'var(--text-ultra)', minWidth: 32, textAlign: 'right' }}>
                    {mod.done}/{mod.total}
                  </span>
                </div>
                <div>
                  <StatusPill pct={mod.pct} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-ultra)' }}>
                  {mod.lastTs > 0
                    ? new Date(mod.lastTs).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                    : '—'}
                </div>
                <div style={{ textAlign: 'right', color: 'var(--text-ultra)', fontSize: 14 }}>›</div>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ── Recent Activity ────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <Section title="Atividade recente">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recent.map((item, i) => (
              <Link
                key={item.key}
                to={item.mod?.route ?? '/'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ink-03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Timeline dot */}
                <div style={{ position: 'relative', width: 16, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {i < recent.length - 1 && (
                    <div style={{ position: 'absolute', top: 12, bottom: -10, width: 1, background: 'var(--ink-05)' }} />
                  )}
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: item.mod?.color ?? '#60a5fa',
                    boxShadow: `0 0 0 3px rgba(15,23,42,1)`,
                    zIndex: 1,
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-base)' }}>
                    {item.lesson?.label ?? '—'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-ultra)' }}>
                    {item.mod?.label ?? '—'}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-ultra)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                  {new Date(item.ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ── Reset ──────────────────────────────────────────────────────── */}
      {totalCompleted > 0 && (
        <Section title="Configurações">
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-base)' }}>Reiniciar progresso</div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Remove todas as lições marcadas e dados do Lab Auditivo. Esta ação não pode ser desfeita.
              </p>
            </div>
            <button
              onClick={() => { if (window.confirm('Tem certeza? Isso apagará todo o seu progresso.')) reset() }}
              style={{
                padding: '7px 14px', borderRadius: 8,
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171',
              }}
            >
              Reiniciar tudo
            </button>
          </div>
        </Section>
      )}
    </div>
  )
}
