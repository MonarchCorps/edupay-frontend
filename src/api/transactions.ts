import { USE_MOCK } from '../utils/constants';
import { sleep } from '../utils/helpers';
import api from './axios';
import { mockTransactions } from './mock';
import type {
    Transaction,
    TransactionParams,
    PaginatedResponse,
} from '../types';

export async function getTransactions(
    params: TransactionParams = {},
): Promise<PaginatedResponse<Transaction>> {
    if (USE_MOCK) {
        await sleep(400);
        let list = [...mockTransactions];
        if (params.virtualAccountId)
            list = list.filter(
                (t) => t.virtualAccountId === params.virtualAccountId,
            );
        if (params.direction)
            list = list.filter((t) => t.direction === params.direction);
        if (params.status)
            list = list.filter((t) => t.status === params.status);
        if (params.matched !== undefined)
            list = list.filter((t) => t.matched === params.matched);
        if (params.from)
            list = list.filter(
                (t) => new Date(t.createdAt) >= new Date(params.from!),
            );
        if (params.to)
            list = list.filter(
                (t) => new Date(t.createdAt) <= new Date(params.to!),
            );
        return { data: list, total: list.length };
    }
    const { data } = await api.get<PaginatedResponse<Transaction>>(
        '/transactions',
        { params },
    );
    return data;
}

export async function getTransaction(id: string): Promise<Transaction | null> {
    if (USE_MOCK) {
        await sleep(200);
        return mockTransactions.find((t) => t.id === id) ?? null;
    }
    const { data } = await api.get<Transaction>(`/transactions/${id}`);
    return data;
}
