import { useState } from 'react'
import { PageHeader, Section, TheoryBlock, Step } from './Common.jsx'
import GuitarChordDiagram from './GuitarChordDiagram.jsx'
import { chordWithOctaves } from '../lib/theory.js'
import { playChord, playChordSequence } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'
import CompleteToggle from './CompleteToggle.jsx'

// ─── Photo card (one of three numbered images) ──────────────────────────────

function PhotoCard({ src, alt, color, idx, label }) {
  const [error, setError] = useState(false)
  if (error) return null
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '4 / 5',
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid ${color}25`,
      boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
      background: 'rgba(0,0,0,0.4)',
    }}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
          filter: 'saturate(1.03)',
        }}
      />
      {/* Bottom gradient + label */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.75) 100%)`,
        pointerEvents: 'none',
      }} />
      {/* Number badge */}
      <div style={{
        position: 'absolute', top: 10, left: 10,
        width: 24, height: 24, borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        border: `1px solid ${color}50`,
        color, fontSize: 11, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        {idx + 1}
      </div>
      {/* Label */}
      {label && (
        <div style={{
          position: 'absolute', bottom: 10, left: 12, right: 12,
          fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          letterSpacing: '0.04em',
        }}>
          {label}
        </div>
      )}
    </div>
  )
}

// ─── Reusable Artist Page ───────────────────────────────────────────────────

