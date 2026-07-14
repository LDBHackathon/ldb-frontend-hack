"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import type { BackendCustomer, CreateCustomerPayload } from "@/lib/types/api"

export function useCreateCustomer() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [needsApiKey, setNeedsApiKey] = useState(false)

    const createCustomer = useCallback(
        async (payload: CreateCustomerPayload) => {
            setIsSubmitting(true)
            setNeedsApiKey(false)
            try {
                const data = await apiRequest<BackendCustomer>(
                    "/api/customers",
                    { method: "POST", body: payload, silent: true }
                )
                toast.success(`${payload.name} was added as a customer`)
                return { ok: true as const, customer: data }
            } catch (err) {
                if (err instanceof ClientApiError && err.status === 401) {
                    setNeedsApiKey(true)
                    toast.error(
                        "No API key on file yet - generate one in Settings \u2192 API first."
                    )
                } else {
                    const message =
                        err instanceof ClientApiError
                            ? err.message
                            : "Could not create customer"
                    toast.error(message)
                }
                return { ok: false as const, customer: undefined }
            } finally {
                setIsSubmitting(false)
            }
        },
        []
    )

    return { createCustomer, isSubmitting, needsApiKey }
}

/** Checks whether we have a Bearer API key stored for this merchant, so the
 * UI can prompt "Generate API key" before letting them try to create a
 * customer (nicer than letting the create call fail first). */
export function useApiKeyStatus() {
    const [hasKey, setHasKey] = useState<boolean | null>(null)

    const check = useCallback(async () => {
        try {
            const data = await apiRequest<{ hasKey: boolean }>(
                "/api/auth/api-key-status",
                { silent: true }
            )
            setHasKey(Boolean(data?.hasKey))
        } catch {
            setHasKey(null)
        }
    }, [])

    useEffect(() => {
        check()
    }, [check])

    return { hasKey, recheck: check }
}
