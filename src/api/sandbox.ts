import { USE_MOCK } from '../utils/constants';
import { sleep, generateId } from '../utils/helpers';
import api from './axios';
import { _getAccountMock, _flagAccountMock, _creditAccountMock } from './accounts';
import { _pushTransactionMock } from './transactions';
import type { Transaction } from '../types';

export interface SimulateWebhookPayload {
    accountId: string;
    amount: number;
    senderName: string;
}

export interface SimulateWebhookResult {
    requestId: string;
    transactionId: string;
    accountRef: string;
    webhookEventId: string | null;
    processed: boolean;
    error: string | null;
    matched: boolean | null;
    misdirected: boolean | null;
}

// Same loose token-overlap comparison reconciliation.js uses server-side —
// duplicated here only so mock mode (no backend at all) can preview the
// same matched/misdirected outcome a real simulate call would produce.
function namesLikelyMatch(senderName: string, accountHolderName: string): boolean {
    const normalize = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    const senderTokens = normalize(senderName);
    const accountTokens = normalize(accountHolderName);
    if (!senderTokens.length || !accountTokens.length) return true;
    const accountSet = new Set(accountTokens);
    const shared = senderTokens.filter((t) => accountSet.has(t)).length;
    return shared >= Math.ceil(Math.min(senderTokens.length, accountTokens.length) / 2);
}

export async function simulateWebhook(
    payload: SimulateWebhookPayload,
): Promise<SimulateWebhookResult> {
    if (USE_MOCK) {
        await sleep(600);
        const account = _getAccountMock(payload.accountId);
        if (!account) throw new Error('Account not found');
        if (account.environment !== 'sandbox') {
            throw new Error('Cannot simulate a webhook against a live account');
        }

        const misdirected = !namesLikelyMatch(
            payload.senderName,
            account.customerName,
        );
        const txn: Transaction = {
            id: generateId(),
            virtualAccountId: account.id,
            amount: Math.round(payload.amount * 100),
            direction: 'credit',
            status: 'success',
            matched: !misdirected,
            misdirected,
            senderName: payload.senderName,
            senderBank: 'Sandbox Test Bank',
            nombaRef: `sandbox_txn_${generateId()}`,
            createdAt: new Date().toISOString(),
            environment: 'sandbox',
        };
        _pushTransactionMock(txn);
        if (misdirected) {
            _flagAccountMock(account.id);
        } else {
            _creditAccountMock(account.id, txn.amount);
        }

        return {
            requestId: `sandbox_${generateId()}`,
            transactionId: txn.id,
            accountRef: account.nombaRef,
            webhookEventId: null,
            processed: true,
            error: null,
            matched: !misdirected,
            misdirected,
        };
    }

    const { data } = await api.post<SimulateWebhookResult>(
        '/sandbox/simulate-webhook',
        payload,
    );
    return data;
}
