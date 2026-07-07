"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { useCustomer } from "@/hooks/use-dashboard-data"
import { SimulateTransfer } from "./simulate-transfer"

interface CustomerProfileProps {
  customerId: string
}

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const { data: customer, isLoading, error, refetch } = useCustomer(customerId)
  const [flagFilter, setFlagFilter] = useState("all")

  if (isLoading) {
    return (
      <div className="w-full text-center py-12 text-slate-400">
        Loading customer profile…
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Could not load this customer
        </h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Button variant="outline" onClick={refetch}>
          Retry
        </Button>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="w-full text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Customer Not Found
        </h2>
        <Link href="/dashboard/customers" className="text-teal-500 hover:text-teal-600 font-medium">
          Back to Customers
        </Link>
      </div>
    )
  }

  // Safe data normalized lookups across dynamic schemas
  const dateJoined = customer.dateJoined || "Jan 2025"
  const clientName = customer.clientName || "LDB Africa"
  const bankName = customer.bank || "GTBank"

  const handleCopyNuban = () => {
    navigator.clipboard.writeText(customer.nuban)
    toast.success("NUBAN copied to clipboard")
  }

  const handleExportStatement = () => {
    const txns = customer.transactions || []
    const csv = [
      ["Date", "Reference", "Description", "Amount", "Flags"],
      ...txns.map((txn) => [
        txn.date,
        txn.reference,
        txn.description,
        txn.amount,
        txn.tags?.join("; ") || txn.flag || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${customer.name}-statement.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter transactions based on selection dropdown array
  const rawTransactions = customer.transactions || []
  const filteredTransactions = rawTransactions.filter((txn) => {
    if (flagFilter === "all") return true
    const currentFlags = txn.tags || [txn.flag]
    return currentFlags.some((f) => f?.toLowerCase() === flagFilter.toLowerCase())
  })

  return (
    <div className="space-y-6 w-full">
      {/* Portfolio Title Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">Customer profile & statement</p>
        </div>
        <Link href="/dashboard/customers">
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 bg-white h-9 shadow-xs">
            <ArrowLeft className="h-4 w-4" />
            Customers
          </Button>
        </Link>
      </div>

      {/* Live Testing Simulation Banner */}
      <div className="bg-[#0B1E33] text-slate-200 px-5 py-3.5 rounded-xl flex items-center justify-between shadow-xs border border-slate-800/40">
        <div className="flex items-center gap-3 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <p className="text-slate-300 font-medium">
            Live testing mode <span className="text-slate-400 font-normal">· Simulate an incoming bank transfer to test DVA reconciliation</span>
          </p>
        </div>
        <SimulateTransfer
          defaultAccountNumber={customer.nuban}
          onSimulated={refetch}
        />
      </div>

      {/* Customer Profile Identity Box */}
      <div className="bg-[#0B1E33] text-white p-6 rounded-xl space-y-6 border border-slate-800/40 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#00BFA5]/20 text-[#00BFA5] flex items-center justify-center text-lg font-bold border border-[#00BFA5]/30">
              {customer.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{customer.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {customer.email} · Customer since {dateJoined}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            {customer.status === "Underpayment" ? "Underpaid" : customer.status}
          </span>
        </div>

        {/* NUBAN Nested Display */}
        <div className="bg-[#112741] border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
              Dedicated Virtual Account (NUBAN)
            </p>
            <p className="font-mono text-sm tracking-wide text-slate-300">
              <span className="text-white font-semibold text-base tracking-normal">{customer.nuban}</span> · {clientName} {customer.name} / {bankName}
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button 
              onClick={handleCopyNuban}
              variant="ghost" 
              className="h-9 text-slate-300 hover:text-white hover:bg-slate-800/50 gap-2 text-xs border border-slate-700/60 rounded-lg px-3.5"
            >
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              Copy NUBAN
            </Button>
            <Button 
              onClick={handleExportStatement}
              variant="ghost" 
              className="h-9 text-slate-300 hover:text-white hover:bg-slate-800/50 gap-2 text-xs border border-slate-700/60 rounded-lg px-3.5"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              Statement
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Target Amount */}
        <Card className="bg-white border-slate-200/80 p-5 shadow-xs rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Amount</p>
          <p className="text-2xl font-bold text-slate-950 mt-2 font-mono tracking-tight">
            ₦{customer.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-2.5 font-medium">Investment goal</p>
        </Card>

        {/* Total Deposited (Amber progress theme) */}
        <Card className="bg-white border-slate-200/80 p-5 shadow-xs rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Deposited</p>
          <p className="text-2xl font-bold text-amber-500 mt-2 font-mono tracking-tight">
            ₦{customer.totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-500 h-full transition-all" style={{ width: `${customer.progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">{customer.progressPercentage}% funded</p>
        </Card>

        {/* Outstanding Balance */}
        <Card className="bg-white border-slate-200/80 p-5 shadow-xs rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</p>
          <p className="text-2xl font-bold text-rose-500 mt-2 font-mono tracking-tight">
            ₦{customer.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-2.5 font-medium">Remaining to target</p>
        </Card>
      </div>

      {/* Transaction History Data Sheet Component */}
      <Card className="bg-white border-slate-200/80 shadow-xs rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-bold text-slate-900 text-base">Transaction history</h3>
          
          <div className="flex items-center gap-2">
            {/* Filter Dropdown select tool */}
            <div className="relative">
              <select 
                value={flagFilter}
                onChange={(e) => setFlagFilter(e.target.value)}
                className="appearance-none flex items-center justify-between border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium bg-white text-slate-700 min-w-[110px] shadow-2xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-slate-300"
              >
                <option value="all">All flags</option>
                <option value="underpayment">Underpaid</option>
                <option value="reversed">Reversed</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button 
              onClick={handleExportStatement}
              variant="outline" 
              className="gap-1.5 border-slate-200 text-slate-700 h-8 px-3 text-xs shadow-2xs font-medium bg-white"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Dynamic Table Layout */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-slate-100">
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Date</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Reference</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Description</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Amount</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => {
                  const isReversed = txn.tags?.includes("Reversed") || txn.flag === "Reversed" || txn.amount === 0
                  return (
                    <TableRow key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <TableCell className="px-5 py-4 text-sm text-slate-600 font-medium">{txn.date}</TableCell>
                      <TableCell className="px-5 py-4 text-xs text-slate-400 font-mono tracking-tight">{txn.reference}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-slate-600">{txn.description}</TableCell>
                      <TableCell className={`px-5 py-4 text-sm font-bold font-mono ${isReversed ? "text-rose-500" : "text-slate-900"}`}>
                        ₦{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {isReversed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            Reversed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Underpaid
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-slate-400">
                    No transactions matching filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}