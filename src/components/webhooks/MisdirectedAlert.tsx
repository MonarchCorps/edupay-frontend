import { Callout, Button } from '@tremor/react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Account, Transaction } from '../../types';

interface MisdirectedAlertProps {
    account: Account | null;
    transaction: Transaction | null;
    onAllocate?: (txn: Transaction) => void;
    onReturn?: (txn: Transaction) => void;
    className?: string;
}

export function MisdirectedAlert({
    account,
    transaction,
    onAllocate,
    onReturn,
    className,
}: MisdirectedAlertProps) {
    if (!account || !transaction) return null;

    return (
        <Callout
            className={className}
            title="Misdirected Payment Detected"
            icon={AlertTriangle}
            color="red"
        >
            <p className="text-sm mb-3">
                A payment of{' '}
                <strong>{formatCurrency(transaction.amount)}</strong> from{' '}
                <strong>{transaction.senderName}</strong> may have been sent to
                the wrong account (<strong>{account.customerName}</strong>).
            </p>
            <div className="flex gap-2 flex-wrap">
                <Button
                    size="xs"
                    className="btn-gold border-accent"
                    onClick={() => onAllocate?.(transaction)}
                >
                    Allocate to Customer
                </Button>
                <Button
                    size="xs"
                    variant="secondary"
                    color="red"
                    onClick={() => onReturn?.(transaction)}
                >
                    Initiate Return
                </Button>
            </div>
        </Callout>
    );
}
