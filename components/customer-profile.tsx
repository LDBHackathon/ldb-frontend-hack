"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { getCustomerById, type Customer } from "@/lib/mockData"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Underpayment":
      return "bg-orange-100 text-orange-700"
    case "Normal":
      return "bg-green-100 text-green-700"
    case "Misdirected":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getAvatarColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "bg-emerald-400"
    case "Underpayment":
      return "bg-orange-400"
    case "Misdirected":
      return "bg-red-400"
    default:
      return "bg-slate-400"
  }
}

interface CustomerProfileProps {
  customerId: string
}

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const customer = getCustomerById(customerId)
  const [searchQuery, setSearchQuery] = useState("")

  if (!customer) {
    return (
      <div className="w-full text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Customer Not Found
        </h2>
        <Link href="/dashboard/customers" className="text-teal-500 hover:text-teal-600">
          Back to Customers
        </Link>
      </div>
    )
  }

  const handleCopyNuban = () => {
    navigator.clipboard.writeText(customer.nuban)
    toast.success("NUBAN copied to clipboard")
  }

  const handleExportStatement = () => {
    const csv = [
      ["Date", "Reference", "Description", "Amount", "Tags"],
      ...customer.transactions.map((txn) => [
        txn.date,
        txn.reference,
        txn.description,
        txn.amount,
        txn.tags.join("; "),
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

  const filteredTransactions = customer.transactions.filter(
    (txn) =>
      txn.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Customers
          </Button>
        </Link>
      </div>

      {/* Portfolio Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
        <p className="text-sm text-slate-500 mt-1">Customer profile & statement</p>
      </div>

      {/* Customer Banner Card */}
      <Card className="mb-8 overflow-hidden bg-linear-to-r from-slate-900 to-[#0f2a3d]">
        <div className="p-6 text-slate-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div
                className={`h-12 w-12 rounded-full ${getAvatarColor(
                  customer.status
                )} flex items-center justify-center text-lg font-semibold text-white`}
              >
                {customer.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-sm text-slate-300 mt-1">{customer.email}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Customer since {customer.dateJoined}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                customer.status
              )} border-0 ml-auto`}
            >
              {customer.status}
            </Badge>
          </div>

          {/* NUBAN Container */}
          <div className="bg-[#0a1a2e] rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Dedicated Virtual Account (NUBAN)
            </p>
            <p className="text-2xl font-mono font-bold">
              {customer.nuban} · {customer.clientName} / {customer.bank}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleCopyNuban}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-600 text-slate-50 hover:bg-slate-800"
              >
                <Copy className="h-4 w-4" />
                Copy NUBAN
              </Button>
              <Button
                onClick={handleExportStatement}
                variant="outline"
                size="sm"
                className="gap-2 border-slate-600 text-slate-50 hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                Statement
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Target Amount */}
        <Card className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Target Amount
          </p>
          <p className="text-3xl font-bold text-slate-900">
            ₦{customer.targetAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-slate-500 mt-2">Investment goal</p>
        </Card>

        {/* Total Deposited */}
        <Card className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Total Deposited
          </p>
          <p className="text-3xl font-bold text-orange-600">
            ₦{customer.totalDeposited.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="mt-3">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  customer.progressPercentage === 100
                    ? "bg-emerald-500"
                    : "bg-orange-400"
                }`}
                style={{
                  width: `${customer.progressPercentage}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {customer.progressPercentage}% funded
            </p>
          </div>
        </Card>

        {/* Outstanding Balance */}
        <Card className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Outstanding Balance
          </p>
          <p className="text-3xl font-bold text-red-600">
            ₦{customer.outstandingBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-slate-500 mt-2">Remaining to target</p>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Transaction history
            </h3>
            <Button
              onClick={handleExportStatement}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-200">
          <Input
            type="text"
            placeholder="Search by date, reference, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-slate-200"
          />
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-700 font-semibold">
                  DATE
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  REFERENCE
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  DESCRIPTION
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  AMOUNT
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  TAGS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-slate-50">
                  <TableCell className="text-slate-900 font-medium">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="text-slate-700 text-sm font-mono">
                    {transaction.reference}
                  </TableCell>
                  <TableCell className="text-slate-700 text-sm">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-slate-900 font-semibold">
                    ₦{transaction.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {transaction.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`${
                            tag === "Underpayment"
                              ? "bg-orange-100 text-orange-700 border-0"
                              : tag === "Normal"
                                ? "bg-green-100 text-green-700 border-0"
                                : "bg-red-100 text-red-700 border-0"
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-slate-500">No transactions found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
