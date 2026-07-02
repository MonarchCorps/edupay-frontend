import type { ReactNode } from 'react';
import type { Tone } from '../../utils/constants';

const TONE_STYLES: Record<Tone, string> = {
    gold: 'bg-accent-gold/15 text-[#8A6423] border-accent-gold/30',
    success: 'bg-success/15 text-success border-success/30',
    info: 'bg-[#3E7A8C]/15 text-[#3E7A8C] border-[#3E7A8C]/30',
    neutral: 'bg-teal-mid/10 text-teal-mid/70 border-teal-mid/20',
    error: 'bg-error/15 text-error border-error/30',
};

interface PillProps {
    tone: Tone;
    children: ReactNode;
    className?: string;
}

// Restrained, soft-tinted status pill — deliberately not Tremor's default
// saturated Badge colors, so status coloring reads as "designed" rather than
// "default library component."
export function Pill({ tone, children, className }: PillProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${TONE_STYLES[tone]} ${className ?? ''}`}
        >
            {children}
        </span>
    );
}
