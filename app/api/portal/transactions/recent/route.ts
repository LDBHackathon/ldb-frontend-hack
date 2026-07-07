import { NextRequest } from "next/server"
import { proxyPortalGet } from "@/lib/api/portal-proxy"

export async function GET(request: NextRequest) {
  return proxyPortalGet(request, "/portal/transactions/recent")
}
