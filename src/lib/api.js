const BASE = '/api'

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Cookie httpOnly de sessão é injetado pelo browser.
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data.error ?? `HTTP ${res.status}`)
    error.status = res.status
    error.details = data.details
    throw error
  }

  return data
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
}
