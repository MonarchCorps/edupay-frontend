import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge, Callout, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Title, Text, Divider } from '@tremor/react'
import { BookOpen, ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { clsx } from 'clsx'
import type { Color } from '@tremor/react'

void BookOpen

const METHOD_COLOURS: Record<string, Color> = { GET: 'green', POST: 'blue', PATCH: 'yellow', DELETE: 'red' }

interface CodeBlockProps {
  children: string
}

function CodeBlock({ children }: CodeBlockProps) {
  const { copy, copied } = useCopyToClipboard()
  return (
    <div className="relative rounded-tremor-small overflow-hidden mt-2">
      <button
        onClick={() => copy(children)}
        className="absolute top-2 right-2 text-xs text-brand-light/60 hover:text-brand-light bg-brand-dark/80 px-2 py-0.5 rounded"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-brand-dark text-brand-light font-mono text-xs p-4 overflow-auto">
        {children}
      </pre>
    </div>
  )
}

interface Endpoint {
  method: string
  path: string
  description: string
  request: string
  response: string
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST', path: '/accounts', description: 'Provision a new virtual account',
    request: `{
  "customerName": "Chukwuemeka Okafor",
  "customerId": "cust_001",
  "kycTier": "tier2",
  "initialDeposit": 5000
}`,
    response: `{
  "id": "acc_xxxxxxxxxxx",
  "accountNumber": "0031234567",
  "customerName": "Chukwuemeka Okafor",
  "status": "pending",
  "nombaRef": "NMB-ACC-20260623-001",
  "createdAt": "2026-06-23T10:00:00.000Z"
}`,
  },
  {
    method: 'GET', path: '/accounts', description: 'List all virtual accounts',
    request: '?status=active&kycTier=tier2&search=Chukwu&page=1&limit=20',
    response: `{
  "data": [ { "id": "acc_001", "accountNumber": "0031234567", ... } ],
  "total": 1,
  "page": 1,
  "limit": 20
}`,
  },
  {
    method: 'GET', path: '/accounts/:id', description: 'Retrieve a single virtual account',
    request: '',
    response: `{
  "id": "acc_001",
  "accountNumber": "0031234567",
  "customerName": "Chukwuemeka Okafor",
  "status": "active",
  "kycTier": "tier3",
  "balance": 125000000,
  "lastCreditAt": "2026-06-22T14:30:00.000Z"
}`,
  },
  {
    method: 'PATCH', path: '/accounts/:id', description: 'Rename an account',
    request: '{ "customerName": "New Name" }',
    response: '{ "id": "acc_001", "customerName": "New Name", ... }',
  },
  {
    method: 'POST', path: '/accounts/:id/close', description: 'Close an account and sweep balance',
    request: '',
    response: '{ "id": "acc_001", "status": "closed", "balance": 0 }',
  },
  {
    method: 'GET', path: '/accounts/:id/statement', description: 'Get ledger statement with running balance',
    request: '',
    response: `[
  { "id": "txn_001", "direction": "credit", "amount": 5000000, "runningBalance": 5000000, ... }
]`,
  },
  {
    method: 'GET', path: '/transactions', description: 'List all transactions',
    request: '?direction=credit&status=success&from=2026-06-01',
    response: '{ "data": [...], "total": 50 }',
  },
  {
    method: 'GET', path: '/webhook-events', description: 'List webhook events',
    request: '?eventType=transfer.credit&processed=false',
    response: '{ "data": [...], "total": 5 }',
  },
  {
    method: 'POST', path: '/webhook-events/:id/replay', description: 'Replay a webhook event',
    request: '',
    response: '{ "id": "wh_001", "processed": true, "processedAt": "2026-06-23T10:01:00.000Z" }',
  },
]

interface EndpointCardProps {
  endpoint: Endpoint
}

function EndpointCard({ endpoint }: EndpointCardProps) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="cursor-pointer" onClick={() => setOpen((o) => !o)}>
      <div className="flex items-center gap-3">
        <Badge color={METHOD_COLOURS[endpoint.method]} className="font-mono text-xs w-14 text-center">
          {endpoint.method}
        </Badge>
        <code className="font-mono text-sm text-brand-dark flex-1">{endpoint.path}</code>
        <span className="text-sm text-gray-500 hidden md:block">{endpoint.description}</span>
        <ChevronDown className={clsx('w-4 h-4 text-gray-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </div>
      {open && (
        <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
          <Text className="font-medium">Request</Text>
          {endpoint.request
            ? <CodeBlock>{endpoint.request}</CodeBlock>
            : <Text className="text-gray-400 text-sm">No request body</Text>}
          <Text className="font-medium mt-3">Response</Text>
          <CodeBlock>{endpoint.response}</CodeBlock>
        </div>
      )}
    </Card>
  )
}

