import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface AccountCardProps {
    accountNumber: string;
    bankName?: string;
    customerName?: string;
    size?: 'md' | 'lg';
    className?: string;
}

// Groups digits like a bank card number: "0031234567" -> "0031 2345 67".
function groupInFours(value: string): string {
    return value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

const SIZE_STYLES = {
    md: {
        pad: 'p-4',
        chip: 'w-6 h-4 mb-3',
        number: 'text-lg',
        label: 'text-[10px]',
        width: 'max-w-[300px]',
    },
    lg: {
        pad: 'p-6',
        chip: 'w-8 h-5 mb-5',
        number: 'text-2xl',
        label: 'text-xs',
        width: 'max-w-[380px]',
    },
};

// The one signature "bank card" moment for the product — a virtual account
// rendered like a physical card. Use sparingly (account hero contexts only),
// not as a general-purpose account number display.
export function AccountCard({
    accountNumber,
    bankName,
    customerName,
    size = 'lg',
    className,
}: AccountCardProps) {
    const { copy, copied } = useCopyToClipboard();
    const s = SIZE_STYLES[size];

    return (
        <div
            className={`relative w-full ${s.width} rounded-xl bg-teal-mid text-paper shadow-tremor-card border border-white/5 ${s.pad} ${className ?? ''}`}
        >
            <div
                className={`rounded-[3px] bg-accent-gold/80 ${s.chip}`}
                aria-hidden="true"
            />

            <button
                type="button"
                onClick={() => copy(accountNumber)}
                className="group flex items-center gap-2 font-medium tracking-[0.08em] hover:text-accent-gold transition-colors focus-visible:ring-2 focus-visible:ring-accent-gold rounded-sm"
                aria-label="Copy account number"
            >
                <span className={`mono-value ${s.number}`}>
                    {groupInFours(accountNumber)}
                </span>
                {copied ? (
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                ) : (
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-70 flex-shrink-0 transition-opacity" />
                )}
            </button>

            {(bankName || customerName) && (
                <div className="flex items-end justify-between mt-5 gap-3">
                    {bankName && (
                        <span
                            className={`uppercase tracking-widest text-paper/60 font-medium ${s.label}`}
                        >
                            {bankName}
                        </span>
                    )}
                    {customerName && (
                        <span className="text-paper/85 font-medium text-sm truncate">
                            {customerName}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
