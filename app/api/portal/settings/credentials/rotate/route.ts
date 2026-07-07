import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const data = await backendFetch("/portal/settings/credentials/rotate", {
      method: "POST",
      sessionCookie,
    })
    return NextResponse.json({ message: "Key rotated", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err instanceof ApiError ? err.message : "Rotation failed"
    return NextResponse.json({ message }, { status })
  }
}
