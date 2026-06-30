import { clsx } from 'clsx';
import { Button } from '@tremor/react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={clsx(
                'flex flex-col items-center justify-center py-16 px-4 text-center',
                className,
            )}
        >
            {Icon && (
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <p className="text-base font-semibold text-gray-700 mb-1">
                {title}
            </p>
            {description && (
                <p className="text-sm text-gray-500 mb-4 max-w-xs">
                    {description}
                </p>
            )}
            {action && (
                <Button size="sm" color="sky" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
