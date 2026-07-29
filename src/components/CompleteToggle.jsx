// Ícone circular de "concluído" — mesmo padrão do LessonFooter.
// Vazio (cinza) quando pendente, verde sólido quando marcado.

export default function CompleteToggle({
  done,
  onClick,
  label = 'concluída',
  size = 40,
}) {
  const cap = label.charAt(0).toUpperCase() + label.slice(1)
  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      aria-label={done ? `Desmarcar ${label}` : `Marcar como ${label}`}
      title={
        done
          ? `${cap} — clique para desmarcar`
          : `Marcar como ${label}`
      }
      className="grid place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
      style={{
        width: size,
        height: size,
        background: done ? '#22c55e' : 'transparent',
        border: done
          ? '2px solid #22c55e'
          : '2px solid var(--border-card)',
        color: done ? '#ffffff' : 'var(--text-subtle)',
        boxShadow: done ? '0 4px 14px rgba(34,197,94,0.35)' : 'none',
        transition:
          'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.42)}
        height={Math.round(size * 0.42)}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3.5 8L6.5 11L12.5 5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
