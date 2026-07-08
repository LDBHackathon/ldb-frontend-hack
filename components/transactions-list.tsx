"use client"

import { useState, useMemo } from "react"
import {
    Download,
    Search,
    ChevronDown,
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Zap,
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
import type {
    TransactionTypeFilter,
    TransactionFlagFilter,
    TransactionStatusFilter,
} from "@/lib/mockData"
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

// Status badge component
function StatusBadge({ status }: { status: "Success" | "Failed" }) {
    if (status === "Success") {
        return (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
                Success
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
            <span className="h-2 w-2 rounded-full bg-[#EF4444]"></span>
            Failed
        </span>
    )
}

// Flag badge component
function FlagBadge({ flag }: { flag: "Normal" | "Underpaid" | "Overpaid" }) {
    const styles = {
        Normal: "bg-[#F1F5F9] text-[#64748B]",
        Underpaid: "bg-[#FEF3C7] text-[#B45309]",
        Overpaid: "bg-[#FEE2E2] text-[#B91C1C]",
    }
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[flag]}`}
        >
            {flag}
        </span>
    )
}

// Type cell component
function TypeCell({ type }: { type: "deposit" | "withdrawal" }) {
    if (type === "deposit") {
        return (
            <span className="inline-flex items-center gap-2 text-sm text-[#0F172A]">
                <ArrowDownLeft className="h-4 w-4 text-[#14B8A6]" />
                Deposit
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-2 text-sm text-[#0F172A]">
            <ArrowUpRight className="h-4 w-4 text-[#F97316]" />
            Withdrawal
        </span>
    )
}

// Amount cell component
function AmountCell({
    type,
    amount,
}: {
    type: "deposit" | "withdrawal"
    amount: number
}) {
    const isDeposit = type === "deposit"
    return (
        <span
            className={`text-sm font-semibold tabular-nums ${isDeposit ? "text-[#14B8A6]" : "text-[#F97316]"}`}
        >
            {isDeposit ? "+" : "-"}
            {formatAmount(amount)}
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
        totalWithdrawals,
        netPosition,
    } = useTransactions()
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all")
    const [flagFilter, setFlagFilter] = useState<TransactionFlagFilter>("all")
    const [statusFilter, setStatusFilter] =
        useState<TransactionStatusFilter>("all")

    const filteredTransactions = useMemo(
        () =>
            filterTransactions(
                transactions,
                searchQuery,
                typeFilter,
                flagFilter,
                statusFilter
            ),
        [transactions, searchQuery, typeFilter, flagFilter, statusFilter]
    )

    const handleExportCSV = () => {
        const headers = [
            "Customer",
            "Bank",
            "Reference",
            "Date",
            "Type",
            "Amount",
            "Flags",
            "Status",
        ]
        const rows = filteredTransactions.map((t) => [
            t.customerName,
            t.bank,
            t.reference,
            t.date,
            t.type,
            t.amount.toString(),
            t.flag,
            t.status,
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
                        Deposits and withdrawals across your customers&apos;
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

                {/* Metrics Cards */}
                <div className="grid grid-cols-3 gap-4 my-5">
                    {/* Total Deposits */}
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#CCFBF1] shrink-0">
                                <ArrowDownLeft className="h-5 w-5 text-[#14B8A6]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-normal mb-1">
                                    Total Deposits
                                </p>
                                <p className="text-2xl font-bold text-[#0F172A] tracking-tight tabular-nums">
                                    {formatCurrency(totalDeposits)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Withdrawals */}
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FFEDD5] shrink-0">
                                <ArrowUpRight className="h-5 w-5 text-[#F97316]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-normal mb-1">
                                    Total Withdrawals
                                </p>
                                <p className="text-2xl font-bold text-[#0F172A] tracking-tight tabular-nums">
                                    {formatCurrency(totalWithdrawals)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Net Position */}
                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#CCFBF1] shrink-0">
                                <Wallet className="h-5 w-5 text-[#14B8A6]" />
                            </div>
                            <div>
                                <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-normal mb-1">
                                    Net Position
                                </p>
                                <p className="text-2xl font-bold text-[#0F172A] tracking-tight tabular-nums">
                                    {formatCurrency(netPosition)}
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
                        label="All types"
                        value={typeFilter}
                        options={[
                            { label: "All types", value: "all" },
                            { label: "Deposit", value: "deposit" },
                            { label: "Withdrawal", value: "withdrawal" },
                        ]}
                        onChange={(v) =>
                            setTypeFilter(v as TransactionTypeFilter)
                        }
                    />
                    <FilterDropdown
                        label="All flags"
                        value={flagFilter}
                        options={[
                            { label: "All flags", value: "all" },
                            { label: "Normal", value: "Normal" },
                            { label: "Underpaid", value: "Underpaid" },
                            { label: "Overpaid", value: "Overpaid" },
                        ]}
                        onChange={(v) =>
                            setFlagFilter(v as TransactionFlagFilter)
                        }
                    />
                    <FilterDropdown
                        label="All statuses"
                        value={statusFilter}
                        options={[
                            { label: "All statuses", value: "all" },
                            { label: "Success", value: "Success" },
                            { label: "Failed", value: "Failed" },
                        ]}
                        onChange={(v) =>
                            setStatusFilter(v as TransactionStatusFilter)
                        }
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
                                    Flags
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider px-4">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-16 text-[#94A3B8]"
                                    >
                                        Loading transactions…
                                    </TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
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
                                            <TypeCell type={txn.type} />
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <AmountCell
                                                type={txn.type}
                                                amount={txn.amount}
                                            />
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <FlagBadge flag={txn.flag} />
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <StatusBadge status={txn.status} />
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
