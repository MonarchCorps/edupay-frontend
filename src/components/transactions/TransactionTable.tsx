import { useState, type ReactNode } from 'react'
import {
  Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge,
} from '@tremor/react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { formatCurrency, formatDateTime, truncateString } from '../../utils/formatters'
import { TRANSACTION_DIRECTIONS, TRANSACTION_STATUSES } from '../../utils/constants'
import { clsx } from 'clsx'
import type { Transaction } from '../../types'

interface RowProps {
  label: string
  value?: ReactNode
  children?: ReactNode
}

function Row({ label, value, children }: RowProps) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900">{children ?? value}</span>
    </div>
  )
}

interface TransactionDetailModalProps {
  txn: Transaction | null
  onClose: () => void
}

function TransactionDetailModal({ txn, onClose }: TransactionDetailModalProps) {
  if (!txn) return null
  return (
    <Modal isOpen={!!txn} onClose={onClose} title="Transaction Detail" size="md">
      <div className="space-y-3 text-sm">
        <Row label="ID" value={<span className="font-mono text-xs">{txn.id}</span>} />
        <Row label="Direction">
          <Badge color={TRANSACTION_DIRECTIONS[txn.direction]?.tremorColour ?? 'gray'}>
            {txn.direction === 'credit' ? 'Credit' : 'Debit'}
          </Badge>
        </Row>
        <Row label="Amount" value={<span className="font-semibold">{formatCurrency(txn.amount)}</span>} />
        <Row label="Status">
          <Badge color={TRANSACTION_STATUSES[txn.status]?.tremorColour ?? 'gray'}>
            {TRANSACTION_STATUSES[txn.status]?.label ?? txn.status}
          </Badge>
        </Row>
        <Row label="Matched">
          <Badge color={txn.matched ? 'green' : 'yellow'}>{txn.matched ? 'Matched' : 'Unmatched'}</Badge>
        </Row>
        {txn.misdirected && (
          <Row label="Misdirected"><Badge color="red">Yes</Badge></Row>
        )}
        <Row label="Sender" value={txn.senderName} />
        <Row label="Sender Bank" value={txn.senderBank} />
        <Row label="Nomba Ref" value={<span className="font-mono text-xs">{txn.nombaRef}</span>} />
        <Row label="Date" value={formatDateTime(txn.createdAt)} />
      </div>
    </Modal>
  )
}

interface TransactionTableProps {
  transactions?: Transaction[]
  className?: string
}

export function TransactionTable({ transactions = [], className }: TransactionTableProps) {
  const [selected, setSelected] = useState<Transaction | null>(null)

  if (!transactions.length) {
    return (
      <EmptyState
        icon={ArrowDownLeft}
        title="No transactions found"
        description="No transactions match the current filters."
      />
    )
  }

  return (
    <>
      <div className={clsx('overflow-x-auto', className)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Sender</TableHeaderCell>
              <TableHeaderCell>Direction</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Matched</TableHeaderCell>
              <TableHeaderCell>Nomba Ref</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow
                key={txn.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelected(txn)}
              >
                <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                  {formatDateTime(txn.createdAt)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{txn.senderName}</p>
                    <p className="text-xs text-gray-400">{txn.senderBank}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {txn.direction === 'credit'
                      ? <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" />
                      : <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />}
                    <Badge color={TRANSACTION_DIRECTIONS[txn.direction]?.tremorColour}>
                      {TRANSACTION_DIRECTIONS[txn.direction]?.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {formatCurrency(txn.amount)}
                </TableCell>
                <TableCell>
                  <Badge color={TRANSACTION_STATUSES[txn.status]?.tremorColour ?? 'gray'}>
                    {TRANSACTION_STATUSES[txn.status]?.label ?? txn.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge color={txn.matched ? 'green' : 'yellow'}>
                    {txn.matched ? 'Matched' : 'Unmatched'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">
                    {truncateString(txn.nombaRef, 16)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TransactionDetailModal txn={selected} onClose={() => setSelected(null)} />
    </>
  )
}
