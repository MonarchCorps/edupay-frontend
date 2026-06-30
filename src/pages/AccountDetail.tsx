import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, Metric, Text, Badge, TabGroup, TabList, Tab, TabPanels, TabPanel,
  Callout, Button, Flex, Title,
  Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
  List, ListItem, TextInput,
} from '@tremor/react'
import { Copy, Check, AlertTriangle, ArrowLeft, Share2 } from 'lucide-react'
import { AccountStatusBadge } from '../components/accounts/AccountStatusBadge'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable'
import { MisdirectedAlert } from '../components/webhooks/MisdirectedAlert'
import { Modal } from '../components/ui/Modal'
import { useAccount, useAccountStatement, useCloseAccount, useRenameAccount, useUnfreezeAccount, useFreezeAccount } from '../hooks/useAccounts'
import { useTransactions } from '../hooks/useTransactions'
import { useWebhookEvents } from '../hooks/useWebhooks'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { formatCurrency, formatAccountNumber, formatDateTime, formatRelativeTime } from '../utils/formatters'
import { KYC_TIERS } from '../utils/constants'
import { useToast } from '../hooks/useToast'

interface StatementTabProps {
  accountId: string | undefined
}

function StatementTab({ accountId }: StatementTabProps) {
  const { data, isLoading } = useAccountStatement(accountId)
  const rows = data ?? []
  if (isLoading) return <div className="h-32 bg-gray-100 animate-pulse rounded" />
  if (!rows.length) return <Text>No statement entries.</Text>
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Description</TableHeaderCell>
          <TableHeaderCell>Direction</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
          <TableHeaderCell>Running Balance</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="text-sm text-gray-500 whitespace-nowrap">{formatDateTime(r.createdAt)}</TableCell>
            <TableCell className="text-sm">{r.senderName}</TableCell>
            <TableCell>
              <Badge color={r.direction === 'credit' ? 'green' : 'red'}>
                {r.direction === 'credit' ? 'Credit' : 'Debit'}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{formatCurrency(r.amount)}</TableCell>
            <TableCell className="font-semibold">{formatCurrency(r.runningBalance ?? 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: account, isLoading } = useAccount(id)
  const { data: txnsData } = useTransactions({ virtualAccountId: id })
  const { data: webhooksData } = useWebhookEvents({ virtualAccountId: id })
  const { copy, copied } = useCopyToClipboard()
  const rename = useRenameAccount()
  const close = useCloseAccount()
  const freeze = useFreezeAccount()
  const unfreeze = useUnfreezeAccount()
  const { toast } = useToast()

  const [closeOpen, setCloseOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const { copy: copyShare, copied: sharedCopied } = useCopyToClipboard()

  const transactions = txnsData?.data ?? []
  const webhooks = webhooksData?.data ?? []
  const misdirected = transactions.find((t) => t.misdirected)

  if (isLoading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-tremor-default" />
  }
  if (!account) {
    return (
      <div className="text-center py-16">
        <Text>Account not found.</Text>
        <Button onClick={() => navigate('/accounts')} className="mt-4" variant="secondary">
          Back to Accounts
        </Button>
      </div>
    )
  }

  const historyWithDates = [
    { status: 'pending',      date: account.createdAt, reason: 'Account provisioned' },
    { status: account.status, date: account.createdAt, reason: `Status: ${account.status}` },
  ]

  return (
    <div className="space-y-5">
      <Button
        variant="secondary"
        size="xs"
        icon={ArrowLeft}
        onClick={() => navigate('/accounts')}
      >
        Back to Accounts
      </Button>

      {misdirected && (
        <MisdirectedAlert
          account={account}
          transaction={misdirected}
          onAllocate={() => toast({ type: 'success', message: 'Payment allocated to customer' })}
          onReturn={() => toast({ type: 'info', message: 'Return initiated' })}
        />
      )}

      <Card>
        <Flex className="items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <Flex className="items-center gap-2 mb-1">
              <span className="font-mono text-2xl font-bold text-brand-dark">
                {formatAccountNumber(account.accountNumber)}
              </span>
              <button
                onClick={() => copy(account.accountNumber)}
                className="text-gray-400 hover:text-brand-mid"
                aria-label="Copy account number"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </Flex>
            {account.bankName && (
              <Text className="text-sm text-gray-500 mt-0.5">{account.bankName}</Text>
            )}
            <Title className="mt-1">{account.customerName}</Title>
            <Text className="text-xs mt-1 text-gray-400">ID: {account.customerId}</Text>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <AccountStatusBadge status={account.status} />
            <Badge color="sky">{KYC_TIERS[account.kycTier]?.label}</Badge>
            <Text className="text-xs text-gray-400">Created {formatRelativeTime(account.createdAt)}</Text>
            <button
              onClick={() => copyShare(`Account: ${account.accountNumber} | Bank: ${account.bankName} | Name: ${account.customerName}`)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-mid px-2 py-1 border border-gray-200 rounded-tremor-small transition-colors"
              aria-label="Share payment details"
            >
              {sharedCopied
                ? <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600">Copied!</span></>
                : <><Share2 className="w-3.5 h-3.5" /><span>Share details</span></>}
            </button>
          </div>
        </Flex>

        {account.status === 'flagged' && (
          <Callout title="This account is flagged" icon={AlertTriangle} color="red" className="mt-4">
            This account has been flagged for suspicious activity. Review the transaction history below.
          </Callout>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Text>Balance</Text>
          <Metric>{formatCurrency(account.balance)}</Metric>
          {account.lastCreditAt && (
            <Text className="text-xs mt-1">Last credit {formatRelativeTime(account.lastCreditAt)}</Text>
          )}
        </Card>
        <Card>
          <Text>Transactions</Text>
          <Metric>{transactions.length}</Metric>
        </Card>
        <Card>
          <Text>Webhook Events</Text>
          <Metric>{webhooks.length}</Metric>
        </Card>
      </div>

      <TabGroup>
        <TabList>
          <Tab>Statement</Tab>
          <Tab>Transactions</Tab>
          <Tab>Webhook Events</Tab>
          <Tab>History</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="mt-4"><StatementTab accountId={id} /></Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-4">
              <TransactionTable transactions={transactions} />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-4">
              <WebhookEventTable events={webhooks} />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-4">
              <List>
                {historyWithDates.map((h, i) => (
                  <ListItem key={i}>
                    <span className="font-medium">{h.reason}</span>
                    <span className="text-gray-400 text-sm">{formatDateTime(h.date)}</span>
                  </ListItem>
                ))}
              </List>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <Card className="border-2 border-red-100">
        <Title className="text-red-700 mb-4">Danger Zone</Title>
        <div className="space-y-4">
          <div>
            <Text className="mb-2 font-medium">Rename Account</Text>
            <Flex className="gap-2 max-w-sm">
              <TextInput
                placeholder="New customer name"
                value={newName}
                onValueChange={setNewName}
              />
              <Button
                size="sm"
                loading={rename.isPending}
                onClick={() => {
                  if (newName.trim() && id) rename.mutate({ id, name: newName.trim() })
                }}
                disabled={!newName.trim()}
              >
                Save
              </Button>
            </Flex>
          </div>

          <div className="flex gap-3 flex-wrap">
            {account.status === 'active' && (
              <Button
                size="sm"
                variant="secondary"
                color="blue"
                loading={freeze.isPending}
                onClick={() => id && freeze.mutate(id)}
              >
                Freeze Account
              </Button>
            )}
            {account.status === 'frozen' && (
              <Button
                size="sm"
                variant="secondary"
                color="green"
                loading={unfreeze.isPending}
                onClick={() => id && unfreeze.mutate(id)}
              >
                Unfreeze Account
              </Button>
            )}
            {account.status !== 'closed' && (
              <Button
                size="sm"
                color="red"
                onClick={() => setCloseOpen(true)}
              >
                Close Account
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={closeOpen}
        onClose={() => setCloseOpen(false)}
        title="Close Account"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCloseOpen(false)}>Cancel</Button>
            <Button
              color="red"
              loading={close.isPending}
              onClick={async () => {
                if (id) await close.mutateAsync(id)
                setCloseOpen(false)
                navigate('/accounts')
              }}
            >
              Confirm Close
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Closing this account will sweep the remaining balance and disable all future
          inbound transfers. This action <strong>cannot be undone</strong>.
        </p>
      </Modal>
    </div>
  )
}
