import { useState } from 'react'
import { PageHeader, Section } from '../components/Common.jsx'

// ─── Pricing data ────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'free',
    name: 'Grátis',
    tagline: 'Para começar a explorar',
    color: '#94a3b8',
    priceMonthly: 0,
    priceAnnual: 0,
    cta: 'Continuar grátis',
    features: [
      { label: 'Módulo de Fundamentos básicos', included: true },
      { label: '1 instrumento (violão)', included: true },
      { label: '3 escalas básicas (maior, pentatônica, blues)', included: true },
      { label: 'Quiz musical — 3 questões por dia', included: true },
      { label: 'Progresso salvo entre sessões', included: false },
      { label: 'Backing tracks de improviso', included: false },
      { label: 'Desconstruindo Lendas (6 artistas)', included: false },
      { label: 'Vocabulário de Licks (15 licks)', included: false },
      { label: 'Drone para prática de modos', included: false },
      { label: 'Laboratório do Groove (MPQ)', included: false },
      { label: 'Sem anúncios', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'O plano completo',
    color: '#3b82f6',
    accentGradient: 'linear-gradient(135deg, #3b82f6, #a78bfa)',
    badge: 'MAIS POPULAR',
    priceMonthly: 14.90,
    priceAnnual: 129,
    annualSavings: 49.80,
    cta: 'Assinar Pro',
    features: [
      { label: 'Tudo do plano Grátis', included: true, bold: true },
      { label: '106+ lições em todos os módulos', included: true },
      { label: 'Todos os instrumentos disponíveis', included: true },
      { label: 'Quiz ilimitado', included: true },
      { label: 'Todas as escalas, modos e arpejos', included: true },
      { label: 'Sistema CAGED completo', included: true },
      { label: 'Backing tracks ilimitadas', included: true },
      { label: 'Desconstruindo Lendas — 6 artistas', included: true },
      { label: 'Vocabulário de Licks — 15 licks autênticos', included: true },
      { label: 'Drone harmônico para modos gregos', included: true },
      { label: 'Laboratório do Groove (sistema MPQ)', included: true },
      { label: 'Sincronização entre dispositivos', included: true },
      { label: 'Sem anúncios', included: true },
      { label: 'Suporte por e-mail', included: true },
    ],
  },
  {
    id: 'master',
    name: 'Master',
    tagline: 'Para quem quer ir além',
    color: '#a78bfa',
    accentGradient: 'linear-gradient(135deg, #a78bfa, #f472b6)',
    priceMonthly: 39.90,
    priceAnnual: 349,
    annualSavings: 129.80,
    cta: 'Assinar Master',
    features: [
      { label: 'Tudo do plano Pro', included: true, bold: true },
      { label: 'Aula particular ao vivo — 30 min/mês', included: true, highlight: true },
      { label: 'Análise personalizada da sua execução', included: true, highlight: true },
      { label: 'Acesso antecipado a novos módulos', included: true },
      { label: 'Comunidade Discord VIP', included: true },
      { label: 'Backing tracks personalizadas (1/mês)', included: true },
      { label: 'Plano de estudo individual', included: true },
      { label: 'Suporte prioritário em até 24h', included: true },
      { label: 'Certificado de conclusão dos módulos', included: true },
    ],
  },
]

// ─── Competitor comparison data ──────────────────────────────────────────────
// Pesquisa de mercado realizada em maio/2026.

const COMPETITORS = [
  {
    name: 'Harmony Hub Pro',
    monthly: 14.90,
    annual: 129,
    pt: true,
    theory: true,
    backing: true,
    artists: true,
    highlight: true,
  },
  { name: 'Cifra Club Pro',     monthly: null,   annual: 99,     pt: true,  theory: false, backing: false, artists: false, note: 'Foco em cifras' },
  { name: 'JustinGuitar Plus',  monthly: 49.50,  annual: 434,    pt: false, theory: true,  backing: false, artists: false, note: '$9 / $79 USD' },
  { name: 'Hookpad (teoria)',   monthly: 27.45,  annual: 274,    pt: false, theory: true,  backing: false, artists: false, note: '$4.99 / $49.99 USD' },
  { name: 'Yousician Premium',  monthly: 109.90, annual: 659,    pt: false, theory: false, backing: true,  artists: false, note: '$19.99 / $119.99 USD' },
  { name: 'Fender Play',        monthly: 109.90, annual: 825,    pt: false, theory: true,  backing: false, artists: false, note: '$19.99 / $149.99 USD' },
  { name: 'Guitar Tricks',      monthly: 109.95, annual: 989,    pt: false, theory: true,  backing: true,  artists: false, note: '$19.95 / $179.99 USD' },
  { name: 'TrueFire All Access', monthly: 159.50, annual: 1369,  pt: false, theory: true,  backing: true,  artists: true,  note: '$29 / $249 USD' },
]

