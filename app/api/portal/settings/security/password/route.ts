import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import type { ChangePasswordPayload } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  let payload: ChangePasswordPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  try {
    const data = await backendFetch("/portal/settings/security/password", {
      method: "POST",
      json: payload,
      sessionCookie,
    })
    return NextResponse.json({ message: "Password updated", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message =
      err instanceof ApiError ? err.message : "Failed to update password"
    return NextResponse.json({ message }, { status })
  }
}
