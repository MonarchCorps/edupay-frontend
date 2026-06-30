import { useMemo, useState } from 'react';
import { Card } from '@tremor/react';
import { PageHeader } from '../components/ui/PageHeader';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { useTransactions } from '../hooks/useTransactions';
import type { TransactionParams } from '../types';

export default function Transactions() {
    const [filters, setFilters] = useState<Partial<TransactionParams>>({});
    const { data, isLoading } = useTransactions(filters);
    const transactions = useMemo(() => data?.data ?? [], [data]);

    return (
        <div className="space-y-4">
            <PageHeader
                title="Transactions"
                subtitle="All inbound and outbound transfers across your virtual accounts"
            />
            <Card>
                <TransactionFilters onChange={setFilters} className="mb-4" />
                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-12 bg-gray-100 rounded animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <TransactionTable transactions={transactions} />
                )}
            </Card>
        </div>
    );
}
