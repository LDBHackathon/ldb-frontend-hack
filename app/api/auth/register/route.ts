import { NextRequest, NextResponse } from "next/server"
import {
  ApiError,
  FE_SESSION_COOKIE,
  backendFetchRaw,
  extractSessionCookie,
} from "@/lib/api/backend"
import type { RegisterPayload } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  let payload: RegisterPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    )
  }

  try {
    const { response, data } = await backendFetchRaw("/auth/register", {
      method: "POST",
      json: payload,
    })

    if (!response.ok || data?.status === "failure") {
      const message = (data?.message as string) ?? "Registration failed"
      return NextResponse.json(
        { message },
        { status: data?.status_code ?? response.status }
      )
    }

    const sessionCookie = extractSessionCookie(response)
    const res = NextResponse.json({ message: "Registered", data: data?.data })

    if (sessionCookie) {
      res.cookies.set(FE_SESSION_COOKIE, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    return res
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Registration failed"
    const status = err instanceof ApiError ? err.status : 500
    return NextResponse.json({ message }, { status })
  }
}
