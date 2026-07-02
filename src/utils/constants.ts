import type { Color } from '@tremor/react';
import type {
    AccountStatus,
    KycTier,
    TransactionDirection,
    TransactionStatus,
    WebhookEventType,
} from '../types';

export const PAGE_SIZE = 20;

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK === 'true';

// Restrained semantic tones used by our custom badge components — distinct
// from Tremor's own `Color` enum, which only drives chart legends here.
export type Tone = 'gold' | 'success' | 'info' | 'neutral' | 'error';

export const ACCOUNT_STATUSES: Record<
    AccountStatus,
    { label: string; colour: string; tremorColour: Color; tone: Tone }
> = {
    pending: {
        label: 'Pending',
        colour: 'yellow',
        tremorColour: 'yellow',
        tone: 'gold',
    },
    active: {
        label: 'Active',
        colour: 'green',
        tremorColour: 'green',
        tone: 'success',
    },
    frozen: {
        label: 'Frozen',
        colour: 'blue',
        tremorColour: 'blue',
        tone: 'info',
    },
    closed: {
        label: 'Closed',
        colour: 'gray',
        tremorColour: 'gray',
        tone: 'neutral',
    },
    flagged: {
        label: 'Flagged',
        colour: 'red',
        tremorColour: 'red',
        tone: 'error',
    },
    resolved: {
        label: 'Resolved',
        colour: 'green',
        tremorColour: 'green',
        tone: 'neutral',
    },
};

export const TRANSACTION_DIRECTIONS: Record<
    TransactionDirection,
    { label: string; tremorColour: Color; tone: Tone }
> = {
    credit: { label: 'Credit', tremorColour: 'green', tone: 'success' },
    debit: { label: 'Debit', tremorColour: 'red', tone: 'error' },
};

export const TRANSACTION_STATUSES: Record<
    TransactionStatus,
    { label: string; tremorColour: Color; tone: Tone }
> = {
    success: { label: 'Success', tremorColour: 'green', tone: 'success' },
    failed: { label: 'Failed', tremorColour: 'red', tone: 'error' },
    pending: { label: 'Pending', tremorColour: 'yellow', tone: 'gold' },
};

export const KYC_TIERS: Record<KycTier, { label: string; limit: string }> = {
    tier1: { label: 'Tier 1', limit: '₦ 50,000' },
    tier2: { label: 'Tier 2', limit: '₦ 200,000' },
    tier3: { label: 'Tier 3', limit: 'Unlimited' },
};

export const WEBHOOK_EVENT_TYPES: WebhookEventType[] = [
    'transfer.credit',
    'transfer.debit',
    'account.kyc_update',
    'account.frozen',
    'account.closed',
];

export const NAV_ITEMS: Array<{
    label: string;
    path: string;
    icon: string;
    bottom?: boolean;
}> = [
    { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { label: 'Accounts', path: '/accounts', icon: 'Users' },
    { label: 'Transactions', path: '/transactions', icon: 'ArrowLeftRight' },
    { label: 'Webhook Events', path: '/webhooks', icon: 'Zap' },
    { label: 'API Docs', path: '/docs', icon: 'BookOpen' },
    { label: 'Settings', path: '/settings', icon: 'Settings', bottom: true },
];
