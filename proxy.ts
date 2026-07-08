import { NextRequest, NextResponse } from "next/server"
import { FE_SESSION_COOKIE } from "@/lib/api/backend"

export function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get(FE_SESSION_COOKIE)?.value

    if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"],
}
