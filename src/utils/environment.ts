import type { Environment } from '../types';

const ACTIVE_MODE_KEY = 'edupay_active_mode';

// Which environment (sandbox/live) the dashboard is currently browsing.
// Independent of auth: the session token is mode-agnostic, so the active
// mode is sent as a query param on requests that need it (see api/axios.ts).

export function getActiveMode(): Environment {
    return localStorage.getItem(ACTIVE_MODE_KEY) === 'live' ? 'live' : 'sandbox';
}

export function setActiveMode(mode: Environment): void {
    localStorage.setItem(ACTIVE_MODE_KEY, mode);
}
