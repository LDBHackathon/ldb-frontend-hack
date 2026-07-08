import { NextRequest, NextResponse } from "next/server"
import { FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"

export async function POST(request: NextRequest) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value

    try {
        if (sessionCookie) {
            await backendFetch("/auth/logout", {
                method: "POST",
                sessionCookie,
            })
        }
    } catch {
        // Even if the backend call fails, still clear our local cookie below.
    }

    const res = NextResponse.json({ message: "Logged out" })
    res.cookies.delete(FE_SESSION_COOKIE)
    return res
}
