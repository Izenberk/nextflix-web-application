const ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
const RAW_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? '/api/v1'
const BASE_PATH = RAW_BASE_PATH ? `/${RAW_BASE_PATH.replace(/^\/+/, '').replace(/\/+$/, '')}` : ''
const BASE = `${ORIGIN}${BASE_PATH}`

export function buildUrl(path: string, query?: Record<string, unknown>) {
  const p = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${BASE}${p}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      if (Array.isArray(v)) {
        v.forEach((val) => url.searchParams.append(k, String(val)))
      } else if (typeof v === 'object') {
        // objects → JSON (explicit)
        url.searchParams.set(k, JSON.stringify(v))
      } else {
        url.searchParams.set(k, String(v))
      }
    }
  }
  return url.toString()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public url: string,
    public body?: unknown,
  ) {
    super(`HTTP ${status} ${statusText} (${url})`)
  }
}

type RequestOpts = {
  query?: Record<string, unknown>
  timeoutMs?: number
  signal?: AbortSignal
  headers?: Record<string, string>
  credentials?: RequestCredentials
} & Omit<RequestInit, 'headers' | 'signal' | 'credentials'>

function safeJson(text: string) {
  try { return JSON.parse(text) } catch { return undefined }
}

async function request<T>(method: string, path: string, opts: RequestOpts = {}): Promise<T> {
  const { query, timeoutMs = 10_000, signal, headers, credentials, ...rest } = opts
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const url = buildUrl(path, query)

  const baseHeaders: Record<string,string> = { Accept: 'application/json' }
  // Only attach content-type when we actually send a body
  if (rest.body !== undefined && rest.body !== null) {
    baseHeaders['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(url, {
      method,
      cache: 'no-store',
      headers: { ...baseHeaders, ...headers },
      signal: signal ?? controller.signal,
      credentials,
      ...rest,
    })

    const text = await res.text()
    const json = text ? safeJson(text) : undefined

    if (!res.ok) throw new ApiError(res.status, res.statusText, url, json ?? text)
    return (json as T) ?? (undefined as unknown as T)
  } finally {
    clearTimeout(timer)
  }
}

export const apiGet    = <T>(path: string, opts?: RequestOpts) => request<T>('GET', path, opts)
export const apiPost   = <T>(path: string, body?: unknown, opts?: RequestOpts) =>
  request<T>('POST', path, { body: body ? JSON.stringify(body) : undefined, ...opts })
export const apiDelete = <T>(path: string, opts?: RequestOpts) => request<T>('DELETE', path, opts)

export { BASE as API_BASE }
