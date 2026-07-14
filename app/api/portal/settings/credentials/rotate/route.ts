import { NextRequest, NextResponse } from "next/server"
import {
    ApiError,
    FE_API_KEY_COOKIE,
    FE_SESSION_COOKIE,
    backendFetch,
} from "@/lib/api/backend"

function extractRotatedKey(data: unknown): string | null {
    if (!data || typeof data !== "object") return null
    const obj = data as Record<string, unknown>
    const key = obj.secret_key ?? obj.api_key ?? obj.apiKey ?? obj.key
    return typeof key === "string" ? key : null
}

export async function POST(request: NextRequest) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
    if (!sessionCookie) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    }

    try {
        const data = await backendFetch(
            "/portal/settings/credentials/rotate",
            {
                method: "POST",
                sessionCookie,
            }
        )
        const res = NextResponse.json({ message: "Key rotated", data })

        const rotatedKey = extractRotatedKey(data)
        if (rotatedKey) {
            // Keep our own stored key in sync so /api/customers (create
            // customer) and any other Bearer-authenticated route keeps
            // working after a rotation, even for merchants who never had
            // a key captured at registration time.
            res.cookies.set(FE_API_KEY_COOKIE, rotatedKey, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })
        }

        return res
    } catch (err) {
        const status = err instanceof ApiError ? err.status : 500
        const message =
            err instanceof ApiError ? err.message : "Rotation failed"
        return NextResponse.json({ message }, { status })
    }
}
