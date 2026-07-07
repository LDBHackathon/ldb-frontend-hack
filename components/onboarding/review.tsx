"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { useOnboardingStatus, useSubmitOnboarding } from "@/hooks/use-onboarding-api"

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-900">{value || "-"}</span>
    </div>
  )
}

export default function ReviewPage() {
  const data = useOnboardingStore((state) => state.data)
  const reset = useOnboardingStore((state) => state.reset)
  const router = useRouter()
  const { submit, isSubmitting } = useSubmitOnboarding()
  const { status, load: loadStatus } = useOnboardingStatus()

  useEffect(() => {
    loadStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async () => {
    const ok = await submit()
    if (!ok) return
    // Onboarding is complete on the backend - the locally persisted draft
    // (localStorage) is no longer needed from here on.
    reset()
    router.push("/onboarding/welcome")
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4">
        <div className="flex items-center gap-3 rounded-md border border-[#00C2A833]/90 bg-[#00C2A833]/30 px-5 py-3 text-emerald-800">
          <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
          <p className="text-sm">Review your details before submitting for KYB verification.</p>
        </div>

        {status && (
          <div className="rounded-md bg-white p-4 shadow-sm text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-1">
            <span>Business: {status.business_completed ? "✓ complete" : "pending"}</span>
            <span>Address: {status.address_completed ? "✓ complete" : "pending"}</span>
            <span>Verification: {status.verification_completed ? "✓ complete" : "pending"}</span>
            <span>Status: {status.kyb_status}</span>
          </div>
        )}

        <div className="rounded-md bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Account</p>
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Contact" value={data.account?.fullName ?? data.account?.fullName} />
            <Field label="Email" value={data.account?.email} />
          </div>
        </div>

        <div className="rounded-md bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Business (KYB)</p>
          <div className="grid grid-cols-2 gap-x-8">
            <div className="divide-y divide-slate-100">
              <Field label="Legal name" value={data.business?.businessName} />
              <Field label="Type" value={data.business?.businessType} />
              <Field label="RC number" value={data.business?.registrationNumber} />
            </div>
            <div className="divide-y divide-slate-100">
              <Field label="Trading name" value={data.business?.tradingName} />
              <Field label="Industry" value={data.business?.industry} />
              <Field label="TIN" value={data.business?.taxId} />
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Address & contact</p>
          <div className="grid grid-cols-2 gap-x-8">
            <div className="divide-y divide-slate-100">
              <Field label="Country" value={data.address?.country} />
              <Field label="Phone" value={data.address?.businessPhone} />
            </div>
            <div className="divide-y divide-slate-100">
              <Field label="Address" value={data.address?.addressLine} />
              <Field label="Website" value={data.address?.website} />
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Verification</p>
          <div className="grid grid-cols-2 gap-x-8">
            <div className="divide-y divide-slate-100">
              <Field label="Director" value={data.verification?.directorName} />
              <Field label="CAC document" value={data.verification?.cacDocument} />
            </div>
            <div className="divide-y divide-slate-100">
              <Field label="BVN / ID" value={data.verification?.bvnId} />
              <Field label="Address proof" value={data.verification?.addressProof} />
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-md border-slate-200 bg-white px-5 py-6 text-slate-700 shadow-sm hover:bg-white hover:text-slate-700"
          >
            <Link href="/onboarding/verification" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-md bg-emerald-500 px-5 py-6 text-white shadow-sm hover:bg-emerald-600 disabled:opacity-70"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              {isSubmitting ? "Submitting..." : "Submit for verification"}
            </span>
          </Button>
        </div>

        <p className="mt-2 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}