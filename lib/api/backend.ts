/**
 * Server-only client for the LDB DVA backend.
 *
 * This file must never be imported from a Client Component. All calls to
 * https://hackathon-api.ldbafrica.com go through here, inside our own
 * app/api/* route handlers (the "BFF" pattern), so that:
 *   - the backend's base URL / any future API key never reaches the browser
 *   - the cross-origin `ldb_session` cookie is translated into a same-origin
 *     cookie (`ldb_fe_session`) that our own middleware can read
 */

const BACKEND_URL =
    process.env.BACKEND_API_URL

export const FE_SESSION_COOKIE = "ldb_fe_session"
/** Stores the merchant's Bearer API key, httpOnly, never sent to the browser. */
export const FE_API_KEY_COOKIE = "ldb_fe_api_key"

export interface BackendEnvelope<T> {
    status: "success" | "failure"
    status_code: number
    message: string
    data: T
}

export class ApiError extends Error {
    status: number
    body: unknown

    constructor(message: string, status: number, body?: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.body = body
    }
}

interface BackendRequestOptions extends Omit<RequestInit, "body"> {
    /** JSON body - will be stringified. Do not use together with `formData`. */
    json?: unknown
    /** multipart/form-data body, e.g. for document/file uploads. */
    formData?: FormData
    /** The session cookie value forwarded from the browser (our own cookie). */
    sessionCookie?: string | null
    /** Explicit bearer API key, for developer-route calls. */
    apiKey?: string | null
}

/**
 * Calls the LDB backend and returns the parsed `data` field of the standard
 * `{ status, status_code, message, data }` envelope described in the API
 * Flow Guide. Throws `ApiError` for non-2xx responses or `status: "failure"`.
 */
export async function backendFetch<T = unknown>(
    path: string,
    options: BackendRequestOptions = {}
): Promise<T> {
    const { json, formData, sessionCookie, apiKey, headers, ...rest } = options

    const finalHeaders: Record<string, string> = {
        Accept: "application/json",
        ...(headers as Record<string, string> | undefined),
    }

    let body: BodyInit | undefined
    if (formData) {
        body = formData
        // Let fetch set the multipart boundary itself - do not set Content-Type.
    } else if (json !== undefined) {
        finalHeaders["Content-Type"] = "application/json"
        body = JSON.stringify(json)
    }

    if (sessionCookie) {
        finalHeaders["Cookie"] = `ldb_session=${sessionCookie}`
    }
    if (apiKey) {
        finalHeaders["Authorization"] = `Bearer ${apiKey}`
    }

    let response: Response
    try {
        response = await fetch(`${BACKEND_URL}${path}`, {
            ...rest,
            headers: finalHeaders,
            body,
            cache: "no-store",
        })
    } catch (err) {
        throw new ApiError(
            "Could not reach the LDB backend. It may be offline or unreachable from this environment.",
            502,
            err
        )
    }

    // Some endpoints (e.g. /auth/register, /auth/login) set their own
    // Set-Cookie header. Callers that need it can read `response.headers`
    // via `backendFetchRaw` below instead of this helper.
    const text = await response.text()
    let parsed: BackendEnvelope<T> | undefined
    try {
        parsed = text ? JSON.parse(text) : undefined
    } catch {
        // Non-JSON response
    }

    if (!response.ok || (parsed && parsed.status === "failure")) {
        const message =
            parsed?.message ??
            `Backend request failed with status ${response.status}`
        throw new ApiError(
            message,
            parsed?.status_code ?? response.status,
            parsed
        )
    }

    return (parsed?.data as T) ?? (undefined as T)
}

/**
 * Same as `backendFetch`, but also returns the raw Response so callers can
 * inspect `Set-Cookie` (needed for /auth/register and /auth/login).
 */
export async function backendFetchRaw(
    path: string,
    options: BackendRequestOptions = {}
): Promise<{ response: Response; data: BackendEnvelope<unknown> | undefined }> {
    const { json, formData, sessionCookie, apiKey, headers, ...rest } = options

    const finalHeaders: Record<string, string> = {
        Accept: "application/json",
        ...(headers as Record<string, string> | undefined),
    }

    let body: BodyInit | undefined
    if (formData) {
        body = formData
    } else if (json !== undefined) {
        finalHeaders["Content-Type"] = "application/json"
        body = JSON.stringify(json)
    }

    if (sessionCookie) {
        finalHeaders["Cookie"] = `ldb_session=${sessionCookie}`
    }
    if (apiKey) {
        finalHeaders["Authorization"] = `Bearer ${apiKey}`
    }

    let response: Response
    try {
        response = await fetch(`${BACKEND_URL}${path}`, {
            ...rest,
            headers: finalHeaders,
            body,
            cache: "no-store",
        })
    } catch (err) {
        throw new ApiError(
            "Could not reach the LDB backend. It may be offline or unreachable from this environment.",
            502,
            err
        )
    }

    const text = await response.text()
    let parsed: BackendEnvelope<unknown> | undefined
    try {
        parsed = text ? JSON.parse(text) : undefined
    } catch {
        // Non-JSON response
    }

    return { response, data: parsed }
}

/** Extracts the `ldb_session=...` cookie value from a Set-Cookie header. */
export function extractSessionCookie(response: Response): string | null {
    const setCookie = response.headers.get("set-cookie")
    if (!setCookie) return null
    const match = setCookie.match(/ldb_session=([^;]+)/)
    return match ? match[1] : null
}
