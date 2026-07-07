"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/use-auth"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, isLoading, error: loginError } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const ok = await login({ email, password })
    if (!ok) {
      setError(loginError ?? "Invalid email or password")
    }
  }

  return (
    <div
      className={cn(
        className
      )}
    >
      <div className="mb-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-(--color-vault-teal)">Sign in</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Sign in to your dashboard
        </h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} {...props}>
        <div className="space-y-3">
          <label htmlFor="email" className="text-sm font-medium text-(--color-slate)">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-base text-(--color-slate) placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="text-sm font-medium text-(--color-slate)">
              Password
            </label>
            <a href="#" className="text-sm font-medium text-(--color-slate) hover:text-(--color-slate)">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 rounded-2xl border-slate-200 bg-slate-50 pr-12 px-4 py-3 text-base text-(--color-slate) placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-900"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4
                rounded
                border-slate-300
                accent-(--color-vault-teal)
              "
            />
            Keep me signed in
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-(--color-vault-teal) text-base font-semibold text-white hover:bg-(--color-vault-teal) disabled:opacity-70"
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {!isLoading && <ArrowRight className="size-4" />}
        </Button>

        <p className="text-center text-sm text-slate-500">
          New to LDB Africa?{' '}
          <a href="/onboarding/account" className="font-semibold text-(--color-vault-teal)">
            Create a business account
          </a>
        </p>
      </form>
    </div>
  )
}
