import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import { proxyPortalGet } from "@/lib/api/portal-proxy"
import type { WebhookSettings } from "@/lib/types/api"

export async function GET(request: NextRequest) {
  return proxyPortalGet(request, "/portal/settings/webhook")
}

export async function PUT(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  let payload: Pick<WebhookSettings, "url" | "events">
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  try {
    const data = await backendFetch("/portal/settings/webhook", {
      method: "PUT",
      json: payload,
      sessionCookie,
    })
    return NextResponse.json({ message: "Webhook saved", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err instanceof ApiError ? err.message : "Failed to save webhook"
    return NextResponse.json({ message }, { status })
  }
}
