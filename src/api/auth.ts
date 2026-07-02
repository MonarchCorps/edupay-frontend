import axios from 'axios';
import { API_BASE_URL, USE_MOCK } from '../utils/constants';
import { sleep, generateId } from '../utils/helpers';
import api from './axios';
import {
    getActiveMode,
    setActiveMode,
    getStoredApiKey,
    setStoredApiKey,
    clearStoredApiKey,
    detectModeFromKey,
} from '../utils/environment';
import type { ApiError, ApiKey, Environment, Merchant } from '../types';

export {
    getActiveMode,
    setActiveMode,
    getStoredApiKey,
    setStoredApiKey,
    clearStoredApiKey,
    detectModeFromKey,
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

// Verifies an API key the user typed in on the sign-in form. Deliberately
// bypasses the shared `api` instance: its interceptor would overwrite this
// header with whatever (possibly stale/invalid) key is already in
// localStorage, and would redirect to /settings on a 401 — wrong behavior
// for "the key the user just typed didn't work, show an inline error."
export async function getMe(apiKey: string): Promise<Merchant> {
    try {
        const res = await axios.get<{ success: boolean; data: Merchant }>(
            `${API_BASE_URL}/auth/me`,
            { headers: { Authorization: `Bearer ${apiKey}` } },
        );
        return res.data.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const body = err.response?.data as
                | {
                      error?: {
                          code?: string;
                          message?: string;
                          details?: unknown;
                      };
                  }
                | undefined;
            const apiError: ApiError = {
                code: body?.error?.code ?? 'UNKNOWN_ERROR',
                message: body?.error?.message ?? 'Invalid API key',
                details: body?.error?.details ?? null,
            };
            throw apiError;
        }
        throw err;
    }
}

export async function registerMerchant(
    name: string,
    email: string,
): Promise<Merchant> {
    const { data } = await api.post<Merchant>('/auth/merchants', {
        name,
        email,
    });
    return data;
}

export async function bootstrapApiKey(merchantId: string): Promise<ApiKey> {
    const { data } = await api.post<ApiKey>(
        `/auth/merchants/${merchantId}/keys`,
        { label: 'Default key' },
    );
    // Bootstrap always mints a sandbox key server-side.
    setStoredApiKey('sandbox', data.key);
    setActiveMode('sandbox');
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
        setStoredApiKey(mode, raw);
        return entry;
    }
    const { data } = await api.post<ApiKey>('/auth/keys', { mode });
    setStoredApiKey(mode, data.key);
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
