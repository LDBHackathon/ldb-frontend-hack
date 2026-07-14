import { NextRequest, NextResponse } from "next/server"
import {
    ApiError,
    FE_API_KEY_COOKIE,
    FE_SESSION_COOKIE,
    backendFetchRaw,
    extractSessionCookie,
} from "@/lib/api/backend"
import type { RegisterPayload } from "@/lib/types/api"

/**
 * /auth/register's success response is an untyped dict in the spec, but the
 * API Flow Guide says it "issues a default API key (shown once)". We don't
 * know the exact key name for certain, so check the plausible spots.
 */
function extractApiKey(data: unknown): string | null {
    if (!data || typeof data !== "object") return null
    const obj = data as Record<string, unknown>
    const direct = obj.api_key ?? obj.apiKey
    if (typeof direct === "string") return direct
    const merchant = obj.merchant as Record<string, unknown> | undefined
    const nested = merchant?.api_key ?? merchant?.apiKey
    if (typeof nested === "string") return nested
    return null
}

export async function POST(request: NextRequest) {
    let payload: RegisterPayload
    try {
        payload = await request.json()
    } catch {
        return NextResponse.json(
            { message: "Invalid request body" },
            { status: 400 }
        )
    }

    try {
        const { response, data } = await backendFetchRaw("/auth/register", {
            method: "POST",
            json: payload,
        })

        if (!response.ok || data?.status === "failure") {
            const message = (data?.message as string) ?? "Registration failed"
            return NextResponse.json(
                { message },
                { status: data?.status_code ?? response.status }
            )
        }

        const sessionCookie = extractSessionCookie(response)
        const apiKey = extractApiKey(data?.data)
        const res = NextResponse.json({
            message: "Registered",
            data: data?.data,
        })

        if (sessionCookie) {
            res.cookies.set(FE_SESSION_COOKIE, sessionCookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })
        }
        if (apiKey) {
            res.cookies.set(FE_API_KEY_COOKIE, apiKey, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })
        }

        return res
    } catch (err) {
        const message =
            err instanceof ApiError ? err.message : "Registration failed"
        const status = err instanceof ApiError ? err.status : 500
        return NextResponse.json({ message }, { status })
    }
}
