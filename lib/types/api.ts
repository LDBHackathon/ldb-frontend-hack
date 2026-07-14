// Types for the LDB DVA backend, corrected against the real OpenAPI spec
// (openapi.json) provided 2026-07-13. Where the spec itself types a
// response as an untyped dict (e.g. /auth/me, /portal/customers,
// /portal/transactions), we assume it mirrors the strictly-typed
// equivalent used elsewhere in the spec (MerchantResponse, CustomerResponse,
// TransactionResponse) since those are the same underlying models - but
// this is still an assumption for those specific endpoints until confirmed
// live. See lib/types/mappers.ts for where these get translated to the UI.

export type MerchantStatus = "pending_kyb" | "active" | "suspended"
export type CustomerStatus = "active" | "pending_nomba" | "suspended"
export type AccountStatus = "active" | "closed" | "suspended"
/** Reconciliation outcome for an inbound transfer - a property of the
 * TRANSACTION, not the customer. */
export type TransactionOutcome = "full" | "partial" | "overpayment" | "misdirected"

export interface Merchant {
    id: string
    name: string
    email: string
    status: MerchantStatus
    created_at?: string
    updated_at?: string
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

// --- Onboarding ---------------------------------------------------------

export interface OnboardingBusinessPayload {
    business_name: string
    trading_name?: string
    business_type?: string
    tax_id?: string
    registration_number?: string
    industry?: string
}

export interface OnboardingAddressPayload {
    address_line: string
    city: string
    state?: string
    country?: string
    /** Confirmed field name from OnboardingAddressRequestSchema - NOT `phone`. */
    business_phone?: string
    website?: string
}

export interface OnboardingVerificationPayload {
    director_name: string
    /** Confirmed field name from OnboardingVerificationRequestSchema - NOT `bvn`. */
    bvn_id?: string
    consent: boolean
    notes?: string
    cac_document_url?: string
    address_proof_url?: string
}

export interface OnboardingStatus {
    business_completed: boolean
    address_completed: boolean
    verification_completed: boolean
    submitted: boolean
    kyb_status: MerchantStatus
}

// --- Customers / Accounts (confirmed from CustomerResponse) -------------

export interface DedicatedAccountSummary {
    id: string
    account_number: string
    account_name: string
    bank_name: string
    status: AccountStatus
}

export interface BackendCustomer {
    id: string
    merchant_customer_id?: string
    name: string
    email?: string
    phone?: string
    target_amount?: number | string
    wallet_balance: number | string
    outstanding_balance?: number | string
    progress_percentage?: number
    status: CustomerStatus
    funding_status?: string
    nomba_sub_account_id?: string
    metadata?: Record<string, string>
    dedicated_account?: DedicatedAccountSummary
    created_at?: string
    updated_at?: string
}

/** POST /customers and /v1/customers body - confirmed from CreateCustomerRequestSchema. */
export interface CreateCustomerPayload {
    /** 8-64 characters. */
    name: string
    email?: string
    phone?: string
    target_amount?: number | string
    /** Exactly 11 characters. */
    bvn?: string
    metadata?: Record<string, string>
}

// --- Transactions (confirmed from TransactionResponse / StatementResponse) --

export interface BackendTransaction {
    id: string
    dedicated_account_id?: string
    nomba_request_id?: string
    nomba_transaction_id?: string
    /** Confirmed field name - NOT `reference`. */
    merchant_tx_ref?: string
    amount: number | string
    fee?: number | string
    sender_name?: string
    sender_bank?: string
    /** Always "inbound" - this system has no outbound/withdrawal concept. */
    type?: "inbound"
    /** Reconciliation outcome, NOT a success/failed flag. */
    status: TransactionOutcome
    /** Confirmed field name - NOT `description`. */
    narration?: string
    created_at: string
    customer_name?: string
}

/** GET /portal/customers/{id}/statement - assumed to mirror StatementResponse. */
export interface BackendStatement {
    account_id?: string
    merchant_customer_id?: string
    customer_name?: string
    account_number?: string
    target_amount?: number | string
    total_received?: number | string
    wallet_balance?: number | string
    outstanding_balance?: number | string
    flagged_short_payments?: number
    status?: string
    transactions: BackendTransaction[]
}

export interface DashboardSummary {
    total_customers?: number
    total_deposits?: number | string
    net_position?: number | string
    flagged_payments?: number
}

export interface TransactionsSummary {
    total_deposits?: number | string
    net_position?: number | string
    count?: number
}

// --- Settings: webhook / profile / security / credentials / upload ------

/** PUT /portal/settings/webhook body - confirmed `secret` is REQUIRED (16-255
 * chars), and there's an `active` boolean. Both were previously missing. */
export interface WebhookSettingsPayload {
    url: string
    /** Required, 16-255 characters. */
    secret: string
    events: string[]
    active?: boolean
}

export interface WebhookSettings {
    url: string
    events: string[]
    active?: boolean
    signing_secret?: string
}

/** UpdateProfileSettingsRequestSchema only accepts these two fields. */
export interface MerchantProfile {
    name?: string
    phone?: string
    email?: string
}

export interface ChangePasswordPayload {
    current_password: string
    new_password: string
}

export interface ApiKeyInfo {
    id?: string
    prefix?: string
    api_key_prefix?: string
    created_at?: string
    status?: string
}

/** UploadFileResponse (POST /portal/files/upload). */
export interface UploadedFile {
    url: string
    public_id: string
    original_filename?: string
    file_type?: string
    file_size?: number
    width?: number
    height?: number
    format?: string
}

/** OnboardingDocumentResponseSchema (POST /portal/onboarding/documents) -
 * note the URL field is `file_url`, not `url`/`secure_url`. */
export interface UploadedOnboardingDocument {
    document_type: string
    file_url: string
    public_id: string
    original_filename?: string
    file_type?: string
    file_size?: number
}

export interface OnboardingDocumentsListResponse {
    document: UploadedOnboardingDocument
    documents: UploadedOnboardingDocument[]
}

/** SimulateFundingRequestSchema (POST /portal/simulate-transfer) - note
 * `sender_name` and `sender_bank` are separate fields; there's also a
 * dedicated `misdirected` boolean for testing that flow. */
export interface SimulateTransferPayload {
    /** Max 20 characters. */
    account_number: string
    amount: string | number
    sender_name?: string
    sender_bank?: string
    misdirected?: boolean
}
