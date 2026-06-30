import { useNavigate } from 'react-router-dom'
import {
  Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell,
  Button,
} from '@tremor/react'
import { Copy, Check, Eye, SnowflakeIcon, Flame, XCircle } from 'lucide-react'
import { AccountStatusBadge } from './AccountStatusBadge'
import { EmptyState } from '../ui/EmptyState'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { formatCurrency, formatRelativeTime, formatAccountNumber } from '../../utils/formatters'
import { KYC_TIERS } from '../../utils/constants'
import { clsx } from 'clsx'
import type { Account } from '../../types'

interface CopyCellProps {
  value: string
}

function CopyCell({ value }: CopyCellProps) {
  const { copy, copied } = useCopyToClipboard()
  return (
    <span className="group flex items-center gap-1 font-mono text-sm">
      {formatAccountNumber(value)}
      <button
        onClick={(e) => { e.stopPropagation(); copy(value) }}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-mid transition-opacity"
        aria-label="Copy account number"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </span>
  )
}

interface AccountTableProps {
  accounts?: Account[]
  onFreeze?: (id: string) => void
  onUnfreeze?: (id: string) => void
  onClose?: (acc: Account) => void
  showActions?: boolean
  className?: string
}

export function AccountTable({
  accounts = [],
  onFreeze,
  onUnfreeze,
  onClose,
  showActions = true,
  className,
}: AccountTableProps) {
  const navigate = useNavigate()

  if (!accounts.length) {
    return (
      <EmptyState
        icon={Eye}
        title="No accounts found"
        description="No accounts match your current filters."
      />
    )
  }

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Account Number</TableHeaderCell>
            <TableHeaderCell>Bank</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>KYC Tier</TableHeaderCell>
            <TableHeaderCell>Balance</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            {showActions && <TableHeaderCell>Actions</TableHeaderCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((acc) => (
            <TableRow
              key={acc.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/accounts/${acc.id}`)}
            >
              <TableCell><CopyCell value={acc.accountNumber} /></TableCell>
              <TableCell className="text-sm text-gray-500">{acc.bankName || '—'}</TableCell>
              <TableCell className="font-medium text-gray-900">{acc.customerName}</TableCell>
              <TableCell><AccountStatusBadge status={acc.status} /></TableCell>
              <TableCell className="text-gray-600">{KYC_TIERS[acc.kycTier]?.label ?? acc.kycTier}</TableCell>
              <TableCell className="font-medium">{formatCurrency(acc.balance)}</TableCell>
              <TableCell className="text-gray-500 text-sm">{formatRelativeTime(acc.createdAt)}</TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button size="xs" variant="secondary" onClick={() => navigate(`/accounts/${acc.id}`)} aria-label="View account">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {acc.status === 'frozen' ? (
                      <Button
                        size="xs"
                        variant="secondary"
                        color="green"
                        onClick={() => onUnfreeze?.(acc.id)}
                        aria-label="Unfreeze account"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </Button>
                    ) : acc.status === 'active' ? (
                      <Button
                        size="xs"
                        variant="secondary"
                        color="blue"
                        onClick={() => onFreeze?.(acc.id)}
                        aria-label="Freeze account"
                      >
                        <SnowflakeIcon className="w-3.5 h-3.5" />
                      </Button>
                    ) : null}
                    {acc.status !== 'closed' && (
                      <Button
                        size="xs"
                        variant="secondary"
                        color="red"
                        onClick={() => onClose?.(acc)}
                        aria-label="Close account"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
