import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import type { Merchant } from "@/lib/types/api"

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value

    if (!sessionCookie) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    }

    try {
        const merchant = await backendFetch<Merchant>("/auth/me", {
            sessionCookie,
        })
        return NextResponse.json({ message: "ok", data: merchant })
    } catch (err) {
        const status = err instanceof ApiError ? err.status : 500
        const message =
            err instanceof ApiError ? err.message : "Failed to load profile"
        return NextResponse.json(
            { message },
            { status: status === 401 ? 401 : status }
        )
    }
}
