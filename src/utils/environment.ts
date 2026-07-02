import type { Environment } from '../types';

const ACTIVE_MODE_KEY = 'edupay_active_mode';
const KEY_STORAGE_PREFIX = 'edupay_api_key_';

// A merchant's API key is intrinsically sandbox or live (the backend attaches
// req.merchantMode from whichever key authenticates a request), so switching
// modes in the UI means switching *which stored key* gets sent as the Bearer
// token — not passing a mode flag alongside a single key.

export function getActiveMode(): Environment {
    return localStorage.getItem(ACTIVE_MODE_KEY) === 'live' ? 'live' : 'sandbox';
}

export function setActiveMode(mode: Environment): void {
    localStorage.setItem(ACTIVE_MODE_KEY, mode);
}

export function getStoredApiKey(mode: Environment): string | null {
    return localStorage.getItem(`${KEY_STORAGE_PREFIX}${mode}`);
}

export function setStoredApiKey(mode: Environment, key: string): void {
    localStorage.setItem(`${KEY_STORAGE_PREFIX}${mode}`, key);
}

export function clearStoredApiKey(mode: Environment): void {
    localStorage.removeItem(`${KEY_STORAGE_PREFIX}${mode}`);
}

export function detectModeFromKey(key: string): Environment {
    return key.startsWith('ep_live_') ? 'live' : 'sandbox';
}
