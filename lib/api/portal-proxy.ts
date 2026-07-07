import { NextRequest, NextResponse } from "next/server"
import { ApiError, FE_SESSION_COOKIE, backendFetch } from "@/lib/api/backend"

/** Proxies a GET to the given portal path, forwarding the query string. */
export async function proxyPortalGet(request: NextRequest, backendPath: string) {
  const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  const search = request.nextUrl.search
  try {
    const data = await backendFetch(`${backendPath}${search}`, { sessionCookie })
    return NextResponse.json({ message: "ok", data })
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500
    const message = err instanceof ApiError ? err.message : "Failed to load data"
    return NextResponse.json({ message }, { status })
  }
}
