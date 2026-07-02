import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getActiveMode, getStoredApiKey, clearStoredApiKey } from '../utils/environment';
import type { ApiError } from '../types';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const key = getStoredApiKey(getActiveMode());
    if (key) config.headers.Authorization = `Bearer ${key}`;
    return config;
});

// Unwrap the backend envelope: { success: true, data: ..., pagination?: {...} }
api.interceptors.response.use(
    (res: AxiosResponse) => {
        const body = res.data;
        if (body && typeof body === 'object' && body.success === true) {
            if (body.pagination) {
                // Paginated: reshape to { data: T[], total: number }
                res.data = { data: body.data, total: body.pagination.total };
            } else {
                // Single entity or array: unwrap to the inner data
                res.data = body.data;
            }
        }
        return res;
    },
    (
        err: AxiosError<{
            success?: boolean;
            error?: { code?: string; message?: string; details?: unknown };
        }>,
    ) => {
        if (err.response?.status === 401) {
            clearStoredApiKey(getActiveMode());
            window.location.href = '/settings';
        }
        const body = err.response?.data;
        // Backend wraps errors as { success: false, error: { code, message } }
        const errPayload =
            body?.error ?? (body as Record<string, unknown> | undefined);
        const rejection: ApiError = {
            code: (errPayload as { code?: string })?.code ?? 'UNKNOWN_ERROR',
            message:
                (errPayload as { message?: string })?.message ??
                err.message ??
                'Something went wrong. Please try again.',
            details: (errPayload as { details?: unknown })?.details ?? null,
        };
        return Promise.reject(rejection);
    },
);

export default api;
