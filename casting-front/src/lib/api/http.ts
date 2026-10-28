import { apiBaseUrl } from '@/lib/config'

type ProblemDetails = {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

type ApiErrorInit = {
  status: number
  title: string
  detail: string | null
  fieldErrors: Record<string, string[]>
  retryAfterSeconds: number | null
}

export class ApiError extends Error {
  readonly status: number
  readonly title: string
  readonly detail: string | null
  readonly fieldErrors: Record<string, string[]>
  readonly retryAfterSeconds: number | null

  constructor(init: ApiErrorInit) {
    super(init.detail ?? init.title)
    this.name = 'ApiError'
    this.status = init.status
    this.title = init.title
    this.detail = init.detail
    this.fieldErrors = init.fieldErrors
    this.retryAfterSeconds = init.retryAfterSeconds
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  refreshOnUnauthorized?: boolean
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, refreshOnUnauthorized = true } = options

  let response = await send(path, method, body)
  if (response.status === 401 && refreshOnUnauthorized && (await refreshSession())) {
    response = await send(path, method, body)
  }

  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T

  const data: unknown = await response.json()
  return data as T
}

async function send(path: string, method: HttpMethod, body: unknown): Promise<Response> {
  try {
    return await fetch(`${apiBaseUrl}${path}`, {
      method,
      credentials: 'include', 
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError({
      status: 0,
      title: 'Network error',
      detail: null,
      fieldErrors: {},
      retryAfterSeconds: null,
    })
  }
}

let refreshing: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  refreshing ??= send('/api/auth/refresh', 'POST', undefined)
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

async function toApiError(response: Response): Promise<ApiError> {
  const problem = await readProblem(response)
  const retryAfter = Number(response.headers.get('Retry-After'))

  return new ApiError({
    status: response.status,
    title: problem.title ?? response.statusText,
    detail: problem.detail ?? null,
    fieldErrors: problem.errors ?? {},
    retryAfterSeconds: retryAfter > 0 ? retryAfter : null,
  })
}

async function readProblem(response: Response): Promise<ProblemDetails> {
  try {
    const data: unknown = await response.json()
    return typeof data === 'object' && data !== null ? (data as ProblemDetails) : {}
  } catch {
    return {}
  }
}