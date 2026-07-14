export interface Transaction {
    id: string
    date: string
    reference: string
    description: string
    amount: number
    bank: string
    tags: string[]
    /** Optional, legacy defensive fallback used alongside `tags`. */
    flag?: string
}

export interface TransactionData {
    id: string
    customerName: string
    bank: string
    reference: string
    date: string
    /** This system only tracks inbound transfers - there is no real
     * "withdrawal" concept on the backend. Always "deposit" for now. */
    type: "deposit" | "withdrawal"
    amount: number
    /** Real reconciliation outcome from TransactionResponse.status. */
    flag: "Full" | "Partial" | "Overpayment" | "Misdirected"
}

export interface Customer {
    id: string
    name: string
    email: string
    nuban: string
    bank: string
    clientName: string
    dateJoined: string
    avatar: string
    /** Real CustomerStatus from the backend - account provisioning state,
     * NOT a payment/reconciliation flag. */
    status: "active" | "pending_nomba" | "suspended"
    targetAmount: number
    totalDeposited: number
    outstandingBalance: number
    progressPercentage: number
    transactions: Transaction[]
}

// --- Filter helpers used by the live Transactions page -------------------
// (mock data arrays previously here were removed - all pages now source
// data from the live hooks in hooks/use-dashboard-data.ts)

export type TransactionTypeFilter = "all" | "deposit" | "withdrawal"
export type TransactionFlagFilter =
    | "all"
    | "Full"
    | "Partial"
    | "Overpayment"
    | "Misdirected"

export function filterTransactions(
    transactions: TransactionData[],
    searchQuery: string,
    typeFilter: TransactionTypeFilter,
    flagFilter: TransactionFlagFilter
): TransactionData[] {
    return transactions.filter((t) => {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
            !searchQuery ||
            t.customerName.toLowerCase().includes(searchLower) ||
            t.reference.toLowerCase().includes(searchLower) ||
            t.bank.toLowerCase().includes(searchLower)

        const matchesType = typeFilter === "all" || t.type === typeFilter
        const matchesFlag = flagFilter === "all" || t.flag === flagFilter

        return matchesSearch && matchesType && matchesFlag
    })
}
