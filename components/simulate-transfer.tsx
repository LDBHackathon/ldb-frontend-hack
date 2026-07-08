"use client"

import React, { useState } from "react"
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
import { Zap } from "lucide-react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { apiRequest, ClientApiError } from "@/lib/api/client"

const SENDER_BANKS: Record<string, string> = {
    "access-bank": "Access Bank",
    gtbank: "GTBank",
    "first-bank": "First Bank",
    uba: "UBA",
    zenith: "Zenith Bank",
}

interface SimulateTransferProps {
    /** Pre-fill the destination NUBAN, e.g. from a customer's profile page. */
    defaultAccountNumber?: string
    /** Called after a successful simulation so the caller can refresh data. */
    onSimulated?: () => void
}

export function SimulateTransfer({
    defaultAccountNumber = "",
    onSimulated,
}: SimulateTransferProps) {
    const [open, setOpen] = useState(false)
    const [accountNumber, setAccountNumber] = useState(defaultAccountNumber)
    const [amount, setAmount] = useState("60000")
    const [senderBank, setSenderBank] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (next) setAccountNumber(defaultAccountNumber)
    }

    const handleSend = async () => {
        if (!accountNumber.trim()) {
            toast.error("Enter a destination account number")
            return
        }
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount")
            return
        }

        setIsSubmitting(true)
        try {
            await apiRequest("/api/portal/simulate-transfer", {
                method: "POST",
                body: {
                    account_number: accountNumber.trim(),
                    amount,
                    sender_name: senderBank
                        ? SENDER_BANKS[senderBank]
                        : undefined,
                },
            })
            toast.success(
                "Transfer simulated — wallet should reconcile shortly"
            )
            setOpen(false)
            onSimulated?.()
        } catch (err) {
            if (!(err instanceof ClientApiError)) {
                toast.error("Could not simulate transfer")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="bg-teal-400 hover:bg-teal-400 hover:text-slate-950 text-slate-950"
                >
                    <Zap className="mr-2 h-4 w-4" /> Simulate transfer
                </Button>
            </SheetTrigger>

            <SheetContent
                side="center"
                className="max-w-2xl mx-auto rounded-xl overflow-hidden bg-white"
            >
                <SheetHeader className="bg-[#07182a] px-6 py-4 text-slate-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-lg font-semibold text-slate-50">
                                Simulate incoming transfer
                            </SheetTitle>
                            <SheetDescription className="text-sm text-slate-200">
                                POST /portal/simulate-transfer
                            </SheetDescription>
                        </div>
                        <div />
                    </div>
                </SheetHeader>

                <div className="px-6 py-6">
                    <div className="mb-4">
                        <Label className="mb-2">
                            Destination investor (NUBAN)
                        </Label>
                        <Input
                            className="h-12 rounded-lg border border-slate-200"
                            placeholder="Please input account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2">Amount (₦)</Label>
                            <Input
                                className="h-12 rounded-lg border border-slate-200"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-2">Sender bank</Label>
                            <Select
                                value={senderBank}
                                onValueChange={setSenderBank}
                            >
                                <SelectTrigger className="h-12 rounded-lg border border-slate-200">
                                    <SelectValue placeholder="Select Bank" />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.entries(SENDER_BANKS).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
                        This hits the sandbox endpoint — no real bank transfer
                        is made. Use an invalid NUBAN to test the
                        misdirected-payment flow.
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 rounded-md border border-slate-200 bg-white p-4">
                        <div className="text-center">
                            <div className="text-xs text-slate-500">
                                BANK TRANSFER
                            </div>
                            <div className="mt-2 font-semibold text-slate-900">
                                ₦{Number(amount || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500">
                                WALLET CREDITED
                            </div>
                            <div className="mt-2 font-semibold text-teal-500">
                                ₦{Number(amount || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            className="rounded-lg hover:bg-white"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#06b6d4] hover:bg-[#05aabf] text-white rounded-lg"
                            onClick={handleSend}
                            disabled={isSubmitting}
                        >
                            <Zap className="mr-2" />{" "}
                            {isSubmitting ? "Sending..." : "Send transfer"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
