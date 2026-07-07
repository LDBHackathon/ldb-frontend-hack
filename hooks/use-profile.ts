"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import type { MerchantProfile } from "@/lib/types/api"

export function useProfileSettings() {
  const [profile, setProfile] = useState<MerchantProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiRequest<MerchantProfile>(
        "/api/portal/settings/profile",
        { silent: true }
      )
      setProfile(data ?? null)
    } catch (err) {
      const message =
        err instanceof ClientApiError ? err.message : "Could not load profile"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const save = useCallback(async (payload: Partial<MerchantProfile>) => {
    setIsSaving(true)
    try {
      await apiRequest("/api/portal/settings/profile", {
        method: "PATCH",
        body: payload,
        silent: true,
      })
      toast.success("Profile updated")
      return true
    } catch (err) {
      const message =
        err instanceof ClientApiError ? err.message : "Could not update profile"
      toast.error(message)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { profile, isLoading, error, isSaving, load, save }
}
