import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Card, Metric, Text } from '@tremor/react';
import { AccountStatusBadge } from './AccountStatusBadge';
import {
    formatCurrency,
    formatAccountNumber,
    formatDateTime,
} from '../../utils/formatters';
import { KYC_TIERS } from '../../utils/constants';
import type { Account } from '../../types';

interface AccountDrawerProps {
    account: Account | null;
    onClose: () => void;
}

export function AccountDrawer({ account, onClose }: AccountDrawerProps) {
    if (!account) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={clsx(
                    'fixed right-0 top-0 h-full w-80 bg-white shadow-tremor-dropdown z-50',
                    'flex flex-col transition-transform duration-300',
                )}
                role="complementary"
                aria-label="Account details"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <span className="font-semibold text-brand-dark">
                        Account Details
                    </span>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close drawer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div>
                        <Text>Customer</Text>
                        <p className="font-semibold text-gray-900">
                            {account.customerName}
                        </p>
                    </div>
                    <div>
                        <Text>Account Number</Text>
                        <p className="font-mono font-semibold text-gray-900">
                            {formatAccountNumber(account.accountNumber)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <Text>Status</Text>
                            <AccountStatusBadge status={account.status} />
                        </div>
                        <div className="ml-4">
                            <Text>KYC Tier</Text>
                            <p className="font-medium text-gray-700">
                                {KYC_TIERS[account.kycTier]?.label}
                            </p>
                        </div>
                    </div>

                    <Card className="mt-2">
                        <Text>Balance</Text>
                        <Metric>{formatCurrency(account.balance)}</Metric>
                    </Card>

                    <div>
                        <Text>Nomba Reference</Text>
                        <p className="font-mono text-xs text-gray-600">
                            {account.nombaRef}
                        </p>
                    </div>
                    <div>
                        <Text>Created</Text>
                        <p className="text-sm text-gray-700">
                            {formatDateTime(account.createdAt)}
                        </p>
                    </div>
                    {account.lastCreditAt && (
                        <div>
                            <Text>Last Credit</Text>
                            <p className="text-sm text-gray-700">
                                {formatDateTime(account.lastCreditAt)}
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
