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
  type: "deposit" | "withdrawal"
  amount: number
  flag: "Normal" | "Underpaid" | "Overpaid"
  status: "Success" | "Failed"
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
  status: "Underpayment" | "Normal" | "Misdirected"
  targetAmount: number
  totalDeposited: number
  outstandingBalance: number
  progressPercentage: number
  transactions: Transaction[]
}

export const mockCustomers: Customer[] = [
  {
    id: "adaeze-okonkwo",
    name: "Adaeze Okonkwo",
    email: "adaeze.okonkwo@email.com",
    nuban: "0123 4567 89",
    bank: "GTBank",
    clientName: "LDB Africa",
    dateJoined: "Jan 2025",
    avatar: "AO",
    status: "Underpayment",
    targetAmount: 100000,
    totalDeposited: 60000,
    outstandingBalance: 40000,
    progressPercentage: 60,
    transactions: [
      {
        id: "txn-001",
        date: "15 Jul 2025",
        reference: "TXN-9A4F-B21C-8E3D",
        description: "Inbound bank transfer · GTBank",
        amount: 60000,
        bank: "GTBank",
        tags: ["Underpayment"],
      },
      {
        id: "txn-002",
        date: "02 Jul 2025",
        reference: "TXN-3B8C-A94F-21DE",
        description: "Inbound bank transfer · Access Bank",
        amount: 0,
        bank: "Access Bank",
        tags: ["Misdirected"],
      },
    ],
  },
  {
    id: "chidi-eze",
    name: "Chidi Eze",
    email: "chidi.eze@email.com",
    nuban: "0987 654 321",
    bank: "GTBank",
    clientName: "LDB Africa",
    dateJoined: "Jan 2025",
    avatar: "CE",
    status: "Normal",
    targetAmount: 100000,
    totalDeposited: 100000,
    outstandingBalance: 0,
    progressPercentage: 100,
    transactions: [
      {
        id: "txn-003",
        date: "10 Jul 2025",
        reference: "TXN-5C2D-E3F4-9A1B",
        description: "Inbound bank transfer · GTBank",
        amount: 100000,
        bank: "GTBank",
        tags: ["Normal"],
      },
    ],
  },
  {
    id: "ngozi-uche",
    name: "Ngozi Uche",
    email: "ngozi.uche@email.com",
    nuban: "0456 789 123",
    bank: "Access Bank",
    clientName: "LDB Africa",
    dateJoined: "Feb 2025",
    avatar: "NU",
    status: "Misdirected",
    targetAmount: 50000,
    totalDeposited: 8000,
    outstandingBalance: 45000,
    progressPercentage: 0,
    transactions: [
      {
        id: "txn-004",
        date: "01 Jul 2025",
        reference: "TXN-7G5H-I6J7-2K3L",
        description: "Pending inbound transfer · Access Bank",
        amount: 8000,
        bank: "Access Bank",
        tags: ["Misdirected"],
      },
    ],
  },
  {
    id: "emeka-nwosu",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@email.com",
    nuban: "0321 654 987",
    bank: "GTBank",
    clientName: "LDB Africa",
    dateJoined: "Jan 2025",
    avatar: "EN",
    status: "Underpayment",
    targetAmount: 150000,
    totalDeposited: 80000,
    outstandingBalance: 70000,
    progressPercentage: 53,
    transactions: [
      {
        id: "txn-005",
        date: "12 Jul 2025",
        reference: "TXN-8M9N-O1P2-Q3R4",
        description: "Inbound bank transfer · GTBank",
        amount: 80000,
        bank: "GTBank",
        tags: ["Underpayment"],
      },
    ],
  },
  {
    id: "funmi-adesanya",
    name: "Funmi Adesanya",
    email: "funmi.adesanya@email.com",
    nuban: "0654 321 098",
    bank: "Access Bank",
    clientName: "LDB Africa",
    dateJoined: "Jan 2025",
    avatar: "FA",
    status: "Underpayment",
    targetAmount: 200000,
    totalDeposited: 120000,
    outstandingBalance: 80000,
    progressPercentage: 60,
    transactions: [
      {
        id: "txn-006",
        date: "08 Jul 2025",
        reference: "TXN-5S6T-U7V8-W9X0",
        description: "Inbound bank transfer · Access Bank",
        amount: 120000,
        bank: "Access Bank",
        tags: ["Underpayment"],
      },
    ],
  },
]

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((customer) => customer.id === id)
}

