"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    businessSchema,
    type BusinessFormValues,
} from "@/lib/onboarding-schema"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { useSubmitBusinessStep } from "@/hooks/use-onboarding-api"

const emptyValues: BusinessFormValues = {
    businessName: "",
    tradingName: "",
    businessType: "",
    taxId: "",
    registrationNumber: "",
    industry: "",
}

export function BusinessForm() {
    const router = useRouter()
    const data = useOnboardingStore((state) => state.data.business)
    const hasHydrated = useOnboardingStore((state) => state.hasHydrated)
    const setStepData = useOnboardingStore((state) => state.setStepData)
    const { submit, isSubmitting } = useSubmitBusinessStep()
    const [values, setValues] = useState<BusinessFormValues>(
        data ?? emptyValues
    )
    const [errors, setErrors] = useState<
        Partial<Record<keyof BusinessFormValues, string>>
    >({})

    useEffect(() => {
        if (!hasHydrated) return
        if (!useOnboardingStore.getState().data.account?.fullName) {
            router.replace("/onboarding/account")
        }
    }, [hasHydrated, router])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = businessSchema.safeParse(values)
        if (!result.success) {
            const nextErrors = result.error.flatten().fieldErrors as Partial<
                Record<keyof BusinessFormValues, string[]>
            >
            const mappedErrors = Object.fromEntries(
                Object.entries(nextErrors).map(([key, value]) => [
                    key,
                    value?.[0],
                ])
            ) as Partial<Record<keyof BusinessFormValues, string>>
            setErrors(mappedErrors)
            return
        }

        setErrors({})

        const ok = await submit({
            business_name: result.data.businessName,
            registration_number: result.data.registrationNumber,
            industry: result.data.industry,
            trading_name: result.data.tradingName,
            business_type: result.data.businessType,
            tax_id: result.data.taxId,
        })
        if (!ok) return

        setStepData("business", result.data)
        router.push("/onboarding/address")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--color-vault-teal)">
                    Business profile
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Tell us about the business you’re onboarding.
                </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label
                        htmlFor="businessName"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Legal business name
                    </label>
                    <Input
                        id="businessName"
                        value={values.businessName}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                businessName: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                businessName: undefined,
                            }))
                        }}
                        placeholder="As registered with CAC"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                    {errors.businessName ? (
                        <p className="text-sm text-rose-600">
                            {errors.businessName}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="tradingName"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Trading name
                        <span className="ml-2 text-xs text-slate-400">
                            Optional
                        </span>
                    </label>
                    <Input
                        id="tradingName"
                        value={values.tradingName}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                tradingName: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                tradingName: undefined,
                            }))
                        }}
                        placeholder="Brand / DBA name"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="businessType"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            Business type
                        </label>
                        <Input
                            id="businessType"
                            value={values.businessType}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    businessType: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    businessType: undefined,
                                }))
                            }}
                            placeholder="Private Limited Company (LTD)"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="industry"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            Industry
                        </label>
                        <Input
                            id="industry"
                            value={values.industry}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    industry: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    industry: undefined,
                                }))
                            }}
                            placeholder="Fintech"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                        {errors.industry ? (
                            <p className="text-sm text-rose-600">
                                {errors.industry}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="registrationNumber"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            RC / registration number
                        </label>
                        <Input
                            id="registrationNumber"
                            value={values.registrationNumber}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    registrationNumber: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    registrationNumber: undefined,
                                }))
                            }}
                            placeholder="RC 1234567"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                        {errors.registrationNumber ? (
                            <p className="text-sm text-rose-600">
                                {errors.registrationNumber}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="taxId"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            Tax ID (TIN)
                            <span className="ml-2 text-xs text-slate-400">
                                Optional
                            </span>
                        </label>
                        <Input
                            id="taxId"
                            value={values.taxId}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    taxId: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    taxId: undefined,
                                }))
                            }}
                            placeholder="01234567-0001"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/onboarding/account")}
                        className="flex h-12 w-32 items-center justify-center gap-2 rounded-md cursor-pointer text-(--color-slate) hover:border-(--color-slate) hover:bg-slate-100 hover:text-(--color-slate)"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-12 w-40 items-center justify-center gap-2 rounded-md cursor-pointer bg-(--color-vault-teal) text-base font-semibold text-black hover:bg-(--color-vault-teal) disabled:opacity-70"
                    >
                        {isSubmitting ? "Saving..." : "Continue"}
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
                <p className="text-center text-base text-slate-500">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-(--color-vault-teal)"
                    >
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    )
}
