import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"
import type { SimulateTransferPayload } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  let payload: SimulateTransferPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  try {
    const data = await backendFetch("/portal/simulate-transfer", {
      method: "POST",
      json: payload,
      sessionCookie,
    })
    return NextResponse.json({ message: "Transfer simulated", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err instanceof ApiError ? err.message : "Simulation failed"
    return NextResponse.json({ message }, { status })
  }
}