export default function ArtistPage({ data }) {
  const [songId, setSongId] = useState(data.songs[0].id)
  const [hoverChord, setHoverChord] = useState(null)
  const { markLesson, isComplete } = useProgress()

  const song = data.songs.find(s => s.id === songId) ?? data.songs[0]

  const playChordCard = (root, chordKey) => {
    try {
      const pitches = chordWithOctaves(root, chordKey, 3)
      playChord(pitches, 1.2)
    } catch {}
  }

  const playProgression = (chords) => {
    try {
      const arrays = chords.map(label => {
        const { root, key } = song.chords.find(c => c.label === label) ?? {}
        if (!root) return null
        return chordWithOctaves(root, key, 3)
      }).filter(Boolean)
      playChordSequence(arrays, 1.4)
    } catch {}
  }

  // Normalize images: support both `images` array and legacy single `image`
  const images = data.images && data.images.length > 0
    ? data.images
    : (data.image ? [{ src: data.image, label: data.name }] : [])

  return (
    <div>
      <PageHeader
        chip={`Desconstruindo Lendas · ${data.category}`}
        title={data.name}
        description={data.bio}
      />

      {/* ── Hero: 3-photo showcase ─────────────────────────────────── */}
      <Section title={`Quem é ${data.name}`}>
        {/* Bio + metadata */}
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            {data.fullName && (
              <div style={{
                fontSize: 11, fontWeight: 700, color: data.color,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
              }}>
                {data.fullName}
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              {data.born && (
                <span><b style={{ color: 'var(--text-base)' }}>Nascido:</b> {data.born}</span>
              )}
              {data.era && (
                <span><b style={{ color: 'var(--text-base)' }}>Carreira:</b> {data.era}</span>
              )}
            </div>
            {data.genres && data.genres.length > 0 && (
              <div style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.genres.map(g => (
                  <span key={g} className="chip" style={{ fontSize: 10 }}>{g}</span>
                ))}
              </div>
            )}
          </div>

          {data.trademarks && data.trademarks.length > 0 && (
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
              }}>
                Marcas registradas
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                {data.trademarks.map((t, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    fontSize: 12, color: 'var(--text-muted)',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: data.color, marginTop: 7, flexShrink: 0,
                    }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 3-photo grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {images.slice(0, 3).map((img, i) => (
            <PhotoCard
              key={i}
              src={typeof img === 'string' ? img : img.src}
              alt={`${data.name} — foto ${i + 1}`}
              color={data.color}
              idx={i}
              label={typeof img === 'object' ? img.label : ''}
            />
          ))}
        </div>
      </Section>

      {/* ── Song selector ──────────────────────────────────────────── */}
      <Section title="Obras destrinchadas">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {data.songs.map(s => {
            const active = s.id === songId
            return (
              <button
                key={s.id}
                onClick={() => setSongId(s.id)}
                style={{
                  padding: '8px 16px', borderRadius: 12,
                  background: active ? `${s.accent}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? `${s.accent}50` : 'rgba(255,255,255,0.08)'}`,
                  color: active ? s.accent : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  minWidth: 120, transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 14 }}>{s.title}</span>
                <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>
                  {s.year} · {s.key}
                </span>
              </button>
            )
          })}
        </div>

        {/* Song header */}
        <div className="card" style={{
          padding: 18, marginBottom: 16,
          borderLeft: `3px solid ${song.accent}`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, marginBottom: 10,
          }}>
            <div>
              <div style={{
                fontSize: 22, fontWeight: 800,
                color: 'var(--text-base)', lineHeight: 1.1,
              }}>
                {song.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-ultra)', marginTop: 2 }}>
                {song.year} · álbum <i>{song.album}</i> · tom de{' '}
                <b style={{ color: song.accent }}>{song.key}</b>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignSelf: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: song.accent }}>
                  {song.chords.length}
                </div>
                <div style={{
                  fontSize: 9, color: 'var(--text-ultra)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>Acordes</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: song.accent }}>
                  {song.sections.length}
                </div>
                <div style={{
                  fontSize: 9, color: 'var(--text-ultra)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>Seções</div>
              </div>
            </div>
          </div>
          <p style={{
            fontSize: 13, color: 'var(--text-muted)',
            lineHeight: 1.6, margin: 0,
          }}>
            {song.description}
          </p>

          {/* Composition exploration */}
          {song.composition && (
            <div style={{
              marginTop: 14,
              padding: '12px 14px',
              borderRadius: 10,
              background: `${song.accent}08`,
              border: `1px solid ${song.accent}20`,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: song.accent,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 6,
              }}>
                ♪ A composição
              </div>
              <p style={{
                fontSize: 12, color: 'var(--text-muted)',
                lineHeight: 1.55, margin: 0,
              }}>
                {song.composition}
              </p>
            </div>
          )}
        </div>

        {/* Chord palette */}
        <div style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
        }}>
          Paleta de acordes
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 10, marginBottom: 24,
        }}>
          {song.chords.map((c, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoverChord(c.label)}
              onMouseLeave={() => setHoverChord(null)}
              onClick={() => playChordCard(c.root, c.key)}
              className="card"
              style={{
                padding: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                border: `1px solid ${hoverChord === c.label ? song.accent + '60' : 'var(--border-card)'}`,
                background: hoverChord === c.label ? `${song.accent}08` : 'var(--bg-card)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                border: `1px solid ${song.accent}30`, borderRadius: 12,
                padding: '8px 6px', background: `${song.accent}06`, marginBottom: 6,
              }}>
                <GuitarChordDiagram
                  root={c.root}
                  chordKey={c.key}
                  accentColor={song.accent}
                  width={108}
                  height={140}
                />
              </div>
              <div style={{
                fontSize: 16, fontWeight: 800, color: song.accent, lineHeight: 1,
              }}>{c.label}</div>
              <div style={{
                fontSize: 10, color: 'var(--text-ultra)',
                textAlign: 'center', marginTop: 4, lineHeight: 1.3,
              }}>
                {c.role}
              </div>
            </div>
          ))}
        </div>

        {/* Sections / progressions */}
        <div style={{
          fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
        }}>
          Estrutura da música
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {song.sections.map((sec, i) => (
            <div key={i} className="card" style={{ padding: 14 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: `${song.accent}20`, color: song.accent,
                    fontSize: 11, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--text-base)',
                  }}>{sec.name}</span>
                </div>
                <button
                  onClick={() => playProgression(sec.progression)}
                  style={{
                    padding: '4px 11px', borderRadius: 8,
                    fontSize: 10, fontWeight: 700, cursor: 'pointer',
                    background: `${song.accent}15`, color: song.accent,
                    border: `1px solid ${song.accent}30`,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}
                >
                  ▶ Tocar progressão
                </button>
              </div>

              <div style={{
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', gap: 4, marginBottom: 10,
              }}>
                {sec.progression.map((label, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <button
                      onClick={() => {
                        const c = song.chords.find(x => x.label === label)
                        if (c) playChordCard(c.root, c.key)
                      }}
                      onMouseEnter={() => setHoverChord(label)}
                      onMouseLeave={() => setHoverChord(null)}
                      style={{
                        padding: '6px 12px', borderRadius: 8,
                        fontFamily: 'monospace', fontSize: 13, fontWeight: 800,
                        background: hoverChord === label
                          ? `${song.accent}25`
                          : `${song.accent}10`,
                        color: song.accent,
                        border: `1px solid ${hoverChord === label
                          ? song.accent + '60'
                          : song.accent + '25'}`,
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                    >
                      {label}
                    </button>
                    {j < sec.progression.length - 1 && (
                      <span style={{ fontSize: 10, color: 'var(--text-ultra)' }}>→</span>
                    )}
                  </div>
                ))}
              </div>

              <p style={{
                fontSize: 12, color: 'var(--text-muted)',
                lineHeight: 1.5, margin: 0,
              }}>
                {sec.analysis}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <CompleteToggle
            done={isComplete(data.id, song.id)}
            onClick={() => markLesson(data.id, song.id)}
          />
        </div>
      </Section>

      {/* ── Lições ────────────────────────────────────────────────── */}
      {data.lessons && data.lessons.length > 0 && (
        <Section title={`O que aprendemos com ${data.name}`}>
          <TheoryBlock>
            {data.lessons.map((l, i) => (
              <Step key={i}>
                <p>
                  {l.title && <b>{l.title}.</b>} {l.text}
                </p>
              </Step>
            ))}
          </TheoryBlock>
        </Section>
      )}
    </div>
  )
}
