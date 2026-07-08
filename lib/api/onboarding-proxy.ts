import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"

/**
 * Proxies a PATCH to /portal/onboarding/{step} using our own session cookie.
 * Shared by app/api/onboarding/{business,address,verification}/route.ts.
 */
export async function proxyOnboardingPatch(
    request: NextRequest,
    backendPath: string
) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
    if (!sessionCookie) {
        return NextResponse.json(
            { message: "Not authenticated" },
            { status: 401 }
        )
    }

    let json: unknown
    try {
        json = await request.json()
    } catch {
        return NextResponse.json(
            { message: "Invalid request body" },
            { status: 400 }
        )
    }

    try {
        const data = await backendFetch(backendPath, {
            method: "PATCH",
            json,
            sessionCookie,
        })
        return NextResponse.json({ message: "Saved", data })
    } catch (err) {
        const status = err instanceof ApiError ? err.status : 500
        const message = err instanceof ApiError ? err.message : "Failed to save"
        return NextResponse.json({ message }, { status })
    }
}
