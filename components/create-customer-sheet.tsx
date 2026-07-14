"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApiKeyStatus, useCreateCustomer } from "@/hooks/use-create-customer"

interface CreateCustomerSheetProps {
    onCreated?: () => void
}

export function CreateCustomerSheet({ onCreated }: CreateCustomerSheetProps) {
    const [open, setOpen] = useState(false)
    const { createCustomer, isSubmitting, needsApiKey } = useCreateCustomer()
    const { hasKey } = useApiKeyStatus()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [targetAmount, setTargetAmount] = useState("")
    const [bvn, setBvn] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const reset = () => {
        setName("")
        setEmail("")
        setPhone("")
        setTargetAmount("")
        setBvn("")
        setErrors({})
    }

    const validate = () => {
        const next: Record<string, string> = {}
        if (name.trim().length < 8 || name.trim().length > 64) {
            next.name = "Name must be between 8 and 64 characters"
        }
        if (bvn && bvn.length !== 11) {
            next.bvn = "BVN must be exactly 11 digits"
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!validate()) return

        const { ok } = await createCustomer({
            name: name.trim(),
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            target_amount: targetAmount.trim() || undefined,
            bvn: bvn.trim() || undefined,
        })

        if (ok) {
            reset()
            setOpen(false)
            onCreated?.()
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="gap-2 bg-[#00BFA5] hover:bg-[#00A892] text-[#0B1E33] font-bold">
                    <UserPlus className="h-4 w-4" />
                    Add customer
                </Button>
            </SheetTrigger>

            <SheetContent
                side="center"
                className="max-w-lg mx-auto rounded-xl overflow-hidden bg-white"
            >
                <SheetHeader className="bg-[#07182a] px-6 py-4 text-slate-50">
                    <SheetTitle className="text-lg font-semibold text-slate-50">
                        Add a customer
                    </SheetTitle>
                    <SheetDescription className="text-sm text-slate-200">
                        POST /customers &middot; provisions a dedicated virtual
                        account
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                    {(needsApiKey || hasKey === false) && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            No API key is on file for this merchant yet.
                            Go to Settings &rarr; API and click{" "}
                            <strong>Rotate keys</strong> to generate one, then
                            come back and try again.
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Full name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                            className="h-11"
                        />
                        {errors.name && (
                            <p className="text-sm text-rose-600">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@example.com"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+2348012345678"
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Target amount (&#8358;)</Label>
                            <Input
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="100000.00"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>BVN (optional)</Label>
                            <Input
                                value={bvn}
                                onChange={(e) => setBvn(e.target.value)}
                                placeholder="11 digits"
                                maxLength={11}
                                className="h-11"
                            />
                            {errors.bvn && (
                                <p className="text-sm text-rose-600">{errors.bvn}</p>
                            )}
                        </div>
                    </div>

                    <SheetFooter className="px-0">
                        <div className="flex items-center justify-between w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#00BFA5] hover:bg-[#00A892] text-[#0B1E33] font-bold"
                            >
                                {isSubmitting ? "Creating..." : "Create customer"}
                            </Button>
                        </div>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
