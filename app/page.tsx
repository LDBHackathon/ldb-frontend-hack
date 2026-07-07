"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Menu,
  X,
  Play,
  ArrowRight,
  ArrowDown,
  Building2,
  Users,
  Code2,
  Network,
  Zap,
  PuzzleIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0e16] text-slate-50">
      {/* ---------------------------------------------------------------- */}
      {/* HEADER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e16]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0a0e16]/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10 text-teal-400">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              LDB Africa
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <Link href="/api-doc">
                <span className="text-sm text-slate-400">API Documentation</span>
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-transparent text-slate-100 hover:bg-white/5"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/onboarding/account">
              <Button size="sm" className="bg-teal-400 text-[#06251f] hover:bg-teal-300">
                Get API access
              </Button>
            </Link>
          </div>
        

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-white md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 md:hidden">
            <span className="text-sm text-slate-400">API Documentation</span>
            <Button variant="outline" size="sm" className="w-full border-white/15 text-slate-100">
              Sign in
            </Button>
            <Button size="sm" className="w-full bg-teal-400 text-[#06251f] hover:bg-teal-300">
              Get API access
            </Button>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(45,212,191,0.08), transparent 70%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-16 text-center md:px-8 md:pb-20 md:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-teal-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            DVA Infrastructure for Businesses
          </div>

          <h1 className="text-balance text-[2.1rem] font-bold leading-[1.15] tracking-tight text-white md:text-6xl md:leading-[1.1]">
            Give every customer a{" "}
            <span className="text-teal-400">dedicated account.</span>{" "}
            One API. Any scale.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-slate-400 md:text-lg">
            LDB Africa is the B2B platform that lets your business issue
            dedicated virtual accounts (DVAs) to your own customers — with
            real-time reconciliation, signed webhooks, and edge-case handling
            built in. You own the customer relationship; we power the rails.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full bg-teal-400 text-[#06251f] hover:bg-teal-300 sm:w-auto">
              Get API access
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-white/15 bg-transparent text-slate-100 hover:bg-white/5 sm:w-auto"
            >
              <Play className="h-4 w-4" />
              View the docs
            </Button>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-slate-400 sm:flex-row sm:gap-8">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Built for
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-400" />
                Fintechs &amp; wallets
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-400" />
                Microfinance banks
              </span>
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-teal-400" />
                Marketplaces &amp; SaaS
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* WEBHOOK DEMO TERMINAL CARD                                    */}
        {/* ------------------------------------------------------------ */}
        <div className="mx-auto max-w-4xl px-5 pb-16 md:px-8 md:pb-24">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1220] shadow-[0_0_0_1px_rgba(45,212,191,0.04)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-500">
                transfer_webhook · live
              </span>
            </div>

            <div className="flex flex-col items-stretch gap-3 p-5 md:flex-row md:items-center md:gap-3 md:p-8">
              <DemoPanel
                label="Your customer pays"
                value="₦60,000"
                caption="Any bank · Ref: AUTO"
              />
              <FlowArrow />
              <DemoPanel
                label="Customer's DVA"
                value="0123 4567 89"
                caption="Issued via LDB Africa"
              />
              <FlowArrow />
              <DemoPanel
                label="Webhook to you"
                value="200 OK"
                valueClassName="text-teal-400"
                caption="Credit instantly"
              />
            </div>

            <div className="flex flex-col items-center gap-3 border-t border-white/10 px-5 py-4 text-center md:flex-row md:justify-between md:px-8 md:text-left">
              <span className="font-mono text-xs text-slate-500">
                POST https://your-app.com/webhooks · 200 OK · 124ms
              </span>
              <span className="inline-flex items-center rounded-full bg-teal-400/10 px-3 py-1 font-mono text-xs font-medium text-teal-400">
                wallet.credited
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* WHY BUSINESSES BUILD ON LDB Africa                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <p className="mb-8 text-center font-mono text-xs font-medium uppercase tracking-widest text-teal-400 md:mb-10">
          Why businesses build on LDB Africa
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <FeatureCard
            icon={<Network className="h-5 w-5" />}
            title="DVAs as a service"
            description="Spin up dedicated virtual accounts for each of your customers through one API. We handle bank partnerships, NUBAN provisioning, and uptime — you ship faster."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Real-time reconciliation API"
            description="Every inbound transfer fires a signed webhook to your systems within milliseconds. Credit your customers' wallets instantly — no batch files, no manual matching."
          />
          <FeatureCard
            icon={<PuzzleIcon className="h-5 w-5" />}
            title="Edge cases handled for you"
            description="Partial payments, overpayments, and misdirected funds are detected, flagged, and quarantined automatically — so your finance team doesn't have to chase them."
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FOR DEVELOPERS                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="grid grid-cols-1 gap-10 rounded-2xl border border-white/10 bg-[#0d1220]/60 p-6 md:grid-cols-2 md:items-center md:gap-12 md:p-14">
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-teal-400">
              For developers
            </p>
            <h2 className="text-2xl font-bold leading-tight text-white md:text-[2rem]">
              Two API calls to ship DVAs to your customers
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
              Register one of your customers, get back a dedicated account
              number to show them, and start receiving real-time webhooks at
              your endpoint for every inbound transfer. Go live in a day.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/15 bg-transparent text-slate-100 hover:bg-white/5"
            >
              Read the API docs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <CodeBlock />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-8 text-center text-xs text-slate-500 md:flex-row md:justify-between md:px-8 md:text-left">
          <span className="inline-flex items-center gap-1.5">
            © 2026 LDB Africa · Powered by
            <X className="h-3 w-3" strokeWidth={3} />
            nomba
          </span>
          <span>API documentation</span>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------- */
/* Sub-components                                                        */
/* -------------------------------------------------------------------- */

function DemoPanel({
  label,
  value,
  caption,
  valueClassName = "text-white",
}: {
  label: string;
  value: string;
  caption: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex-1 rounded-lg border border-white/10 bg-[#0a0e16]/60 px-4 py-5 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-mono text-lg font-semibold ${valueClassName}`}>
        {value}
      </p>
      <p className="mt-1.5 text-xs text-slate-500/80">{caption}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-1 md:py-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-400">
        <ArrowDown className="h-3.5 w-3.5 md:hidden" />
        <ArrowRight className="hidden h-3.5 w-3.5 md:block" />
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1220] px-6 py-7">
      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-400">
        {icon}
      </span>
      <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

function CodeBlock() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0a0e16] px-5 py-5 font-mono text-[13px] leading-relaxed">
      <p className="text-slate-500"># Create a customer + DVA</p>
      <p className="mt-3">
        <span className="text-teal-400">POST</span>{" "}
        <span className="text-white">
          https://api.LDBAfrica.io/v1/customers
        </span>
      </p>
      <pre className="mt-3 whitespace-pre-wrap text-white">
        {"{\n"}
        {"  "}
        <span className="text-teal-400">&quot;name&quot;</span>
        {": "}
        <span className="text-emerald-400">&quot;Adaeze Okonkwo&quot;</span>
        {",\n"}
        {"  "}
        <span className="text-teal-400">&quot;email&quot;</span>
        {": "}
        <span className="text-emerald-400">&quot;ada@example.com&quot;</span>
        {",\n"}
        {"  "}
        <span className="text-teal-400">&quot;target_amount&quot;</span>
        {": "}
        <span className="text-amber-400">100000</span>
        {"\n}"}
      </pre>
      <p className="mt-4 text-slate-500">
        ← <span className="text-emerald-400">201 Created</span> · NUBAN assigned
      </p>
    </div>
  );
}
