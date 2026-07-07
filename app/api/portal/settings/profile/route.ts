import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import { proxyPortalGet } from "@/lib/api/portal-proxy"
import type { MerchantProfile } from "@/lib/types/api"

export async function GET(request: NextRequest) {
  return proxyPortalGet(request, "/portal/settings/profile")
}

export async function PATCH(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  let payload: Partial<MerchantProfile>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  try {
    const data = await backendFetch("/portal/settings/profile", {
      method: "PATCH",
      json: payload,
      sessionCookie,
    })
    return NextResponse.json({ message: "Profile updated", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err instanceof ApiError ? err.message : "Failed to update profile"
    return NextResponse.json({ message }, { status })
  }
}
