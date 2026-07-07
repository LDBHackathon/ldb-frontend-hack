import type { Customer, Transaction, TransactionData } from "@/lib/mockData"
import type { BackendCustomer, BackendTransaction } from "@/lib/types/api"

// This file is the ONE place that should need edits once the live backend's
// exact field names are confirmed (see clarifying questions raised before
// implementation) - the rest of the app keeps using the existing
// Customer / Transaction / TransactionData shapes from lib/mockData.ts.

function toNumber(value: number | string | undefined | null): number {
  if (value === undefined || value === null) return 0
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : value
  return Number.isFinite(n) ? n : 0
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function formatDate(iso?: string): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

/** underpayment/normal/misdirected -> UI status label used across components */
export function mapCustomerStatus(
  status?: string
): Customer["status"] {
  switch ((status ?? "").toLowerCase()) {
    case "misdirected":
      return "Misdirected"
    case "normal":
      return "Normal"
    case "underpayment":
    case "underpaid":
    case "pending_nomba":
    default:
      return "Underpayment"
  }
}

/** payment.partial / payment.misdirected / normal -> UI flag label */
export function mapTransactionFlag(flag?: string): TransactionData["flag"] {
  switch ((flag ?? "").toLowerCase()) {
    case "overpaid":
    case "payment.overpaid":
      return "Overpaid"
    case "underpaid":
    case "payment.partial":
      return "Underpaid"
    default:
      return "Normal"
  }
}

export function mapTransactionStatus(
  status?: string
): TransactionData["status"] {
  return (status ?? "").toLowerCase() === "failed" ? "Failed" : "Success"
}

export function mapTransactionType(
  direction?: string
): TransactionData["type"] {
  return direction === "debit" || direction === "withdrawal"
    ? "withdrawal"
    : "deposit"
}

export function mapBackendTransactionToDetail(
  txn: BackendTransaction
): Transaction {
  const flagLabel = mapTransactionFlag(txn.flag)
  const tags =
    (txn.flag ?? "").toLowerCase().includes("misdirect")
      ? ["Misdirected"]
      : [flagLabel]

  return {
    id: txn.id,
    date: formatDate(txn.created_at),
    reference: txn.reference,
    description:
      txn.description ??
      `Inbound bank transfer${txn.bank_name ? ` · ${txn.bank_name}` : ""}`,
    amount: toNumber(txn.amount),
    bank: txn.bank_name ?? "",
    tags,
  }
}

export function mapBackendTransactionToRow(
  txn: BackendTransaction
): TransactionData {
  return {
    id: txn.id,
    customerName: txn.customer_name ?? "",
    bank: txn.bank_name ?? "",
    reference: txn.reference,
    date: formatDate(txn.created_at),
    type: mapTransactionType(txn.direction),
    amount: toNumber(txn.amount),
    flag: mapTransactionFlag(txn.flag),
    status: mapTransactionStatus(txn.status),
  }
}

export function mapBackendCustomerToUI(
  customer: BackendCustomer,
  transactions: BackendTransaction[] = []
): Customer {
  const targetAmount = toNumber(customer.target_amount)
  const totalDeposited = toNumber(customer.total_deposited)
  const outstandingBalance =
    customer.outstanding_balance !== undefined
      ? toNumber(customer.outstanding_balance)
      : Math.max(targetAmount - totalDeposited, 0)
  const progressPercentage =
    targetAmount > 0
      ? Math.min(100, Math.round((totalDeposited / targetAmount) * 100))
      : 0

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    nuban: customer.account?.account_number ?? "",
    bank: customer.account?.bank_name ?? "",
    clientName: "",
    dateJoined: formatDate(customer.created_at),
    avatar: initials(customer.name || customer.email),
    status: mapCustomerStatus(customer.status),
    targetAmount,
    totalDeposited,
    outstandingBalance,
    progressPercentage,
    transactions: transactions.map(mapBackendTransactionToDetail),
  }
}