export const searchCustomers = (query: string): Customer[] => {
  const lowerQuery = query.toLowerCase()
  return mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.bank.toLowerCase().includes(lowerQuery) ||
      customer.nuban.includes(query)
  )
}

//transaction


export const mockTransactions: TransactionData[] = [
  {
    id: "1",
    customerName: "Adaeze Okonkwo",
    bank: "GTBank",
    reference: "TXN-9A4F-B21C-8E3D",
    date: "15 Jul 2025",
    type: "deposit",
    amount: 60000,
    flag: "Underpaid",
    status: "Success",
  },
  {
    id: "2",
    customerName: "Chidi Eze",
    bank: "Zenith Bank",
    reference: "TXN-3B2C-A94F-21DE",
    date: "14 Jul 2025",
    type: "deposit",
    amount: 100000,
    flag: "Normal",
    status: "Success",
  },
  {
    id: "3",
    customerName: "Funmi Adesanya",
    bank: "GTBank",
    reference: "TXN-5C1A-D472-3F8B",
    date: "13 Jul 2025",
    type: "deposit",
    amount: 220000,
    flag: "Overpaid",
    status: "Success",
  },
  {
    id: "4",
    customerName: "Chidi Eze",
    bank: "Access Bank",
    reference: "TXN-8E1D-4A2B-77CF",
    date: "12 Jul 2025",
    type: "withdrawal",
    amount: 35000,
    flag: "Normal",
    status: "Success",
  },
  {
    id: "5",
    customerName: "Emeka Nwosu",
    bank: "First Bank",
    reference: "TXN-7F2E-C380-9B1A",
    date: "12 Jul 2025",
    type: "deposit",
    amount: 80000,
    flag: "Underpaid",
    status: "Success",
  },
  {
    id: "6",
    customerName: "Ngozi Uche",
    bank: "UBA",
    reference: "TXN-7D1E-C380-2A55",
    date: "11 Jul 2025",
    type: "deposit",
    amount: 25000,
    flag: "Normal",
    status: "Failed",
  },
]

// Derived metrics
export const totalDeposits = mockTransactions
  .filter((t) => t.type === "deposit" && t.status === "Success")
  .reduce((sum, t) => sum + t.amount, 0)

export const totalWithdrawals = mockTransactions
  .filter((t) => t.type === "withdrawal" && t.status === "Success")
  .reduce((sum, t) => sum + t.amount, 0)

export const netPosition = totalDeposits - totalWithdrawals

// Filter helpers
export type TransactionTypeFilter = "all" | "deposit" | "withdrawal"
export type TransactionFlagFilter = "all" | "Normal" | "Underpaid" | "Overpaid"
export type TransactionStatusFilter = "all" | "Success" | "Failed"

export function filterTransactions(
  transactions: TransactionData[],
  searchQuery: string,
  typeFilter: TransactionTypeFilter,
  flagFilter: TransactionFlagFilter,
  statusFilter: TransactionStatusFilter
): TransactionData[] {
  return transactions.filter((t) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      t.customerName.toLowerCase().includes(searchLower) ||
      t.reference.toLowerCase().includes(searchLower) ||
      t.bank.toLowerCase().includes(searchLower)

    // Type filter
    const matchesType = typeFilter === "all" || t.type === typeFilter

    // Flag filter
    const matchesFlag = flagFilter === "all" || t.flag === flagFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || t.status === statusFilter

    return matchesSearch && matchesType && matchesFlag && matchesStatus
  })
}
