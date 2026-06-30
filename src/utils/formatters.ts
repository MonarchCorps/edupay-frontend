import { format, formatDistanceToNow } from 'date-fns';

export function formatCurrency(amount: number, currency = 'NGN'): string {
    const value = typeof amount === 'number' ? amount / 100 : 0;
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(value);
}

export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '—';
    return format(new Date(dateString), 'd MMM yyyy');
}

export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '—';
    return format(new Date(dateString), 'd MMM yyyy, HH:mm');
}

export function formatRelativeTime(
    dateString: string | null | undefined,
): string {
    if (!dateString) return '—';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function truncateString(
    str: string | null | undefined,
    maxLength = 30,
): string {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
}

export function maskApiKey(key: string | null | undefined): string {
    if (!key || key.length < 8) return '••••••••';
    const prefix = key.slice(0, key.lastIndexOf('_') + 1);
    const last4 = key.slice(-4);
    return `${prefix}••••••••${last4}`;
}

export function formatAccountNumber(
    number: string | number | null | undefined,
): string {
    if (!number) return '';
    const n = String(number).replace(/\s/g, '');
    return n.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
