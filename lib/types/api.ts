// Types for the LDB DVA backend, as documented in the API Flow Guide.
// NOTE: the guide documents *endpoints*, not exact field names for every
// response. Fields marked "best effort" are our best guess from the guide
// and should be adjusted once the live response shape is confirmed (see
// lib/types/mappers.ts, which is the single place that would need updating).

export type MerchantStatus = "pending_kyb" | "active" | "suspended" | string

export interface Merchant {
  id: string
  full_name?: string
  name?: string
  email: string
  status: MerchantStatus
  business_name?: string
  businessName?: string
  phone?: string
  avatar_url?: string
  kyb_data?: Record<string, unknown>
  api_key_prefix?: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

// --- Onboarding -------------------------------------------------------

export interface OnboardingBusinessPayload {
  business_name: string
  registration_number: string
  industry: string
  trading_name?: string
  business_type?: string
  tax_id?: string
  /* website?: string */
}

export interface OnboardingAddressPayload {
  address_line: string
  city: string
  state: string
  /* postal_code: string */
  country: string
  phone?: string
  website?: string
}

export interface OnboardingVerificationPayload {
  director_name: string
  bvn: string
  consent: boolean
  notes?: string
  /** URL returned after uploading the file via /portal/onboarding/documents. */
  cac_document_url?: string
  /** URL returned after uploading the file via /portal/onboarding/documents. */
  address_proof_url?: string
}

export interface OnboardingStatus {
  business_completed: boolean
  address_completed: boolean
  verification_completed: boolean
  submitted: boolean
  kyb_status: MerchantStatus
}

// --- Customers / Accounts (backend, best effort) -----------------------

export interface BackendAccount {
  id: string
  customer_id: string
  account_number: string
  bank_name: string
  account_name?: string
  status?: string
}

export interface BackendCustomer {
  id: string
  name: string
  email: string
  phone?: string
  target_amount: number | string
  total_deposited?: number | string
  outstanding_balance?: number | string
  status?: "underpayment" | "normal" | "misdirected" | "pending_nomba" | string
  created_at?: string
  account?: BackendAccount
  metadata?: Record<string, unknown>
}

export interface BackendTransaction {
  id: string
  customer_id?: string
  customer_name?: string
  reference: string
  amount: number | string
  bank_name?: string
  direction?: "credit" | "debit" | "deposit" | "withdrawal"
  flag?: "normal" | "underpaid" | "overpaid" | "misdirected" | string
  status?: "success" | "failed" | "pending" | string
  created_at: string
  description?: string
}

export interface DashboardSummary {
  total_customers?: number
  total_deposits?: number | string
  total_withdrawals?: number | string
  net_position?: number | string
  flagged_payments?: number
  failed_transactions?: number
}

export interface WebhookSettings {
  url: string
  events: string[]
  signing_secret?: string
}

export interface SimulateTransferPayload {
  account_number: string
  amount: string | number
  sender_name?: string
}

// --- Settings: profile / security / credentials / file upload ---------

export interface MerchantProfile {
  full_name?: string
  name?: string
  email?: string
  business_name?: string
  phone?: string
  avatar_url?: string
  language?: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

/** GET /portal/settings/credentials - the guide says this "lists API key
 * prefixes", implying possibly more than one key. We handle both a single
 * object and an array of these in the credentials hook. */
export interface ApiKeyInfo {
  id?: string
  prefix?: string
  api_key_prefix?: string
  created_at?: string
  status?: string
}

export interface UploadedFile {
  url?: string
  secure_url?: string
  public_id?: string
}

export interface TransactionsSummary {
  total_deposits?: number | string
  total_withdrawals?: number | string
  net_position?: number | string
  count?: number
}
