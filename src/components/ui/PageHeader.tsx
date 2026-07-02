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
                <h1 className="text-[28px] font-bold text-brand-dark leading-tight tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-teal-mid/60 mt-1">{subtitle}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
