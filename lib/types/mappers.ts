import type { Customer, Transaction, TransactionData } from "@/lib/mockData"
import type { BackendCustomer, BackendTransaction } from "@/lib/types/api"

// Field mappings here are confirmed against the real OpenAPI spec
// (2026-07-13). Two endpoints we rely on - GET /portal/customers and
// GET /portal/transactions - are still typed as untyped dicts in that spec,
// so we assume they mirror CustomerResponse/TransactionResponse (the
// strictly-typed equivalents used by the developer endpoints on the same
// underlying models). If that assumption is wrong, this file is still the
// one place to correct it.

function toNumber(value: number | string | undefined | null): number {
    if (value === undefined || value === null) return 0
    const n =
        typeof value === "string" ? Number(value.replace(/,/g, "")) : value
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

/** CustomerStatus (active/pending_nomba/suspended) -> UI label.
 * This is the customer's account-provisioning status, unrelated to
 * payment reconciliation. */
export function mapCustomerStatus(status: string): Customer["status"] {
    switch (status) {
        case "suspended":
            return "suspended"
        case "pending_nomba":
            return "pending_nomba"
        case "active":
        default:
            return "active"
    }
}

/** TransactionStatus (full/partial/overpayment/misdirected) -> UI label.
 * This is the transaction's reconciliation OUTCOME - the real backend has
 * no separate success/failed field; every recorded transaction succeeded
 * in being processed, "misdirected"/"partial" describe amount mismatches,
 * not failures. */
export function mapTransactionFlag(
    outcome: string
): TransactionData["flag"] {
    switch (outcome) {
        case "partial":
            return "Partial"
        case "overpayment":
            return "Overpayment"
        case "misdirected":
            return "Misdirected"
        case "full":
        default:
            return "Full"
    }
}

export function mapBackendTransactionToDetail(
    txn: BackendTransaction
): Transaction {
    const flagLabel = mapTransactionFlag(txn.status)

    return {
        id: txn.id,
        date: formatDate(txn.created_at),
        reference: txn.merchant_tx_ref ?? txn.nomba_request_id ?? txn.id,
        description:
            txn.narration ??
            `Inbound bank transfer${txn.sender_bank ? ` · ${txn.sender_bank}` : ""}`,
        amount: toNumber(txn.amount),
        bank: txn.sender_bank ?? "",
        tags: [flagLabel],
    }
}

export function mapBackendTransactionToRow(
    txn: BackendTransaction
): TransactionData {
    return {
        id: txn.id,
        customerName: txn.customer_name ?? "",
        bank: txn.sender_bank ?? "",
        reference: txn.merchant_tx_ref ?? txn.nomba_request_id ?? txn.id,
        date: formatDate(txn.created_at),
        // This system only ever records inbound transfers - there is no
        // real "withdrawal" transaction type on the backend.
        type: "deposit",
        amount: toNumber(txn.amount),
        flag: mapTransactionFlag(txn.status),
    }
}

export function mapBackendCustomerToUI(
    customer: BackendCustomer,
    transactions: BackendTransaction[] = []
): Customer {
    const targetAmount = toNumber(customer.target_amount)
    // Confirmed real fields: wallet_balance, outstanding_balance,
    // progress_percentage are all provided directly by the backend - no
    // need to compute them client-side.
    const walletBalance = toNumber(customer.wallet_balance)
    const outstandingBalance =
        customer.outstanding_balance !== undefined
            ? toNumber(customer.outstanding_balance)
            : Math.max(targetAmount - walletBalance, 0)
    const progressPercentage =
        customer.progress_percentage !== undefined
            ? Math.round(customer.progress_percentage)
            : targetAmount > 0
              ? Math.min(100, Math.round((walletBalance / targetAmount) * 100))
              : 0

    return {
        id: customer.id,
        name: customer.name,
        email: customer.email ?? "",
        nuban: customer.dedicated_account?.account_number ?? "",
        bank: customer.dedicated_account?.bank_name ?? "",
        clientName: "",
        dateJoined: formatDate(customer.created_at),
        avatar: initials(customer.name || customer.email || "?"),
        status: mapCustomerStatus(customer.status),
        targetAmount,
        totalDeposited: walletBalance,
        outstandingBalance,
        progressPercentage,
        transactions: transactions.map(mapBackendTransactionToDetail),
    }
}