const FAQ = [
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Você pode cancelar a assinatura a qualquer momento direto no app — sem multas, sem perguntas. Você continua com acesso até o fim do período já pago.',
  },
  {
    q: 'O plano Grátis tem prazo?',
    a: 'Não. O plano Grátis é permanente. Use o tempo que quiser, sem pressão pra fazer upgrade. Os recursos premium ficam visualmente "bloqueados" no app — você sempre sabe o que existe.',
  },
  {
    q: 'Posso experimentar o Pro antes de pagar?',
    a: 'Sim. Todo novo usuário recebe 7 dias de Pro grátis ao se cadastrar. Não pedimos cartão de crédito — se você não assinar ao final, volta para o plano Grátis automaticamente.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Cartão de crédito (Visa, Mastercard, Elo, Amex), Pix e boleto bancário. Cartão e Pix liberam o acesso na hora; boleto leva 1–2 dias úteis.',
  },
  {
    q: 'A aula particular do Master é com quem?',
    a: 'Com músicos profissionais certificados pelo Harmony Hub — professores ativos no mercado com experiência em MPB, jazz, blues ou rock. Você escolhe o estilo e agenda direto pelo app.',
  },
  {
    q: 'Tem desconto para estudantes?',
    a: 'Sim! Estudantes (com comprovante de matrícula) recebem 40% de desconto no plano Pro anual. Entre em contato pelo suporte e enviaremos um cupom.',
  },
  {
    q: 'Vou poder usar offline?',
    a: 'No plano Pro e Master, sim. Você pode baixar módulos completos para estudar sem internet — útil em viagens ou no transporte.',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v) => v == null
  ? '—'
  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

// ─── Components ──────────────────────────────────────────────────────────────

