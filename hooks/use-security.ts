"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import type { ChangePasswordPayload } from "@/lib/types/api"

export function useChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    setIsSubmitting(true)
    try {
      await apiRequest("/api/portal/settings/security/password", {
        method: "POST",
        body: payload,
        silent: true,
      })
      toast.success("Password updated")
      return true
    } catch (err) {
      const message =
        err instanceof ClientApiError
          ? err.message
          : "Could not update password. Check your current password and try again."
      toast.error(message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { changePassword, isSubmitting }
}
