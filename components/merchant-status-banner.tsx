"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { useCurrentMerchant } from "@/hooks/use-auth"

const STATUS_LABELS: Record<string, string> = {
    pending_kyb: "pending KYB verification",
    suspended: "suspended",
}

export function MerchantStatusBanner() {
    const { merchant, isLoading } = useCurrentMerchant()

    useEffect(() => {
        // /auth/me is an untyped dict in the API spec - if `status` ever
        // comes back missing/unexpected, this makes it easy to see the
        // real shape in devtools instead of silently rendering blank text.
        if (merchant && !merchant.status) {
            // eslint-disable-next-line no-console
            console.warn(
                "MerchantStatusBanner: /auth/me response has no `status` field",
                merchant
            )
        }
    }, [merchant])

    if (isLoading || !merchant) return null
    if (merchant.status === "active") return null

    const label = merchant.status
        ? (STATUS_LABELS[merchant.status] ?? merchant.status)
        : "not yet active"

    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                    Your merchant account is <strong>{label}</strong>. Some
                    data may be limited until KYB verification is approved.
                </span>
            </div>
            <Link
                href="/onboarding/review"
                className="whitespace-nowrap font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
            >
                Review onboarding
            </Link>
        </div>
    )
}
