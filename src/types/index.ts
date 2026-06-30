// ─── Primitive Unions ─────────────────────────────────────────────────────────

export type AccountStatus = 'pending' | 'active' | 'frozen' | 'closed' | 'flagged' | 'resolved'
export type KycTier = 'tier1' | 'tier2' | 'tier3'

export type TransactionDirection = 'credit' | 'debit'
export type TransactionStatus = 'success' | 'pending' | 'failed'

export type WebhookEventType =
  | 'transfer.credit'
  | 'transfer.debit'
  | 'account.kyc_update'
  | 'account.frozen'
  | 'account.closed'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Account {
  id: string
  accountNumber: string
  bankName: string
  bankCode: string
  customerName: string
  customerId: string
  status: AccountStatus
  kycTier: KycTier
  balance: number
  lastCreditAt: string | null
  createdAt: string
  nombaRef: string
}

export interface Transaction {
  id: string
  virtualAccountId: string
  amount: number
  direction: TransactionDirection
  status: TransactionStatus
  matched: boolean
  misdirected: boolean
  senderName: string
  senderBank: string
  nombaRef: string
  createdAt: string
  runningBalance?: number
}

export interface WebhookEvent {
  id: string
  eventType: WebhookEventType
  virtualAccountId: string
  processed: boolean
  error: string | null
  rawPayload: unknown
  receivedAt: string
  processedAt: string | null
}

export interface Merchant {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ApiKey {
  id: string
  key: string
  label: string | null
  createdAt: string
  lastUsed: string | null
}

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration?: number
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
  details: unknown
}

// ─── Query / Response Types ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export interface AccountParams {
  status?: AccountStatus
  kycTier?: KycTier
  search?: string
  page?: number
  limit?: number
}

export interface TransactionParams {
  virtualAccountId?: string
  direction?: TransactionDirection
  status?: TransactionStatus
  matched?: boolean
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface WebhookParams {
  virtualAccountId?: string
  eventType?: WebhookEventType
  processed?: boolean
  page?: number
  limit?: number
}

export interface ProvisionPayload {
  customerName: string
  customerId: string
  kycTier: KycTier
  initialDeposit?: number
}