function CheckIcon({ included, color }) {
  if (included) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" />
        <path d="M4 7L6 9L10 5" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6.5" fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
      <path d="M4 4L10 10M10 4L4 10" stroke="rgba(148,163,184,0.5)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Planos() {
  const [billing, setBilling] = useState('annual') // 'monthly' | 'annual'

  return (
    <div>
      <PageHeader
        chip="Premium"
        title="Planos"
        description="Escolha o plano certo para você. Cancele a qualquer momento — sem multas, sem perguntas."
      />

      {/* ── Billing toggle ─────────────────────────────────────────────── */}
      <Section title="Como você quer pagar?">
        <div style={{
          display: 'inline-flex',
          padding: 4, borderRadius: 999,
          background: 'var(--ink-03)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 4,
        }}>
          {[
            { id: 'monthly', label: 'Mensal' },
            { id: 'annual',  label: 'Anual', badge: '-28%' },
          ].map(opt => {
            const active = billing === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setBilling(opt.id)}
                style={{
                  padding: '8px 18px', borderRadius: 999,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: active ? 'rgba(59,130,246,0.18)' : 'transparent',
                  color: active ? '#60a5fa' : 'var(--text-muted)',
                  border: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
                {opt.badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 800,
                    padding: '2px 6px', borderRadius: 999,
                    background: 'rgba(34,197,94,0.18)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}>
                    {opt.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Pricing cards ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14, marginTop: 16,
        }}>
          {PLANS.map(plan => {
            const isPro = plan.id === 'pro'
            const isAnnual = billing === 'annual'
            const monthly = isAnnual ? (plan.priceAnnual / 12) : plan.priceMonthly
            const isFree = plan.id === 'free'

            return (
              <div
                key={plan.id}
                className="card"
                style={{
                  padding: 22,
                  position: 'relative',
                  borderTop: `3px solid ${plan.color}`,
                  background: isPro
                    ? 'linear-gradient(180deg, rgba(59,130,246,0.06), var(--bg-card) 60%)'
                    : 'var(--bg-card)',
                  boxShadow: isPro
                    ? '0 16px 50px rgba(59,130,246,0.10), 0 0 0 1px rgba(59,130,246,0.18)'
                    : 'var(--shadow-card)',
                  transform: isPro ? 'translateY(-4px)' : 'none',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '3px 10px',
                    fontSize: 9, fontWeight: 800,
                    letterSpacing: '0.12em',
                    borderRadius: 999,
                    background: plan.accentGradient,
                    color: '#fff',
                    boxShadow: '0 6px 20px rgba(59,130,246,0.4)',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ fontSize: 11, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {plan.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-ultra)', marginBottom: 16 }}>
                  {plan.tagline}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 16 }}>
                  {isFree ? (
                    <div>
                      <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1 }}>
                        Grátis
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--text-ultra)', marginTop: 4 }}>
                        Sempre. Sem prazo. Sem cartão.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600 }}>R$</span>
                        <span style={{ fontSize: 38, fontWeight: 800, color: 'var(--text-base)', lineHeight: 1 }}>
                          {monthly.toFixed(2).replace('.', ',')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-ultra)' }}>/mês</span>
                      </div>
                      {isAnnual && (
                        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                          {fmtBRL(plan.priceAnnual)}/ano · economiza {fmtBRL(plan.annualSavings)}
                        </div>
                      )}
                      {!isAnnual && (
                        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-ultra)' }}>
                          cobrado mensalmente
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CTA */}
                <button
                  style={{
                    width: '100%', padding: '12px 16px',
                    borderRadius: 10, cursor: 'pointer',
                    fontSize: 13, fontWeight: 700,
                    background: isFree
                      ? 'var(--ink-03)'
                      : (plan.accentGradient || plan.color),
                    color: isFree ? 'var(--text-muted)' : '#fff',
                    border: isFree
                      ? '1px solid rgba(255,255,255,0.1)'
                      : 'none',
                    marginBottom: 18,
                    transition: 'transform 0.08s ease, filter 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{
                      display: 'flex', gap: 8, alignItems: 'flex-start',
                      fontSize: 12,
                      color: f.included
                        ? (f.bold || f.highlight ? 'var(--text-base)' : 'var(--text-muted)')
                        : 'var(--text-ultra)',
                      fontWeight: f.bold ? 700 : 400,
                      lineHeight: 1.4,
                    }}>
                      <CheckIcon included={f.included} color={plan.color} />
                      <span>
                        {f.label}
                        {f.highlight && <span style={{ marginLeft: 5, fontSize: 9, padding: '1px 6px', borderRadius: 999, background: `${plan.color}20`, color: plan.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>exclusivo</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center',
          marginTop: 24, padding: 14,
          background: 'var(--ink-03)', borderRadius: 12,
        }}>
          {[
            { icon: '🛡️', label: 'Cancele a qualquer momento' },
            { icon: '🎁', label: '7 dias grátis no Pro' },
            { icon: '💳', label: 'Pix, cartão ou boleto' },
            { icon: '📚', label: 'Estudantes: 40% OFF' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: 'var(--text-muted)',
            }}>
              <span style={{ fontSize: 14 }}>{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Competitor comparison ──────────────────────────────────── */}
      <Section title="Como nos comparamos">
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Pesquisamos os principais apps de educação musical do mercado em maio/2026.
          Valores em dólar foram convertidos a R$ 5,50.
        </p>

        <div className="card" style={{ padding: 0, overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink-03)' }}>
                {['Plataforma', 'Mensal', 'Anual', 'Em PT?', 'Teoria', 'Backing', 'Análise de artistas'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 700,
                    color: 'var(--text-ultra)',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    borderBottom: '1px solid var(--border-card)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c, i) => (
                <tr
                  key={c.name}
                  style={{
                    background: c.highlight ? 'rgba(59,130,246,0.06)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{
                      fontSize: 13, fontWeight: c.highlight ? 800 : 600,
                      color: c.highlight ? '#60a5fa' : 'var(--text-base)',
                    }}>
                      {c.name}
                      {c.highlight && <span style={{ marginLeft: 6, fontSize: 9, padding: '2px 6px', borderRadius: 999, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 700 }}>NÓS</span>}
                    </div>
                    {c.note && (
                      <div style={{ fontSize: 10, color: 'var(--text-ultra)', marginTop: 2 }}>
                        {c.note}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtBRL(c.monthly)}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', fontWeight: c.highlight ? 700 : 400 }}>
                    {fmtBRL(c.annual)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {c.pt ? <CheckIcon included color="#22c55e" /> : <CheckIcon included={false} />}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {c.theory ? <CheckIcon included color="#3b82f6" /> : <CheckIcon included={false} />}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {c.backing ? <CheckIcon included color="#a78bfa" /> : <CheckIcon included={false} />}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {c.artists ? <CheckIcon included color="#f472b6" /> : <CheckIcon included={false} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-ultra)', marginTop: 10, lineHeight: 1.5 }}>
          * Cifra Club Pro foca em cifras e tablaturas — não tem teoria avançada nem análise harmônica.
          Hookpad é teoria/composição mas em inglês e sem aulas. Yousician, Fender Play e Guitar Tricks
          focam em aulas práticas mas pouca teoria aprofundada. TrueFire tem o catálogo mais completo
          mas custa 10× mais e é em inglês.
        </p>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <Section title="Perguntas frequentes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </Section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <Section title="Pronto para começar?">
        <div className="card" style={{
          padding: 24, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(167,139,250,0.08))',
          border: '1px solid rgba(167,139,250,0.2)',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-base)', marginBottom: 6 }}>
            7 dias de Pro grátis.
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Sem cartão de crédito. Sem renovação automática. Se não amar, volta pro plano Grátis.
          </div>
          <button
            style={{
              padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
              fontSize: 14, fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #a78bfa)',
              color: '#fff', border: 'none',
              boxShadow: '0 8px 24px rgba(59,130,246,0.25)',
            }}
          >
            Começar trial grátis →
          </button>
        </div>
      </Section>
    </div>
  )
}

// ─── FAQ item (collapsible) ─────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="card"
      style={{
        padding: 0, overflow: 'hidden',
        transition: 'background 0.15s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', cursor: 'pointer',
          background: 'transparent', border: 'none',
          fontSize: 13, fontWeight: 600, color: 'var(--text-base)',
        }}
      >
        {q}
        <span style={{
          fontSize: 14, color: 'var(--text-ultra)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: '0 16px 14px',
          fontSize: 12, color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          {a}
        </div>
      )}
    </div>
  )
}
