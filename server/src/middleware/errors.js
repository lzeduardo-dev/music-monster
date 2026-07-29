export function notFound(req, res) {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(`[error] ${err.message}`, err.stack)
  const status = err.status ?? err.statusCode ?? 500
  const message = status < 500 ? err.message : 'Erro interno do servidor.'
  res.status(status).json({ error: message })
}
