import { NextRequest } from "next/server"
import { proxyOnboardingPatch } from "@/lib/api/onboarding-proxy"

export async function PATCH(request: NextRequest) {
  return proxyOnboardingPatch(request, "/portal/onboarding/verification")
}
