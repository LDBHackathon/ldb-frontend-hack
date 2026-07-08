"use client"

import { toast } from "sonner"

export class ClientApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.name = "ClientApiError"
        this.status = status
    }
}

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
    body?: unknown
    /** Suppress the default toast.error on failure (caller handles it). */
    silent?: boolean
}

/**
 * Calls one of our own `/api/*` route handlers (never the backend directly).
 * These routes run server-side and proxy to https://hackathon-api.ldbafrica.com,
 * translating our own session cookie into the backend's `ldb_session` cookie.
 */
export async function apiRequest<T = unknown>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = "GET", body, silent } = options

    let response: Response
    try {
        response = await fetch(path, {
            method,
            credentials: "same-origin",
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        })
    } catch {
        if (!silent) {
            toast.error("Network error — check your connection and try again.")
        }
        throw new ClientApiError("Network error", 0)
    }

    let payload: { message?: string; data?: T } | undefined
    try {
        payload = await response.json()
    } catch {
        // no body
    }

    if (response.status === 401) {
        if (!silent)
            toast.error("Your session has expired. Please sign in again.")
        if (typeof window !== "undefined") {
            window.location.href = "/login"
        }
        throw new ClientApiError(payload?.message ?? "Unauthorized", 401)
    }

    if (!response.ok) {
        const message =
            payload?.message ?? "Something went wrong. Please try again."
        if (!silent) toast.error(message)
        throw new ClientApiError(message, response.status)
    }

    return (payload?.data as T) ?? (undefined as T)
}
