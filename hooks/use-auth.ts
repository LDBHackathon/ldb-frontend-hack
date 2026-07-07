"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import { useOnboardingStore } from "@/lib/onboarding-store"
import type { LoginPayload, Merchant, RegisterPayload } from "@/lib/types/api"

export function useLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (payload: LoginPayload, redirectTo = "/dashboard") => {
      setIsLoading(true)
      setError(null)
      try {
        await apiRequest("/api/auth/login", { method: "POST", body: payload, silent: true })
        toast.success("Login successful! Redirecting...")
        // A fresh login into the dashboard means any leftover onboarding
        // draft in localStorage (from a previous, possibly abandoned or
        // unrelated, onboarding attempt) is no longer relevant.
        useOnboardingStore.getState().reset()
        router.push(redirectTo)
        return true
      } catch (err) {
        const message =
          err instanceof ClientApiError ? err.message : "Invalid email or password"
        setError(message)
        toast.error(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  return { login, isLoading, error }
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiRequest<Merchant>("/api/auth/register", {
        method: "POST",
        body: payload,
        silent: true,
      })
      return { ok: true as const, merchant: data }
    } catch (err) {
      const message =
        err instanceof ClientApiError ? err.message : "Registration failed"
      setError(message)
      toast.error(message)
      return { ok: false as const, merchant: undefined }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { register, isLoading, error }
}

export function useCurrentMerchant() {
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiRequest<Merchant>("/api/auth/me", { silent: true })
      .then((data) => {
        if (!cancelled) setMerchant(data)
      })
      .catch(() => {
        if (!cancelled) setMerchant(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { merchant, isLoading }
}

export function useLogout() {
  const router = useRouter()
  return useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST", silent: true })
    } finally {
      router.push("/login")
    }
  }, [router])
}
