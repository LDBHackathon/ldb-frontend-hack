"use client"

//under stand how we get success and failed
import React from "react"
import Link from "next/link"
import { Users, TrendingUp, AlertTriangle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCustomers } from "@/lib/mockData"

export function DashboardOverview() {
  // Calculate metrics
  const totalCustomers = mockCustomers.length
  const totalDeposits = mockCustomers.reduce(
    (sum, customer) => sum + customer.totalDeposited,
    0
  )
  const flaggedPayments = mockCustomers.filter(
    (c) => c.status === "Underpayment" || c.status === "Misdirected"
  ).length
  const failedTransactions = mockCustomers.reduce((count, customer) => {
    return (
      count +
      customer.transactions.filter((t) => t.tags.includes("Misdirected"))
        .length
    )
  }, 0)

  // Get recent transactions
  const recentTransactions = mockCustomers
    .flatMap((customer) =>
      customer.transactions.map((txn) => ({
        ...txn,
        customerName: customer.name,
        customerStatus: customer.status,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 6)

  const getTransactionType = (description: string) => {
    if (description.toLowerCase().includes("withdrawal")) {
      return { label: "Withdrawal", icon: "↑", color: "text-orange-500" }
    }
    return { label: "Deposit", icon: "↓", color: "text-green-500" }
  }

  const getTransactionStatus = (tags: string[]) => {
    if (tags.includes("Misdirected")) {
      return { label: "Failed", color: "bg-red-100 text-red-700" }
    }
    return { label: "Successful", color: "bg-green-100 text-green-700" }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Customers
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalCustomers}
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ +3 this month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Deposits */}
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Deposits
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                ₦{(totalDeposits / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-green-600 mt-2">
                ↑ +₦240K this week
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        {/* Flagged Payments */}
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Flagged Payments
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {flaggedPayments}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Over / underpayments
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        {/* Failed Transactions */}
        <Card className="p-6 border border-slate-200 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Failed Transactions
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {failedTransactions}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Needs review
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions and Customer Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200 bg-white">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Recent transactions
              </h3>
              <Link
                href="/dashboard/transactions"
                className="text-teal-500 hover:text-teal-600 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="text-slate-500 font-semibold">
                      CUSTOMER
                    </TableHead>
                    <TableHead className="text-slate-500 font-semibold">
                      TYPE
                    </TableHead>
                    <TableHead className="text-slate-500 font-semibold">
                      AMOUNT
                    </TableHead>
                    <TableHead className="text-slate-500 font-semibold">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((txn, idx) => {
                    const txnType = getTransactionType(txn.description)
                    const txnStatus = getTransactionStatus(txn.tags)
                    return (
                      <TableRow key={idx} className="hover:bg-slate-50 [&>td]:py-4">
                        <TableCell className="text-gray-700 font-medium">
                          {txn.customerName}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${txnType.color}`}>
                            <span className="text-sm">{txnType.icon}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {txnType.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-900 font-semibold">
                          {txn.amount >= 0 ? "+" : ""}
                          ₦{txn.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${txnStatus.color} border-0`}
                          >
                            {txnStatus.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Customer Funding */}
        <Card className="border border-slate-200 bg-white">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Customer funding
            </h3>
            <Link
              href="/dashboard/customers"
              className="text-teal-500 hover:text-teal-600 text-sm font-medium"
            >
              All customers →
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900">
                    {customer.name}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₦{customer.totalDeposited.toLocaleString()} / ₦
                    {customer.targetAmount.toLocaleString()}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
