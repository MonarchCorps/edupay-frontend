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
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-teal-mid/5 border border-teal-mid/10">
                    <Icon className="w-7 h-7 text-teal-mid/40" />
                </div>
            )}
            <p className="text-base font-semibold text-brand-dark mb-1">
                {title}
            </p>
            {description && (
                <p className="text-sm text-teal-mid/55 mb-4 max-w-xs">
                    {description}
                </p>
            )}
            {action && (
                <Button
                    size="sm"
                    className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
