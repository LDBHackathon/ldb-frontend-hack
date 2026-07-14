import { NextRequest, NextResponse } from "next/server"
import { FE_API_KEY_COOKIE } from "@/lib/api/backend"

/**
 * Lets the frontend check whether we have a Bearer API key on file for this
 * merchant, without exposing the key itself. Used to prompt "Generate API
 * key" in Settings when one is missing (e.g. merchants who logged in
 * instead of registering, or registered before this was captured).
 */
export async function GET(request: NextRequest) {
    const hasKey = Boolean(request.cookies.get(FE_API_KEY_COOKIE)?.value)
    return NextResponse.json({ message: "ok", data: { hasKey } })
}
