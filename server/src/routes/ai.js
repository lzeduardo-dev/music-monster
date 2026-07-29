import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import OpenAI from 'openai'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { chatSchema } from '../schemas/ai.js'

const router = Router()

const API_KEY = process.env.OPENAI_API_KEY
const MODEL_NAME = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

if (!API_KEY) {
  console.warn(
    '[ai] OPENAI_API_KEY ausente — POST /api/ai/chat vai responder 503.'
  )
}

const openai = API_KEY ? new OpenAI({ apiKey: API_KEY }) : null

// Rate limit dedicado: tokens custam dinheiro, então é mais apertado.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Você atingiu o limite de mensagens. Aguarde um minuto.',
  },
})

function buildSystemPrompt({ currentPageLabel, currentRoute }) {
  const lines = [
    'Você é o tutor de teoria musical do MusicMonster, um app de educação musical para guitarristas brasileiros.',
    '',
    'Personalidade: professor amigável, paciente e direto. Português brasileiro coloquial.',
    'Foco em ensinar: explique conceitos, dê exemplos práticos no braço da guitarra (ex: "5ª corda, casa 3"), e conecte com músicas conhecidas quando ajudar a fixar.',
    '',
    'Regras:',
    '- Responda APENAS sobre música: teoria, harmonia, escalas, modos, ritmo, acordes, técnica, improviso, escuta, história.',
    '- Se a pergunta sair do tema musical, redirecione com gentileza ("Sou seu tutor de música — posso te ajudar com X").',
    '- Respostas CURTAS e DIRETAS: prefira 2-4 parágrafos pequenos. Use bullets quando organizar bem.',
    '- Não invente nomes de lições ou rotas que o usuário não tenha mencionado.',
  ]

  if (currentPageLabel) {
    lines.push('')
    lines.push(
      `CONTEXTO ATUAL: o usuário está estudando "${currentPageLabel}" (rota: ${
        currentRoute ?? '?'
      }). Quando fizer sentido, conecte a explicação a esse tópico.`
    )
  } else if (currentRoute) {
    lines.push('')
    lines.push(`CONTEXTO ATUAL: o usuário está na rota ${currentRoute}.`)
  }

  return lines.join('\n')
}

router.use(authenticate)
router.use(aiLimiter)

router.post('/chat', validate(chatSchema), async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({
        error: 'O tutor de IA não está configurado neste servidor.',
      })
    }

    const { messages, currentRoute, currentPageLabel } = req.validated

    const last = messages[messages.length - 1]
    if (last.role !== 'user') {
      return res
        .status(400)
        .json({ error: 'A última mensagem deve ser do usuário.' })
    }

    const systemPrompt = buildSystemPrompt({ currentPageLabel, currentRoute })

    // Schema interno usa 'ai' para o assistente; OpenAI usa 'assistant'.
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
    ]

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 800,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return res.status(502).json({
        error: 'A IA não retornou uma resposta. Tente novamente.',
      })
    }

    res.json({ reply })
  } catch (err) {
    console.error('[ai] chat error:', err?.message || err)

    // Distingue quota da OpenAI (402) de rate-limit real (429).
    if (err?.status === 429 && err?.code === 'insufficient_quota') {
      return res.status(402).json({
        error:
          'A conta da OpenAI está sem créditos. Adicione um método de pagamento em platform.openai.com/settings/organization/billing.',
      })
    }
    if (err?.status === 401) {
      return res.status(502).json({
        error:
          'A chave da OpenAI está inválida ou foi revogada. Gere uma nova em platform.openai.com/api-keys.',
      })
    }
    // Qualquer outro erro da API (rede, 5xx, timeouts, etc.)
    if (err?.status >= 500 || err?.name === 'APIConnectionError') {
      return res.status(502).json({
        error: 'A OpenAI está com instabilidade. Tenta de novo em alguns segundos.',
      })
    }
    next(err)
  }
})

export default router
