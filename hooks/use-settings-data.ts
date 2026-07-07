"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import { asArray } from "@/lib/api/normalize"
import type { ApiKeyInfo, WebhookSettings } from "@/lib/types/api"

export function useCredentials() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rotatedKey, setRotatedKey] = useState<string | null>(null)
  const [isRotating, setIsRotating] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // The guide says this endpoint "lists API key prefixes" - the
      // response may be a bare array, a single object, or a wrapped
      // { keys: [...] } / { data: [...] } shape. Handle all of them.
      const payload = await apiRequest<unknown>(
        "/api/portal/settings/credentials",
        { silent: true }
      )
      const list = asArray<ApiKeyInfo>(payload, ["keys"])
      if (list.length > 0) {
        setKeys(list)
      } else if (payload && typeof payload === "object") {
        // Single-object response - treat it as one key.
        setKeys([payload as ApiKeyInfo])
      } else {
        setKeys([])
      }
    } catch (err) {
      const message =
        err instanceof ClientApiError
          ? err.message
          : "Could not load API credentials"
      setError(message)
      setKeys([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const rotate = useCallback(async () => {
    setIsRotating(true)
    try {
      const data = await apiRequest<{
        api_key?: string
        secret_key?: string
        key?: string
      }>("/api/portal/settings/credentials/rotate", {
        method: "POST",
        silent: true,
      })
      const newKey = data?.secret_key ?? data?.api_key ?? data?.key ?? null
      setRotatedKey(newKey)
      toast.success("Key rotated — copy it now, it won't be shown again")
      await load()
    } catch (err) {
      const message =
        err instanceof ClientApiError ? err.message : "Could not rotate key"
      toast.error(message)
    } finally {
      setIsRotating(false)
    }
  }, [load])

  return { keys, isLoading, error, load, rotate, rotatedKey, isRotating }
}

export function useWebhookSettings() {
  const [webhook, setWebhook] = useState<WebhookSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiRequest<WebhookSettings>(
        "/api/portal/settings/webhook",
        { silent: true }
      )
      setWebhook(data ?? null)
    } catch (err) {
      // A 404 here is expected (no webhook registered yet) and shouldn't
      // read as an error - anything else is a real failure worth surfacing.
      if (err instanceof ClientApiError && err.status === 404) {
        setWebhook(null)
      } else {
        const message =
          err instanceof ClientApiError
            ? err.message
            : "Could not load webhook settings"
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const save = useCallback(
    async (url: string, events: string[]) => {
      setIsSaving(true)
      try {
        await apiRequest("/api/portal/settings/webhook", {
          method: "PUT",
          body: { url, events },
          silent: true,
        })
        toast.success("Webhook saved")
        await load()
        return true
      } catch (err) {
        const message =
          err instanceof ClientApiError ? err.message : "Could not save webhook"
        toast.error(message)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [load]
  )

  const test = useCallback(async () => {
    setIsTesting(true)
    try {
      await apiRequest("/api/portal/settings/webhook/test", {
        method: "POST",
        silent: true,
      })
      toast.success("Test payload sent to your webhook")
    } catch (err) {
      const message =
        err instanceof ClientApiError ? err.message : "Test failed"
      toast.error(message)
    } finally {
      setIsTesting(false)
    }
  }, [])

  return { webhook, isLoading, error, isSaving, isTesting, load, save, test }
}