const WEBHOOK_EVENTS_TABLE = [
  { event: 'transfer.credit',    when: 'Inbound transfer credited to a virtual account' },
  { event: 'transfer.debit',     when: 'Outbound transfer debited from a virtual account' },
  { event: 'account.kyc_update', when: 'KYC tier changed for a virtual account' },
  { event: 'account.frozen',     when: 'Virtual account frozen (manual or automated)' },
  { event: 'account.closed',     when: 'Virtual account permanently closed' },
]

const ERROR_CODES = [
  { code: 'ACCOUNT_NOT_FOUND',    http: 404, meaning: 'No account with the given ID', action: 'Check the account ID' },
  { code: 'INSUFFICIENT_BALANCE', http: 422, meaning: 'Debit exceeds available balance', action: 'Top up before debiting' },
  { code: 'ACCOUNT_FROZEN',       http: 403, meaning: 'Account is frozen — no transfers allowed', action: 'Unfreeze account first' },
  { code: 'ACCOUNT_CLOSED',       http: 410, meaning: 'Account has been permanently closed', action: 'Provision a new account' },
  { code: 'INVALID_API_KEY',      http: 401, meaning: 'API key is missing or invalid', action: 'Regenerate key in Settings' },
  { code: 'VALIDATION_ERROR',     http: 400, meaning: 'Request body failed validation', action: 'Check the error.details field' },
]

export default function ApiDocs() {
  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader title="API Reference" subtitle="EduPay DVA Infrastructure API — v1.0" />

      <Card>
        <Title>Authentication</Title>
        <Text className="mt-2">
          All API requests must include a bearer token in the Authorization header.
          Generate your API key in <Link to="/settings" className="text-brand-mid underline">Settings</Link>.
        </Text>
        <CodeBlock>{`Authorization: Bearer sk_sandbox_••••••••••••••••`}</CodeBlock>
        <Callout className="mt-4" title="Sandbox vs Production" color="yellow">
          Keys prefixed with <code className="font-mono text-xs">sk_sandbox_</code> are for sandbox only.
          Production keys use <code className="font-mono text-xs">sk_live_</code>.
        </Callout>
      </Card>

      <div>
        <Title className="mb-3">Endpoints</Title>
        <div className="space-y-2">
          {ENDPOINTS.map((ep) => (
            <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
          ))}
        </div>
      </div>

      <Card>
        <Title>Webhook Events</Title>
        <Text className="mb-4 mt-1">
          EduPay forwards Nomba webhook events to your registered endpoint. Each event is signed
          with HMAC-SHA256 via the <code className="font-mono text-xs">X-Nomba-Signature</code> header.
        </Text>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Event</TableHeaderCell>
              <TableHeaderCell>When it fires</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {WEBHOOK_EVENTS_TABLE.map((r) => (
              <TableRow key={r.event}>
                <TableCell><code className="font-mono text-xs">{r.event}</code></TableCell>
                <TableCell className="text-gray-600 text-sm">{r.when}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider className="my-4" />
        <Title className="text-base">transfer.credit Payload</Title>
        <CodeBlock>{`{
  "event": "transfer.credit",
  "data": {
    "virtualAccountId": "acc_001",
    "amount": 5000000,
    "currency": "NGN",
    "senderName": "Zenith Bank PLC",
    "senderBank": "Zenith Bank",
    "narration": "Payment for services",
    "nombaRef": "NMB-TXN-20260623-001",
    "timestamp": "2026-06-23T10:00:00.000Z"
  },
  "meta": { "version": "1.0", "environment": "sandbox" }
}`}</CodeBlock>

        <Divider className="my-4" />
        <Title className="text-base">Signature Verification (HMAC-SHA256)</Title>
        <CodeBlock>{`const crypto = require('crypto')

const secret = process.env.NOMBA_WEBHOOK_SECRET
const signature = req.headers['x-nomba-signature']
const payload = JSON.stringify(req.body)

const expected = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex')

if (signature !== expected) {
  return res.status(401).json({ error: 'Invalid signature' })
}`}</CodeBlock>
      </Card>

      <Card>
        <Title>Error Codes</Title>
        <Table className="mt-3">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>HTTP</TableHeaderCell>
              <TableHeaderCell>Meaning</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ERROR_CODES.map((r) => (
              <TableRow key={r.code}>
                <TableCell><code className="font-mono text-xs">{r.code}</code></TableCell>
                <TableCell><Badge color={r.http < 500 ? 'yellow' : 'red'}>{r.http}</Badge></TableCell>
                <TableCell className="text-sm text-gray-600">{r.meaning}</TableCell>
                <TableCell className="text-sm text-gray-600">{r.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
