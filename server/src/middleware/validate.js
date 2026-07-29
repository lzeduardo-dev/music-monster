export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      return res.status(400).json({
        error: 'Dados inválidos.',
        details: fieldErrors,
      })
    }
    req.validated = result.data
    next()
  }
}
