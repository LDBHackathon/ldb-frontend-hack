import { NextRequest } from "next/server"
import { proxyPortalGet } from "@/lib/api/portal-proxy"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyPortalGet(
    request,
    `/portal/customers/${encodeURIComponent(id)}/statement`
  )
}
