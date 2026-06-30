import { useCallback, useState } from 'react';
import {
    Flex,
    Select,
    SelectItem,
    DateRangePicker,
    type DateRangePickerValue,
} from '@tremor/react';
import {
    TRANSACTION_DIRECTIONS,
    TRANSACTION_STATUSES,
} from '../../utils/constants';
import type { TransactionParams } from '../../types';

interface TransactionFiltersProps {
    onChange?: (params: Partial<TransactionParams>) => void;
    className?: string;
}

export function TransactionFilters({
    onChange,
    className,
}: TransactionFiltersProps) {
    const [direction, setDirection] = useState('');
    const [status, setStatus] = useState('');
    const [dateRange, setDateRange] = useState<DateRangePickerValue>({});

    const notify = useCallback(
        (
            update: Partial<{
                direction: string;
                status: string;
                from?: Date;
                to?: Date;
            }>,
        ) => {
            const next = { direction, status, ...dateRange, ...update };
            onChange?.({
                ...(next.direction && {
                    direction: next.direction as TransactionParams['direction'],
                }),
                ...(next.status && {
                    status: next.status as TransactionParams['status'],
                }),
                ...(next.from && { from: next.from.toISOString() }),
                ...(next.to && { to: next.to.toISOString() }),
            });
        },
        [direction, status, dateRange, onChange],
    );

    return (
        <Flex className={`gap-3 flex-wrap ${className ?? ''}`}>
            <DateRangePicker
                className="max-w-xs"
                placeholder="Date range"
                value={dateRange}
                onValueChange={(v) => {
                    setDateRange(v);
                    notify({ from: v.from, to: v.to });
                }}
            />
            <Select
                className="max-w-[160px]"
                placeholder="Direction"
                value={direction}
                onValueChange={(v) => {
                    setDirection(v);
                    notify({ direction: v });
                }}
            >
                <SelectItem value="">All directions</SelectItem>
                {Object.entries(TRANSACTION_DIRECTIONS).map(
                    ([k, { label }]) => (
                        <SelectItem key={k} value={k}>
                            {label}
                        </SelectItem>
                    ),
                )}
            </Select>
            <Select
                className="max-w-[160px]"
                placeholder="Status"
                value={status}
                onValueChange={(v) => {
                    setStatus(v);
                    notify({ status: v });
                }}
            >
                <SelectItem value="">All statuses</SelectItem>
                {Object.entries(TRANSACTION_STATUSES).map(([k, { label }]) => (
                    <SelectItem key={k} value={k}>
                        {label}
                    </SelectItem>
                ))}
            </Select>
        </Flex>
    );
}
