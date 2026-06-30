import { Badge } from '@tremor/react';
import { clsx } from 'clsx';
import { ACCOUNT_STATUSES } from '../../utils/constants';
import type { AccountStatus } from '../../types';

interface AccountStatusBadgeProps {
    status: AccountStatus | string;
    className?: string;
}

export function AccountStatusBadge({
    status,
    className,
}: AccountStatusBadgeProps) {
    const config = ACCOUNT_STATUSES[status as AccountStatus] ?? {
        label: status,
        tremorColour: 'gray' as const,
    };
    return (
        <Badge color={config.tremorColour} className={clsx(className)}>
            {config.label}
        </Badge>
    );
}
