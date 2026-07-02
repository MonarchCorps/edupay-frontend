import { AlertTriangle, ArrowRightLeft, Undo2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Account, Transaction } from '../../types';

interface MisdirectedAlertProps {
    account: Account | null;
    transaction: Transaction | null;
    onAllocate?: (txn: Transaction) => void;
    onReturn?: (txn: Transaction) => void;
    className?: string;
}

// Purpose-built alert, not Tremor's generic Callout — this is the core
// misdirected-payment review moment, so it needs to read as a deliberate
// decision point rather than a stock warning box.
export function MisdirectedAlert({
    account,
    transaction,
    onAllocate,
    onReturn,
    className,
}: MisdirectedAlertProps) {
    if (!account || !transaction) return null;

    return (
        <div
            className={`relative rounded-tremor-default border border-error/25 bg-error/[0.06] pl-6 pr-5 py-5 overflow-hidden ${className ?? ''}`}
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-error"
                aria-hidden="true"
            />
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-error/15 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5 text-error" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark">
                        Misdirected Payment Detected
                    </p>
                    <p className="text-sm text-teal-mid/75 mt-1 leading-relaxed">
                        A payment of{' '}
                        <span className="mono-value font-semibold text-brand-dark">
                            {formatCurrency(transaction.amount)}
                        </span>{' '}
                        from{' '}
                        <strong className="text-brand-dark">
                            {transaction.senderName}
                        </strong>{' '}
                        may have been sent to the wrong account (
                        <strong className="text-brand-dark">
                            {account.customerName}
                        </strong>
                        ).
                    </p>
                    <div className="flex gap-2 flex-wrap mt-4">
                        <button
                            type="button"
                            onClick={() => onAllocate?.(transaction)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-tremor-small text-xs font-semibold bg-accent-gold hover:bg-accent-gold/90 text-brand-dark transition-colors focus-visible:ring-2 focus-visible:ring-accent-gold"
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Allocate to Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => onReturn?.(transaction)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-tremor-small text-xs font-semibold border border-error/40 text-error hover:bg-error/10 transition-colors focus-visible:ring-2 focus-visible:ring-error"
                        >
                            <Undo2 className="w-3.5 h-3.5" />
                            Initiate Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
