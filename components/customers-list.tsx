"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Download } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LiveTestBanner } from "./live-test-banner"
import { useCustomers } from "@/hooks/use-dashboard-data"

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

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "Underpayment":
      return "text-orange-500"
    case "Normal":
      return "text-green-500"
    case "Misdirected":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export function CustomersList() {
  const { data: customers, isLoading, error, refetch } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")

  const displayedCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers
    const query = searchQuery.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.bank.toLowerCase().includes(query) ||
        customer.nuban.includes(searchQuery)
    )
  }, [customers, searchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleExport = () => {
    const csv = [
      ["Customer", "Email", "NUBAN", "Funded", "Progress", "Status"],
      ...displayedCustomers.map((customer) => [
        customer.name,
        customer.email,
        customer.nuban,
        `${customer.totalDeposited} / ${customer.targetAmount}`,
        `${customer.progressPercentage}%`,
        customer.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "customers.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6 py-3 bg-white">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? "Loading…" : `${customers.length} dedicated virtual accounts`}
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2"
          disabled={isLoading || customers.length === 0}
        >
          <Download className="h-4 w-4" />
          Export
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

      {/* Search Bar */}
      <div className="my-6 relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by customer or bank..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 h-10 border-slate-200 bg-white"
        />
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="">
              <TableRow className="[&>th]:py-4">
                <TableHead className="text-slate-700 font-semibold">
                  CUSTOMER
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  NUBAN
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  FUNDED
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  PROGRESS
                </TableHead>
                <TableHead className="text-slate-700 font-semibold">
                  STATUS
                </TableHead>
                <TableHead className="text-right text-slate-700 font-semibold">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-sm text-slate-400">
                    Loading customers…
                  </TableCell>
                </TableRow>
              ) : displayedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-sm text-slate-400">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
              displayedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-slate-50 [&>td]:py-4">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full ${
                          customer.status === "Normal"
                            ? "bg-emerald-400"
                            : customer.status === "Underpayment"
                              ? "bg-orange-400"
                              : "bg-red-400"
                        } flex items-center justify-center text-sm font-semibold text-white`}
                      >
                        {customer.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-900">
                    {customer.nuban}
                  </TableCell>
                  <TableCell className="text-slate-900">
                    ₦{customer.totalDeposited.toLocaleString()} / ₦
                    {customer.targetAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden w-32">
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
                      <span className="text-xs text-slate-500">
                        {customer.progressPercentage}% funded
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(
                        customer.status
                      )} border-0`}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="text-teal-500 hover:text-teal-600 font-medium text-sm flex items-center justify-end gap-1"
                    >
                      View
                      <span className="ml-1">→</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      </div>
    </div>
  )
}
