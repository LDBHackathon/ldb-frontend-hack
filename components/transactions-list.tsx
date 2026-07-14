"use client"

import { useState, useMemo } from "react"
import {
    Download,
    Search,
    ChevronDown,
    ArrowDownLeft,
    Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { filterTransactions } from "@/lib/mockData"
import type { TransactionTypeFilter, TransactionFlagFilter } from "@/lib/mockData"
import { LiveTestBanner } from "./live-test-banner"
import { useTransactions } from "@/hooks/use-dashboard-data"

function formatCurrency(amount: number): string {
    if (amount >= 1000) {
        return `₦${(amount / 1000).toFixed(0)}K`
    }
    return `₦${amount.toLocaleString()}`
}

function formatAmount(amount: number): string {
    return `₦${amount.toLocaleString()}`
}

// Flag badge component - reconciliation outcome from TransactionResponse.status
function FlagBadge({
    flag,
}: {
    flag: "Full" | "Partial" | "Overpayment" | "Misdirected"
}) {
    const styles = {
        Full: "bg-[#DCFCE7] text-[#15803D]",
        Partial: "bg-[#FEF3C7] text-[#B45309]",
        Overpayment: "bg-[#DBEAFE] text-[#1D4ED8]",
        Misdirected: "bg-[#FEE2E2] text-[#B91C1C]",
    }
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[flag]}`}
        >
            {flag}
        </span>
    )
}

// Type cell component - this backend only ever records inbound transfers
function TypeCell() {
    return (
        <span className="inline-flex items-center gap-2 text-sm text-[#0F172A]">
            <ArrowDownLeft className="h-4 w-4 text-[#14B8A6]" />
            Deposit
        </span>
    )
}

// Amount cell component
function AmountCell({ amount }: { amount: number }) {
    return (
        <span className="text-sm font-semibold tabular-nums text-[#14B8A6]">
            +{formatAmount(amount)}
        </span>
    )
}

// Filter dropdown component
function FilterDropdown({
    label,
    value,
    options,
    onChange,
}: {
    label: string
    value: string
    options: { label: string; value: string }[]
    onChange: (value: string) => void
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-[140px] h-11 px-4 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
                <span>
                    {options.find((o) => o.value === value)?.label || label}
                </span>
                <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
            </button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-1 left-0 w-[140px] bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] transition-colors ${
                                    value === option.value
                                        ? "text-[#14B8A6] font-medium"
                                        : "text-[#0F172A]"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function TransactionsList() {
    const {
        data: transactions,
        isLoading,
        error,
        refetch,
        totalDeposits,
    } = useTransactions()
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all")
    const [flagFilter, setFlagFilter] = useState<TransactionFlagFilter>("all")

    const filteredTransactions = useMemo(
        () =>
            filterTransactions(transactions, searchQuery, typeFilter, flagFilter),
        [transactions, searchQuery, typeFilter, flagFilter]
    )

    const handleExportCSV = () => {
        const headers = [
            "Customer",
            "Bank",
            "Reference",
            "Date",
            "Type",
            "Amount",
            "Outcome",
        ]
        const rows = filteredTransactions.map((t) => [
            t.customerName,
            t.bank,
            t.reference,
            t.date,
            t.type,
            t.amount.toString(),
            t.flag,
        ])
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "transactions.csv"
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6 px-6 py-3 bg-white">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                        Transactions
                    </h1>
                    <p className="text-sm text-[#64748B] mt-1">
                        Inbound transfers into your customers&apos; dedicated
                        virtual accounts
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExportCSV}
                    className="h-10 gap-2 border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                    <Download className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm font-medium">Export CSV</span>
                </Button>
            </div>
            <div className="max-w-7xl mx-auto px-6">
                {/* Live Testing Banner */}
                <LiveTestBanner />

                {error && (
                    <div className="my-4 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span>{error}</span>
                        <Button variant="outline" size="sm" onClick={refetch}>
                            Retry
                        </Button>
                    </div>
                )}

                {/* Metrics Cards - this backend only tracks inbound transfers,
                    there is no withdrawal concept, so only one real metric. */}
                <div className="grid grid-cols-1 max-w-sm my-5">
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#CCFBF1] shrink-0">
                                <Wallet className="h-5 w-5 text-[#14B8A6]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-normal mb-1">
                                    Total Received
                                </p>
                                <p className="text-2xl font-bold text-[#0F172A] tracking-tight tabular-nums">
                                    {formatCurrency(totalDeposits)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94A3B8]" />
                        <Input
                            type="text"
                            placeholder="Search by customer, reference or bank..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-11 bg-white border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[rgba(20,184,166,0.12)]"
                        />
                    </div>
                    <FilterDropdown
                        label="All outcomes"
                        value={flagFilter}
                        options={[
                            { label: "All outcomes", value: "all" },
                            { label: "Full", value: "Full" },
                            { label: "Partial", value: "Partial" },
                            { label: "Overpayment", value: "Overpayment" },
                            { label: "Misdirected", value: "Misdirected" },
                        ]}
                        onChange={(v) => setFlagFilter(v as TransactionFlagFilter)}
                    />
                </div>

                {/* Transactions Table */}
                <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="h-11 bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Customer
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Reference
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Date
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Type
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Amount
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Outcome
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-16 text-[#94A3B8]"
                                    >
                                        Loading transactions…
                                    </TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-16 text-[#94A3B8]"
                                    >
                                        No transactions found matching your
                                        filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((txn) => (
                                    <TableRow
                                        key={txn.id}
                                        className="h-16 border-b border-[#F1F5F9] hover:bg-[#FAFBFC] transition-colors"
                                    >
                                        <TableCell className="px-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium text-[#0F172A]">
                                                    {txn.customerName}
                                                </span>
                                                <span className="text-[13px] text-[#64748B]">
                                                    {txn.bank}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <span className="text-[13px] text-[#64748B] tabular-nums font-mono">
                                                {txn.reference}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <span className="text-sm text-[#0F172A]">
                                                {txn.date}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <TypeCell />
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <AmountCell amount={txn.amount} />
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <FlagBadge flag={txn.flag} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
