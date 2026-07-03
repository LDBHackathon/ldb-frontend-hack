import { Lock, ShieldCheck, Sparkles, Zap, Check } from "lucide-react"
import type { ReactNode } from "react"

interface OnboardingShellProps {
  currentStep: number
  totalSteps: number
  children: ReactNode
}

export function OnboardingShell({
  currentStep,
  totalSteps,
  children,
}: OnboardingShellProps) {
  const steps = [
    "Account",
    "Business",
    "Address",
    "Verification",
    "Review",
  ]
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:grid lg:grid-cols-[0.85fr_0.95fr]">
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
          <div className="mb-8 px-0 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-0">
                <div className="flex items-center">
                  {steps.map((label, i) => (
                    <div key={label} className="flex items-center w-full">
                      <div
                        className={
                          `flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${
                            i + 1 < currentStep
                              ? "bg-[#00C2A8] text-black"
                              : i + 1 === currentStep
                              ? "bg-[#07182a] text-white"
                              : "bg-white border border-slate-200 text-slate-400"
                          }`
                        }
                      >
                        {i + 1 < currentStep ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="text-sm">{i + 1}</span>
                        )}
                      </div>

                      {i !== steps.length - 1 && (
                        <div
                          className={`mx-1 flex-1 mt-7 self-center h-1 ${
                            i + 1 < currentStep ? "bg-[#00C2A8]" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center">
                  {steps.map((label, i) => (
                    <div key={label} className="w-1/5 text-center text-xs">
                      <span
                        className={
                          `block tracking-wide mr-16 ${i + 1 === currentStep ? "font-semibold text-slate-900" : "text-slate-400"}`
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
