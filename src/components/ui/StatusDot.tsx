import { clsx } from 'clsx';
import { ACCOUNT_STATUSES } from '../../utils/constants';
import type { AccountStatus } from '../../types';

const COLOUR_MAP: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
    gray: 'bg-gray-400',
    red: 'bg-red-500',
};

interface StatusDotProps {
    status: AccountStatus | string;
    className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
    const colour = ACCOUNT_STATUSES[status as AccountStatus]?.colour ?? 'gray';
    return (
        <span
            className={clsx(
                'inline-flex w-2 h-2 rounded-full flex-shrink-0',
                COLOUR_MAP[colour],
                className,
            )}
            aria-hidden="true"
        />
    );
}
