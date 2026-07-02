import { useState, type ReactNode } from 'react';
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from '@tremor/react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { Pill } from '../ui/Pill';
import {
    formatCurrency,
    formatDateTime,
    truncateString,
} from '../../utils/formatters';
import {
    TRANSACTION_DIRECTIONS,
    TRANSACTION_STATUSES,
} from '../../utils/constants';
import { clsx } from 'clsx';
import type { Transaction } from '../../types';

interface RowProps {
    label: string;
    value?: ReactNode;
    children?: ReactNode;
}

function Row({ label, value, children }: RowProps) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-teal-mid/8 last:border-0">
            <span className="text-teal-mid/55 font-medium">{label}</span>
            <span className="text-brand-dark">{children ?? value}</span>
        </div>
    );
}

interface TransactionDetailModalProps {
    txn: Transaction | null;
    onClose: () => void;
}

function TransactionDetailModal({ txn, onClose }: TransactionDetailModalProps) {
    if (!txn) return null;
    return (
        <Modal
            isOpen={!!txn}
            onClose={onClose}
            title="Transaction Detail"
            size="md"
        >
            <div className="space-y-3 text-sm">
                <Row
                    label="ID"
                    value={<span className="mono-value text-xs">{txn.id}</span>}
                />
                <Row label="Direction">
                    <Pill tone={TRANSACTION_DIRECTIONS[txn.direction]?.tone ?? 'neutral'}>
                        {txn.direction === 'credit' ? 'Credit' : 'Debit'}
                    </Pill>
                </Row>
                <Row
                    label="Amount"
                    value={
                        <span
                            className={clsx(
                                'mono-value font-semibold',
                                txn.direction === 'credit'
                                    ? 'text-success'
                                    : 'text-error',
                            )}
                        >
                            {txn.direction === 'credit' ? '+' : '−'}
                            {formatCurrency(txn.amount)}
                        </span>
                    }
                />
                <Row label="Status">
                    <Pill tone={TRANSACTION_STATUSES[txn.status]?.tone ?? 'neutral'}>
                        {TRANSACTION_STATUSES[txn.status]?.label ?? txn.status}
                    </Pill>
                </Row>
                <Row label="Matched">
                    <Pill tone={txn.matched ? 'success' : 'gold'}>
                        {txn.matched ? 'Matched' : 'Unmatched'}
                    </Pill>
                </Row>
                {txn.misdirected && (
                    <Row label="Misdirected">
                        <Pill tone="error">Yes</Pill>
                    </Row>
                )}
                <Row label="Sender" value={txn.senderName} />
                <Row label="Sender Bank" value={txn.senderBank} />
                <Row
                    label="Nomba Ref"
                    value={
                        <span className="mono-value text-xs">
                            {txn.nombaRef}
                        </span>
                    }
                />
                <Row label="Date" value={formatDateTime(txn.createdAt)} />
            </div>
        </Modal>
    );
}

interface TransactionTableProps {
    transactions?: Transaction[];
    className?: string;
}

const HEAD_CELL = 'py-3 text-xs uppercase tracking-wide text-teal-mid/50';
const BODY_CELL = 'py-3.5';

export function TransactionTable({
    transactions = [],
    className,
}: TransactionTableProps) {
    const [selected, setSelected] = useState<Transaction | null>(null);

    if (!transactions.length) {
        return (
            <EmptyState
                icon={ArrowDownLeft}
                title="No transactions found"
                description="No transactions match the current filters."
            />
        );
    }

    return (
        <>
            <div className={clsx('overflow-x-auto', className)}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell className={HEAD_CELL}>
                                Date
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Sender
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Direction
                            </TableHeaderCell>
                            <TableHeaderCell className={clsx(HEAD_CELL, 'text-right')}>
                                Amount
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Status
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Matched
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Nomba Ref
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow
                                key={txn.id}
                                className="cursor-pointer hover:bg-teal-mid/5 transition-colors"
                                onClick={() => setSelected(txn)}
                            >
                                <TableCell
                                    className={clsx(
                                        BODY_CELL,
                                        'text-teal-mid/50 text-sm whitespace-nowrap',
                                    )}
                                >
                                    {formatDateTime(txn.createdAt)}
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <div>
                                        <p className="font-medium text-brand-dark text-sm">
                                            {txn.senderName}
                                        </p>
                                        <p className="text-xs text-teal-mid/45">
                                            {txn.senderBank}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <div className="flex items-center gap-1.5">
                                        {txn.direction === 'credit' ? (
                                            <ArrowDownLeft className="w-3.5 h-3.5 text-success" />
                                        ) : (
                                            <ArrowUpRight className="w-3.5 h-3.5 text-error" />
                                        )}
                                        <Pill
                                            tone={
                                                TRANSACTION_DIRECTIONS[txn.direction]
                                                    ?.tone ?? 'neutral'
                                            }
                                        >
                                            {
                                                TRANSACTION_DIRECTIONS[
                                                    txn.direction
                                                ]?.label
                                            }
                                        </Pill>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={clsx(
                                        BODY_CELL,
                                        'mono-value font-semibold text-right',
                                        txn.direction === 'credit'
                                            ? 'text-success'
                                            : 'text-error',
                                    )}
                                >
                                    {txn.direction === 'credit' ? '+' : '−'}
                                    {formatCurrency(txn.amount)}
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <Pill
                                        tone={
                                            TRANSACTION_STATUSES[txn.status]
                                                ?.tone ?? 'neutral'
                                        }
                                    >
                                        {TRANSACTION_STATUSES[txn.status]
                                            ?.label ?? txn.status}
                                    </Pill>
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <Pill tone={txn.matched ? 'success' : 'gold'}>
                                        {txn.matched ? 'Matched' : 'Unmatched'}
                                    </Pill>
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <span className="mono-value text-xs text-teal-mid/50">
                                        {truncateString(txn.nombaRef, 16)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TransactionDetailModal
                txn={selected}
                onClose={() => setSelected(null)}
            />
        </>
    );
}
