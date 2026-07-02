import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getTransaction,
    getTransactions,
    resolveTransaction,
} from '../api/transactions';
import { useToast } from './useToast';
import type { ApiError, TransactionParams } from '../types';

export function useTransactions(params?: TransactionParams) {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => getTransactions(params),
        staleTime: 30_000,
    });
}

export function useTransaction(id: string | undefined) {
    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => getTransaction(id!),
        enabled: !!id,
        staleTime: 30_000,
    });
}

export function useResolveTransaction() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation<
        Awaited<ReturnType<typeof resolveTransaction>>,
        ApiError,
        { id: string; action: 'allocate' | 'return' }
    >({
        mutationFn: ({ id, action }) => resolveTransaction(id, action),
        onSuccess: (_result, { action }) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast({
                type: 'success',
                message:
                    action === 'allocate'
                        ? 'Payment allocated to customer'
                        : 'Return initiated',
            });
        },
        onError: (err) => {
            toast({
                type: 'error',
                message: err.message || 'Failed to resolve transaction',
            });
        },
    });
}
