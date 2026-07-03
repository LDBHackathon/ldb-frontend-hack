"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useOnboardingStore } from "@/lib/onboarding-store"

export default function ReviewPage() {
  const data = useOnboardingStore((state) => state.data)

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-[0_20px_70px_rgba(2,6,23,0.4)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">Review</p>
            <h1 className="text-3xl font-semibold text-white">Your onboarding details are ready</h1>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-sm leading-7 text-slate-300">
            The onboarding flow now persists step-by-step data and surfaces a consolidated review of everything captured so far.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>
            <div className="text-sm text-slate-300">Contact: {data.account?.fullName ?? "-"} &nbsp; Email: {data.account?.email}</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Business (KYB)</h2>
            <div className="text-sm text-slate-300">Legal name: {data.business?.businessName}</div>
            <div className="text-sm text-slate-300">Trading name: {data.business?.tradingName}</div>
            <div className="text-sm text-slate-300">Type: {data.business?.businessType}</div>
            <div className="text-sm text-slate-300">Industry: {data.business?.industry}</div>
            <div className="text-sm text-slate-300">RC number: {data.business?.registrationNumber}</div>
            <div className="text-sm text-slate-300">TIN: {data.business?.taxId}</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Address & Contact</h2>
            <div className="text-sm text-slate-300">Country: {data.address?.country}</div>
            <div className="text-sm text-slate-300">Registered address: {data.address?.addressLine}</div>
            <div className="text-sm text-slate-300">City / State: {data.address?.city} / {data.address?.state}</div>
            <div className="text-sm text-slate-300">Phone: {data.address?.businessPhone}</div>
            <div className="text-sm text-slate-300">Website: {data.address?.website}</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Verification</h2>
            <div className="text-sm text-slate-300">Director: {data.verification?.directorName}</div>
            <div className="text-sm text-slate-300">BVN / ID: {data.verification?.bvnId}</div>
            <div className="text-sm text-slate-300">CAC document: {data.verification?.cacDocument}</div>
            <div className="text-sm text-slate-300">Address proof: {data.verification?.addressProof}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="rounded-2xl border-slate-700 text-slate-100 hover:bg-slate-800">
            <Link href="/onboarding/account" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Restart onboarding
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
