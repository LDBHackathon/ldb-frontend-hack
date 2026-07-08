"use client"

import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { accountSchema, type AccountFormValues } from "@/lib/onboarding-schema"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { useRegister } from "@/hooks/use-auth"

const emptyValues: AccountFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    /* agreeToTerms: false, */
}

export function AccountForm() {
    const router = useRouter()
    const setStepData = useOnboardingStore((state) => state.setStepData)
    const data = useOnboardingStore((state) => state.data.account)
    const { register, isLoading } = useRegister()
    const [values, setValues] = useState<AccountFormValues>(data ?? emptyValues)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<
        Partial<Record<keyof AccountFormValues, string>>
    >({})

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = accountSchema.safeParse(values)

        if (!result.success) {
            const nextErrors = result.error.flatten().fieldErrors as Partial<
                Record<keyof AccountFormValues, string[]>
            >
            const mappedErrors = Object.fromEntries(
                Object.entries(nextErrors).map(([key, value]) => [
                    key,
                    value?.[0],
                ])
            ) as Partial<Record<keyof AccountFormValues, string>>
            setErrors(mappedErrors)
            return
        }

        setErrors({})

        const { ok } = await register({
            full_name: result.data.fullName,
            email: result.data.email,
            password: result.data.password,
        })
        if (!ok) return

        setStepData("account", result.data)
        router.push("/onboarding/business")
    }

    return (
        <div className="space-y-6 rounded-[28px] bg-none ">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--color-vault-teal)">
                    Create a business account
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    Onboard your business
                </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label
                        htmlFor="fullName"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Your full name
                    </label>
                    <Input
                        id="fullName"
                        value={values.fullName}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                fullName: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                fullName: undefined,
                            }))
                        }}
                        placeholder="Toni Sparks"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                    {errors.fullName ? (
                        <p className="text-sm text-rose-600">
                            {errors.fullName}
                        </p>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-(--color-slate)"
                    >
                        Work email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                email: event.target.value,
                            }))
                            setErrors((current) => ({
                                ...current,
                                email: undefined,
                            }))
                        }}
                        placeholder="you@yourcompany.com"
                        className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
                    />
                    {errors.email ? (
                        <p className="text-sm text-rose-600">{errors.email}</p>
                    ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-(--color-slate)"
                            >
                                Password
                            </label>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-(--color-slate)"
                            >
                                Min 8 characters
                            </label>
                        </div>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={values.password}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        password: event.target.value,
                                    }))
                                    setErrors((current) => ({
                                        ...current,
                                        password: undefined,
                                    }))
                                }}
                                placeholder="••••••••"
                                className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 pr-12 text-base text-(--color-slate)"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((current) => !current)
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5" />
                                ) : (
                                    <Eye className="size-5" />
                                )}
                            </button>
                        </div>
                        {errors.password ? (
                            <p className="text-sm text-rose-600">
                                {errors.password}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-(--color-slate)"
                        >
                            Confirm password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={values.confirmPassword}
                                onChange={(event) => {
                                    setValues((current) => ({
                                        ...current,
                                        confirmPassword: event.target.value,
                                    }))
                                    setErrors((current) => ({
                                        ...current,
                                        confirmPassword: undefined,
                                    }))
                                }}
                                placeholder="••••••••"
                                className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 pr-12 text-base text-(--color-slate)"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (current) => !current
                                    )
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-5" />
                                ) : (
                                    <Eye className="size-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword ? (
                            <p className="text-sm text-rose-600">
                                {errors.confirmPassword}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-12 w-40 items-center justify-center gap-2 rounded-md bg-(--color-vault-teal) text-base font-semibold text-black hover:bg-(--color-vault-teal) disabled:opacity-70"
                    >
                        {isLoading ? "Creating account..." : "Continue"}
                        {!isLoading && <ArrowRight className="size-4" />}
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
