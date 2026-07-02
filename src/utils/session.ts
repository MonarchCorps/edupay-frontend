// Dashboard login session token (JWT) — separate from API keys, which are
// now purely for programmatic third-party access and are never persisted
// client-side beyond the moment they're shown to the user.

const SESSION_TOKEN_KEY = 'edupay_session_token';

export function getSessionToken(): string | null {
    return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSessionToken(): void {
    localStorage.removeItem(SESSION_TOKEN_KEY);
}
