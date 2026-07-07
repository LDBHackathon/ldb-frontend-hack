import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const data = await backendFetch("/portal/onboarding/submit", {
      method: "POST",
      sessionCookie,
    })
    return NextResponse.json({ message: "Submitted for KYB review", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message =
      err instanceof ApiError
        ? err.message
        : "Could not submit for verification. Please make sure all steps are complete."
    return NextResponse.json({ message }, { status })
  }
}
