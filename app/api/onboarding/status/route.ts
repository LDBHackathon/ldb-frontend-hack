import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import type { OnboardingStatus } from "@/lib/types/api"

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
    if (!sessionCookie) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    }

    try {
        const data = await backendFetch<OnboardingStatus>(
            "/portal/onboarding/status",
            { sessionCookie }
        )
        return NextResponse.json({ message: "ok", data })
    } catch (err) {
        const status = err instanceof ApiError ? err.status : 500
        const message =
            err instanceof ApiError ? err.message : "Failed to load status"
        return NextResponse.json({ message }, { status })
    }
}
