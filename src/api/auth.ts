import { USE_MOCK } from '../utils/constants';
import { sleep, generateId } from '../utils/helpers';
import api from './axios';
import { getActiveMode, setActiveMode } from '../utils/environment';
import { getSessionToken, setSessionToken, clearSessionToken } from '../utils/session';
import type { ApiKey, Environment, Merchant, SessionResponse } from '../types';

export {
    getActiveMode,
    setActiveMode,
    getSessionToken,
    setSessionToken,
    clearSessionToken,
};

const MOCK_KEYS_KEY = 'edupay_mock_keys';

function getMockKeys(): ApiKey[] {
    try {
        return JSON.parse(
            localStorage.getItem(MOCK_KEYS_KEY) || '[]',
        ) as ApiKey[];
    } catch {
        return [];
    }
}

function saveMockKeys(keys: ApiKey[]): void {
    localStorage.setItem(MOCK_KEYS_KEY, JSON.stringify(keys));
}

// Dashboard identity check for the currently signed-in session.
export async function getMe(): Promise<Merchant> {
    const { data } = await api.get<Merchant>('/auth/me');
    return data;
}

export async function login(
    email: string,
    password: string,
): Promise<SessionResponse> {
    const { data } = await api.post<SessionResponse>('/auth/login', {
        email,
        password,
    });
    return data;
}

export async function registerMerchant(
    name: string,
    email: string,
    password: string,
): Promise<Merchant> {
    const { data } = await api.post<Merchant>('/auth/merchants', {
        name,
        email,
        password,
    });
    return data;
}

// Mints the merchant's first API key right after registration. Not used for
// dashboard login — the raw key is only ever shown once, here, for the
// merchant to save for programmatic API access.
export async function bootstrapApiKey(merchantId: string): Promise<ApiKey> {
    const { data } = await api.post<ApiKey>(
        `/auth/merchants/${merchantId}/keys`,
        { label: 'Default key' },
    );
    return data;
}

export async function getApiKeys(): Promise<ApiKey[]> {
    if (USE_MOCK) {
        await sleep(300);
        return getMockKeys();
    }
    const { data } = await api.get<ApiKey[]>('/auth/keys');
    return data;
}

export async function generateApiKey(mode: Environment): Promise<ApiKey> {
    if (USE_MOCK) {
        await sleep(600);
        const raw = `ep_${mode}_${generateId().replace(/-/g, '').slice(0, 24)}`;
        const entry: ApiKey = {
            id: generateId(),
            key: raw,
            label: null,
            environment: mode,
            createdAt: new Date().toISOString(),
            lastUsed: null,
        };
        const keys = getMockKeys();
        saveMockKeys([entry, ...keys]);
        return entry;
    }
    const { data } = await api.post<ApiKey>('/auth/keys', { mode });
    return data;
}

export async function revokeApiKey(id: string): Promise<void> {
    if (USE_MOCK) {
        await sleep(400);
        const keys = getMockKeys().filter((k) => k.id !== id);
        saveMockKeys(keys);
        return;
    }
    await api.delete(`/auth/keys/${id}`);
}
