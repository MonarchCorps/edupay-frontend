import { USE_MOCK } from '../utils/constants';
import { sleep, generateId } from '../utils/helpers';
import api from './axios';
import type { ApiKey, Merchant } from '../types';

const STORAGE_KEY = 'edupay_api_key';
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

export function getStoredApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEY, key);
}

export function clearStoredApiKey(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export async function getMerchantByEmail(email: string): Promise<Merchant> {
    const { data } = await api.get<Merchant>('/auth/merchants/by-email', {
        params: { email },
    });
    return data;
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
    setStoredApiKey(data.key);
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

export async function generateApiKey(): Promise<ApiKey> {
    if (USE_MOCK) {
        await sleep(600);
        const raw = `sk_sandbox_${generateId().replace(/-/g, '').slice(0, 24)}`;
        const entry: ApiKey = {
            id: generateId(),
            key: raw,
            label: null,
            createdAt: new Date().toISOString(),
            lastUsed: null,
        };
        const keys = getMockKeys();
        saveMockKeys([entry, ...keys]);
        setStoredApiKey(raw);
        return entry;
    }
    const { data } = await api.post<ApiKey>('/auth/keys');
    setStoredApiKey(data.key);
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
