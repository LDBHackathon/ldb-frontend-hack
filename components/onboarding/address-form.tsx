"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addressSchema, type AddressFormValues } from "@/lib/onboarding-schema"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { useSubmitAddressStep } from "@/hooks/use-onboarding-api"

const emptyValues: AddressFormValues = {
    addressLine: "",
    city: "",
    state: "",
    businessPhone: "",
    country: "",
    website: "",
}

export function AddressForm() {
    const router = useRouter()
    const data = useOnboardingStore((state) => state.data.address)
    const hasHydrated = useOnboardingStore((state) => state.hasHydrated)
    const setStepData = useOnboardingStore((state) => state.setStepData)
    const { submit, isSubmitting } = useSubmitAddressStep()
    const [values, setValues] = useState<AddressFormValues>(data ?? emptyValues)
    const [errors, setErrors] = useState<
        Partial<Record<keyof AddressFormValues, string>>
    >({})

    useEffect(() => {
        if (!hasHydrated) return
        if (!useOnboardingStore.getState().data.account?.fullName) {
            router.replace("/onboarding/account")
        }
    }, [hasHydrated, router])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(values)

        const result = addressSchema.safeParse(values)
        if (!result.success) {
            const nextErrors = result.error.flatten().fieldErrors as Partial<
                Record<keyof AddressFormValues, string[]>
            >
            const mappedErrors = Object.fromEntries(
                Object.entries(nextErrors).map(([key, value]) => [
                    key,
                    value?.[0],
                ])
            ) as Partial<Record<keyof AddressFormValues, string>>
            setErrors(mappedErrors)
            return
        }

        setErrors({})

        const ok = await submit({
            address_line: result.data.addressLine,
            city: result.data.city,
            state: result.data.state,
            country: result.data.country,
            phone: result.data.businessPhone,
            website: result.data.website,
        })
        if (!ok) return

        setStepData("address", result.data)
        router.push("/onboarding/verification")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--color-vault-teal)">
                    Address details
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Where should we send your onboarding materials?
                </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label
                        htmlFor="country"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Country of registration
                    </label>
                    <Input
                        id="country"
                        value={values.country}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                country: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                country: undefined,
                            }))
                        }}
                        placeholder="Nigeria"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                    {errors.country ? (
                        <p className="text-sm text-rose-600">
                            {errors.country}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="addressLine"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Registered business address
                    </label>
                    <Input
                        id="addressLine"
                        value={values.addressLine}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                addressLine: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                addressLine: undefined,
                            }))
                        }}
                        placeholder="12 Marina Road"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                    {errors.addressLine ? (
                        <p className="text-sm text-rose-600">
                            {errors.addressLine}
                        </p>
                    ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label
                            htmlFor="city"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            State
                        </label>
                        <Input
                            id="state"
                            value={values.state}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    state: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    state: undefined,
                                }))
                            }}
                            placeholder="Lagos"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                        {errors.city ? (
                            <p className="text-sm text-rose-600">
                                {errors.city}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="city"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            City
                        </label>
                        <Input
                            id="city"
                            value={values.city}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    city: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    city: undefined,
                                }))
                            }}
                            placeholder="Lagos"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                        {errors.city ? (
                            <p className="text-sm text-rose-600">
                                {errors.city}
                            </p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="businessPhone"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            Business phone
                        </label>
                        <Input
                            id="businessPhone"
                            value={values.businessPhone}
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    businessPhone: event.target.value,
                                }))
                                setErrors((current) => ({
                                    ...current,
                                    businessPhone: undefined,
                                }))
                            }}
                            placeholder="+234 800 000 0000"
                            className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                        />
                        {errors.businessPhone ? (
                            <p className="text-sm text-rose-600">
                                {errors.businessPhone}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="website"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Company website
                        <span className="ml-2 text-xs text-slate-400">
                            Optional
                        </span>
                    </label>
                    <Input
                        id="website"
                        value={values.website}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                website: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                website: undefined,
                            }))
                        }}
                        placeholder="https://yourcompany.com"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/onboarding/business")}
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
