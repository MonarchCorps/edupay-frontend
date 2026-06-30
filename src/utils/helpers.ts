import { ACCOUNT_STATUSES } from './constants';
import type { AccountStatus } from '../types';

export function getStatusColour(status: AccountStatus | string): string {
    return ACCOUNT_STATUSES[status as AccountStatus]?.colour ?? 'gray';
}

export function getStatusLabel(status: AccountStatus | string): string {
    return ACCOUNT_STATUSES[status as AccountStatus]?.label ?? status;
}

export function buildQueryString(params: Record<string, unknown>): string {
    const filtered = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== '',
    );
    return new URLSearchParams(
        Object.fromEntries(filtered.map(([k, v]) => [k, String(v)])),
    ).toString();
}

export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export function generateId(): string {
    return crypto.randomUUID();
}
