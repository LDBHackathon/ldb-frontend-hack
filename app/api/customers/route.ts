import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_API_KEY_COOKIE, backendFetch } from "@/lib/api/backend"
import type { CreateCustomerPayload } from "@/lib/types/api"

/**
 * POST /customers requires a Bearer API key (not the session cookie) per
 * the spec - "security": [{"HTTPBearer": []}]. We use the key captured at
 * registration time (or via a rotate in Settings), stored in its own
 * httpOnly cookie. See lib/api/backend.ts FE_API_KEY_COOKIE.
 */
export async function POST(request: NextRequest) {
    const apiKey = request.cookies.get(FE_API_KEY_COOKIE)?.value
    if (!apiKey) {
        return NextResponse.json(
            {
                message:
                    "No API key on file for this merchant. Generate one in Settings \u2192 API, then try again.",
                code: "NO_API_KEY",
            },
            { status: 401 }
        )
    }

    let payload: CreateCustomerPayload
    try {
        payload = await request.json()
    } catch {
        return NextResponse.json(
            { message: "Invalid request body" },
            { status: 400 }
        )
    }

    try {
        const data = await backendFetch("/customers", {
            method: "POST",
            json: payload,
            apiKey,
        })
        return NextResponse.json({ message: "Customer created", data })
    } catch (err) {
        const status = err instanceof ApiError ? err.status : 500
        const message =
            err instanceof ApiError ? err.message : "Could not create customer"
        return NextResponse.json({ message }, { status })
    }
}
