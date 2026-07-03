"use client"

import { LoginForm } from "@/components/login-form"
import { Lock, ShieldCheck, Sparkles, Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[0.85fr_0.95fr]">
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

      <section className="flex items-center justify-center bg-slate-100 px-6 py-10 sm:px-10 lg:px-14">
        <div className="w-full max-w-2xl">
          <LoginForm />
        </div>
      </section>
    </div>
  )
}
