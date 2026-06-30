import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface WebhookPayloadViewerProps {
    payload: unknown;
    defaultOpen?: boolean;
    className?: string;
}

export function WebhookPayloadViewer({
    payload,
    defaultOpen = false,
    className,
}: WebhookPayloadViewerProps) {
    const [open, setOpen] = useState(defaultOpen);
    const { copy, copied } = useCopyToClipboard();
    const json = JSON.stringify(payload, null, 2);

    return (
        <div
            className={clsx(
                'rounded-tremor-default overflow-hidden border border-brand-dark/20',
                className,
            )}
        >
            <div
                className="flex items-center justify-between px-4 py-2 bg-brand-dark cursor-pointer select-none"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="text-brand-light text-sm font-mono font-medium">
                    Payload
                </span>
                <div className="flex items-center gap-2">
                    {open && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                copy(json);
                            }}
                            className="text-xs text-brand-light/70 hover:text-brand-light px-2 py-0.5 rounded border border-brand-light/20 hover:border-brand-light/50 transition-colors"
                            aria-label="Copy payload to clipboard"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                    <ChevronDown
                        className={clsx(
                            'w-4 h-4 text-brand-light transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                    />
                </div>
            </div>
            {open && (
                <pre className="m-0 p-4 bg-brand-dark text-brand-light font-mono text-[13px] leading-relaxed overflow-auto max-h-96">
                    {json}
                </pre>
            )}
        </div>
    );
}
