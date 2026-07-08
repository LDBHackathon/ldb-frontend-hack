"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { apiRequest, ClientApiError } from "@/lib/api/client"
import type {
    OnboardingAddressPayload,
    OnboardingBusinessPayload,
    OnboardingStatus,
    OnboardingVerificationPayload,
} from "@/lib/types/api"

function useOnboardingStep<TPayload>(path: string) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = useCallback(
        async (payload: TPayload) => {
            setIsSubmitting(true)
            try {
                await apiRequest(path, {
                    method: "PATCH",
                    body: payload,
                    silent: true,
                })
                return true
            } catch (err) {
                const message =
                    err instanceof ClientApiError
                        ? err.message
                        : "Could not save this step. Please try again."
                toast.error(message)
                return false
            } finally {
                setIsSubmitting(false)
            }
        },
        [path]
    )

    return { submit, isSubmitting }
}

export function useSubmitBusinessStep() {
    return useOnboardingStep<OnboardingBusinessPayload>(
        "/api/onboarding/business"
    )
}

export function useSubmitAddressStep() {
    return useOnboardingStep<OnboardingAddressPayload>(
        "/api/onboarding/address"
    )
}

export function useSubmitVerificationStep() {
    return useOnboardingStep<OnboardingVerificationPayload>(
        "/api/onboarding/verification"
    )
}

export function useOnboardingStatus() {
    const [status, setStatus] = useState<OnboardingStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const load = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await apiRequest<OnboardingStatus>(
                "/api/onboarding/status",
                {
                    silent: true,
                }
            )
            setStatus(data ?? null)
        } catch {
            setStatus(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { status, isLoading, load }
}

export function useSubmitOnboarding() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = useCallback(async () => {
        setIsSubmitting(true)
        try {
            await apiRequest("/api/onboarding/submit", {
                method: "POST",
                silent: true,
            })
            toast.success("Submitted for KYB verification")
            return true
        } catch (err) {
            const message =
                err instanceof ClientApiError
                    ? err.message
                    : "Could not submit for verification. Please complete all steps first."
            toast.error(message)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }, [])

    return { submit, isSubmitting }
}
