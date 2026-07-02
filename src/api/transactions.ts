import { USE_MOCK } from '../utils/constants';
import { sleep } from '../utils/helpers';
import api from './axios';
import { mockTransactions } from './mock';
import { _applyResolvedMisdirectedMock } from './accounts';
import { getActiveMode } from '../utils/environment';
import type {
    Transaction,
    TransactionParams,
    PaginatedResponse,
} from '../types';

let _transactions: Transaction[] = [...mockTransactions];

export async function getTransactions(
    params: TransactionParams = {},
): Promise<PaginatedResponse<Transaction>> {
    if (USE_MOCK) {
        await sleep(400);
        let list = _transactions.filter(
            (t) => t.environment === getActiveMode(),
        );
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

// Mock-mode only: lets api/sandbox.ts add a simulated transaction without a
// backend.
export function _pushTransactionMock(txn: Transaction) {
    _transactions = [txn, ..._transactions];
}

export async function getTransaction(id: string): Promise<Transaction | null> {
    if (USE_MOCK) {
        await sleep(200);
        return _transactions.find((t) => t.id === id) ?? null;
    }
    const { data } = await api.get<Transaction>(`/transactions/${id}`);
    return data;
}

export interface ResolveTransactionResult {
    success: boolean;
    action: 'allocate' | 'return';
    transactionId: string;
}

export async function resolveTransaction(
    id: string,
    action: 'allocate' | 'return',
): Promise<ResolveTransactionResult> {
    if (USE_MOCK) {
        await sleep(400);
        const txn = _transactions.find((t) => t.id === id);
        if (!txn) throw new Error('Transaction not found');
        _transactions = _transactions.map((t) =>
            t.id === id
                ? { ...t, misdirected: false, matched: action === 'allocate' }
                : t,
        );
        _applyResolvedMisdirectedMock(txn.virtualAccountId, action, txn.amount);
        return { success: true, action, transactionId: id };
    }
    const { data } = await api.post<ResolveTransactionResult>(
        `/transactions/${id}/resolve`,
        { action },
    );
    return data;
}
