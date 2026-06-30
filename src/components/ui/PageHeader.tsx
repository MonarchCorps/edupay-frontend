import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    action,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={clsx(
                'flex items-center justify-between mb-6',
                className,
            )}
        >
            <div>
                <h1 className="text-2xl font-bold text-brand-dark leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
