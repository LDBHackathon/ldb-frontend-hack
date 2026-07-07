import { NextRequest, NextResponse } from "next/server"
import {
  ApiError,
  FE_SESSION_COOKIE,
  backendFetchRaw,
  extractSessionCookie,
} from "@/lib/api/backend"
import type { LoginPayload } from "@/lib/types/api"

export async function POST(request: NextRequest) {
  let payload: LoginPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    )
  }

  try {
    const { response, data } = await backendFetchRaw("/auth/login", {
      method: "POST",
      json: payload,
    })

    if (!response.ok || data?.status === "failure") {
      const message = (data?.message as string) ?? "Invalid email or password"
      return NextResponse.json(
        { message },
        { status: data?.status_code ?? response.status }
      )
    }

    const sessionCookie = extractSessionCookie(response)
    const res = NextResponse.json({ message: "Logged in", data: data?.data })

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
    const message = err instanceof ApiError ? err.message : "Login failed"
    const status = err instanceof ApiError ? err.status : 500
    return NextResponse.json({ message }, { status })
  }
}
