// Structured reference for the LDB DVA backend, sourced from the API Flow
// Guide. Used by components/api-docs.tsx to render an in-app reference.

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
export type AuthMode = "none" | "session" | "bearer" | "session-or-bearer"

export interface EndpointDoc {
    method: HttpMethod
    path: string
    auth: AuthMode
    summary: string
    requestExample?: string
    responseExample?: string
    notes?: string
}

export interface EndpointGroup {
    id: string
    title: string
    description: string
    endpoints: EndpointDoc[]
}

export const AUTH_LABELS: Record<AuthMode, string> = {
    none: "No auth",
    session: "Session cookie",
    bearer: "Bearer API key",
    "session-or-bearer": "Session or Bearer",
}

export const endpointGroups: EndpointGroup[] = [
    {
        id: "auth",
        title: "Authentication",
        description:
            "Register or sign in to get a session cookie (ldb_session) used by all portal routes.",
        endpoints: [
            {
                method: "POST",
                path: "/auth/register",
                auth: "none",
                summary:
                    "Creates a merchant (status: pending_kyb), issues a default API key (shown once), and sets the session cookie.",
                requestExample: `{
  "full_name": "Amara Olu",
  "email": "amara@example.com",
  "password": "secure-password"
}`,
            },
            {
                method: "POST",
                path: "/auth/login",
                auth: "none",
                summary:
                    "Signs in a returning user and sets the session cookie.",
                requestExample: `{
  "email": "amara@example.com",
  "password": "secure-password"
}`,
            },
            {
                method: "GET",
                path: "/auth/me",
                auth: "session-or-bearer",
                summary: "Returns the current merchant profile.",
            },
            {
                method: "POST",
                path: "/auth/logout",
                auth: "session",
                summary: "Clears the session cookie.",
            },
        ],
    },
    {
        id: "onboarding",
        title: "KYB Onboarding",
        description:
            "Business, address, and verification data is stored on merchants.kyb_data. All steps require portal auth.",
        endpoints: [
            {
                method: "PATCH",
                path: "/portal/onboarding/business",
                auth: "session-or-bearer",
                summary: "Business name, registration number, industry.",
            },
            {
                method: "PATCH",
                path: "/portal/onboarding/address",
                auth: "session-or-bearer",
                summary: "Address, phone, website.",
            },
            {
                method: "PATCH",
                path: "/portal/onboarding/verification",
                auth: "session-or-bearer",
                summary:
                    "Director name, BVN, document URLs, consent. Document URLs come from the documents upload endpoint below, not raw files.",
            },
            {
                method: "POST",
                path: "/portal/onboarding/documents",
                auth: "session-or-bearer",
                summary:
                    "Uploads a CAC / proof-of-address file (multipart, max 10MB) and returns a hosted URL. Files are stored in Cloudinary; metadata is saved in kyb_data.documents.",
                requestExample: `document_type=cac_certificate
file=<PDF or image, max 10MB>`,
            },
            {
                method: "POST",
                path: "/portal/onboarding/submit",
                auth: "session-or-bearer",
                summary:
                    "Submits KYB for review. Requires business, address, and verification steps to be completed first.",
            },
            {
                method: "GET",
                path: "/portal/onboarding/status",
                auth: "session-or-bearer",
                summary: "Checklist and current KYB state.",
            },
        ],
    },
    {
        id: "settings",
        title: "Portal Settings",
        description:
            "Credentials, webhook configuration, profile, and security.",
        endpoints: [
            {
                method: "GET",
                path: "/portal/settings/credentials",
                auth: "session-or-bearer",
                summary: "Lists API key prefixes.",
            },
            {
                method: "POST",
                path: "/portal/settings/credentials/rotate",
                auth: "session-or-bearer",
                summary:
                    "Rotates the secret key. New key returned once — copy it immediately.",
            },
            {
                method: "GET",
                path: "/portal/settings/webhook",
                auth: "session-or-bearer",
                summary: "Outbound webhook URL and subscribed events.",
            },
            {
                method: "PUT",
                path: "/portal/settings/webhook",
                auth: "session-or-bearer",
                summary: "Sets the webhook URL and subscribed events.",
                requestExample: `{
  "url": "https://your-app.com/webhooks/ldb",
  "events": ["wallet.credited", "payment.partial"]
}`,
            },
            {
                method: "POST",
                path: "/portal/settings/webhook/test",
                auth: "session-or-bearer",
                summary: "Sends a test payload to the configured webhook.",
            },
            {
                method: "GET",
                path: "/portal/settings/profile",
                auth: "session-or-bearer",
                summary: "Merchant profile (name, email, phone).",
            },
            {
                method: "PATCH",
                path: "/portal/settings/profile",
                auth: "session-or-bearer",
                summary: "Updates the merchant profile.",
            },
            {
                method: "POST",
                path: "/portal/settings/security/password",
                auth: "session-or-bearer",
                summary: "Changes the dashboard password.",
                requestExample: `{
  "current_password": "••••••••",
  "new_password": "••••••••"
}`,
            },
        ],
    },
    {
        id: "dashboard",
        title: "Dashboard (portal reads)",
        description:
            "Read-only aggregates and lists, used once customers exist.",
        endpoints: [
            {
                method: "GET",
                path: "/portal/dashboard/summary",
                auth: "session-or-bearer",
                summary: "High-level counts and balances.",
            },
            {
                method: "GET",
                path: "/portal/customers",
                auth: "session-or-bearer",
                summary: "List customers.",
            },
            {
                method: "GET",
                path: "/portal/customers/{id}",
                auth: "session-or-bearer",
                summary: "Customer detail.",
            },
            {
                method: "GET",
                path: "/portal/customers/{id}/statement",
                auth: "session-or-bearer",
                summary: "Customer statement.",
            },
            {
                method: "GET",
                path: "/portal/transactions",
                auth: "session-or-bearer",
                summary: "All transactions.",
            },
            {
                method: "GET",
                path: "/portal/transactions/summary",
                auth: "session-or-bearer",
                summary: "Aggregates (deposits, withdrawals, net position).",
            },
            {
                method: "GET",
                path: "/portal/transactions/recent",
                auth: "session-or-bearer",
                summary: "Recent activity.",
            },
            {
                method: "POST",
                path: "/portal/simulate-transfer",
                auth: "session-or-bearer",
                summary:
                    "Simulates an inbound transfer (sandbox only). Alias: POST /webhooks/dva-funding.",
                requestExample: `{
  "account_number": "1234567890",
  "amount": "50000.00",
  "sender_name": "Test Payer"
}`,
            },
        ],
    },
    {
        id: "dva",
        title: "Customers & DVA (developer)",
        description:
            "Requires a Bearer API key and merchant status active. Used for creating customers and dedicated virtual accounts directly.",
        endpoints: [
            {
                method: "POST",
                path: "/customers",
                auth: "bearer",
                summary:
                    "Creates a customer, provisions a Nomba sub-account + dedicated virtual account, and returns bank details.",
                requestExample: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+2348012345678",
  "target_amount": "100000.00",
  "metadata": {}
}`,
            },
            {
                method: "POST",
                path: "/customers/{customer_id}/link-nomba-sub-account",
                auth: "bearer",
                summary:
                    "Retries Nomba provisioning if a customer is stuck in pending_nomba.",
            },
            {
                method: "POST",
                path: "/accounts/dedicated",
                auth: "bearer",
                summary:
                    "Provisions a dedicated account for an existing customer.",
            },
            {
                method: "GET",
                path: "/accounts/{account_id}",
                auth: "bearer",
                summary: "Account details.",
            },
            {
                method: "GET",
                path: "/accounts/{account_id}/transactions",
                auth: "bearer",
                summary: "Paginated transactions.",
            },
            {
                method: "GET",
                path: "/accounts/{account_id}/statement",
                auth: "bearer",
                summary: "Statement.",
            },
            {
                method: "GET",
                path: "/customers/{customer_id}",
                auth: "bearer",
                summary: "Customer profile.",
            },
            {
                method: "PATCH",
                path: "/customers/{customer_id}",
                auth: "bearer",
                summary: "Update customer.",
            },
            {
                method: "POST",
                path: "/v1/customers",
                auth: "bearer",
                summary: "Versioned equivalent of POST /customers.",
            },
        ],
    },
    {
        id: "payments",
        title: "Payments & Webhooks",
        description:
            "Inbound bank transfer → reconciliation → outbound merchant webhook.",
        endpoints: [
            {
                method: "POST",
                path: "/hooks/nomba",
                auth: "none",
                summary:
                    "Inbound webhook from Nomba (HMAC-signed via X-Nomba-Signature). Verifies signature, matches account, reconciles amount, updates wallet balance, forwards event to the merchant webhook.",
            },
            {
                method: "POST",
                path: "/hooks/simulate",
                auth: "bearer",
                summary: "Sandbox simulate, no real transfer.",
            },
            {
                method: "POST",
                path: "/webhooks/register",
                auth: "bearer",
                summary:
                    "Registers the merchant's outbound webhook URL + events (developer alternative to the portal settings PUT).",
                requestExample: `{
  "url": "https://your-app.com/webhooks/ldb",
  "events": ["wallet.credited", "payment.partial"]
}`,
            },
        ],
    },
    {
        id: "files",
        title: "File Uploads (portal)",
        description:
            "Generic Cloudinary uploads for KYB or other portal assets (PDF, JPEG, PNG, GIF, WebP, max 10MB).",
        endpoints: [
            {
                method: "POST",
                path: "/portal/files/upload",
                auth: "session-or-bearer",
                summary: "Single file (e.g. avatar photo).",
            },
            {
                method: "POST",
                path: "/portal/files/upload/multiple",
                auth: "session-or-bearer",
                summary: "Up to 10 files.",
            },
            {
                method: "DELETE",
                path: "/portal/files/{public_id}",
                auth: "session-or-bearer",
                summary: "Remove a file.",
            },
            {
                method: "GET",
                path: "/portal/files/{public_id}/info",
                auth: "session-or-bearer",
                summary: "File metadata.",
            },
        ],
    },
    {
        id: "other",
        title: "Other",
        description: "Health checks, legacy registration, and metrics.",
        endpoints: [
            {
                method: "GET",
                path: "/health",
                auth: "none",
                summary: "Health check.",
            },
            {
                method: "POST",
                path: "/merchants/register",
                auth: "none",
                summary:
                    "Legacy merchant registration (API key only, no session).",
            },
            {
                method: "GET",
                path: "/merchants/me",
                auth: "bearer",
                summary: "Merchant profile via API key.",
            },
            {
                method: "GET",
                path: "/metrics",
                auth: "none",
                summary: "Prometheus metrics.",
            },
        ],
    },
]

export const responseEnvelopeExample = {
    success: `{
  "status": "success",
  "status_code": 201,
  "message": "Customer created",
  "data": { }
}`,
    failure: `{
  "status": "failure",
  "status_code": 401,
  "message": "Unauthorized access"
}`,
}
