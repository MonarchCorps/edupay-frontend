import { clsx } from 'clsx';
import { Pill } from '../ui/Pill';
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
        tone: 'neutral' as const,
    };
    return (
        <Pill tone={config.tone} className={clsx(className)}>
            {config.label}
        </Pill>
    );
}
