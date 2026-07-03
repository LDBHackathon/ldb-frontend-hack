import { Check, Zap, Lock, ShieldCheck, Sparkles } from "lucide-react"
import React from "react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[0.85fr_0.95fr]">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-slate-50 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.24),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_20%)]" />
        <div className="relative z-10 flex min-h-full flex-col justify-between gap-10">
          <div className="space-y-10">
            <div className="flex items-center gap-3 mb-40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-emerald) shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <ShieldCheck className="size-5 text-black" />
              </div>
              <span className="text-md font-semibold uppercase tracking-widest text-white">
                LDB Africa
              </span>
            </div>
            <div className="max-w-2xl space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">
                DVA infrastructure for businesses
              </p>
              <h1 className="text-4xl w-lg font-semibold leading-tight text-white sm:text-[42px]">
                The rails behind every dedicated account you issue.
              </h1>
            </div>
            <div className="space-y-4">
              <div className="flex flex-row gap-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-vault-teal)/12 text-(--color-vault-teal)">
                  <Zap className="size-5" />
                </div>
                <div>
                  <p className="text-xl font-normal text-white/65">Issue dedicated virtual accounts at any scale</p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-vault-teal)/12 text-(--color-vault-teal)">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="text-xl font-normal text-white/65">Real-time reconciliation webhooks in milliseconds</p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-vault-teal)/12 text-(--color-vault-teal)">
                  <Lock className="size-5" />
                </div>
                <div>
                  <p className="text-xl font-normal text-white/65">Bank-grade security · NDPR & PCI-DSS aligned</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-sm leading-6 text-slate-400">
            © 2026 LDB Africa · Trusted by 40+ fintechs & MFBs · Powered by nomba
          </div>
        </div>
      </section>

      <section className="px-10 py-16 flex items-center justify-center">
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--color-emerald)">YOU&apos;RE IN</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Welcome to LDB Africa, Ben</h2>

          <div className="mt-6 rounded-lg border border-teal-100 bg-[#e6fffa] p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-teal-100 p-3 text-teal-600">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">WealthVault is all set up</h3>
                <p className="mt-1 text-sm text-slate-600">Your KYB is under review — full live access unlocks within 24 hours. You can explore the dashboard in the meantime.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-(--color-vault-teal)/12 p-3 text-(--color-vault-teal)">
                  <KeyIcon />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Grab your API keys</div>
                  <div className="text-sm text-slate-500">Authenticate requests with your live and test credentials.</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-(--color-vault-teal)/12 p-3 text-(--color-vault-teal)">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Register a webhook</div>
                  <div className="text-sm text-slate-500">Get real-time events the instant a customer&apos;s transfer lands.</div>
                </div>
              </div>
            </div>
          </div>

          <a href="/dashboard" className="mt-8 inline-block w-full rounded-[12px] bg-(--color-emerald) h-12 leading-[48px] text-center font-semibold text-slate-950">Go to dashboard →</a>
        </div>
      </section>
    </div>
  )
}

function KeyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 2L11 12" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="16" r="3" stroke="#06b6d4" strokeWidth="2"/>
    </svg>
  )
}
