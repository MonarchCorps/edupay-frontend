import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateApiKey, getApiKeys, revokeApiKey } from '../api/auth';
import { useToast } from './useToast';
import type { ApiError } from '../types';

export function useApiKeys() {
    return useQuery({
        queryKey: ['api-keys'],
        queryFn: getApiKeys,
        staleTime: 60_000,
    });
}

export function useGenerateApiKey() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation<Awaited<ReturnType<typeof generateApiKey>>, ApiError>({
        mutationFn: generateApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
        },
        onError: (err) => {
            toast({
                type: 'error',
                message: err.message || 'Failed to generate API key',
            });
        },
    });
}

export function useRevokeApiKey() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation<void, ApiError, string>({
        mutationFn: (id) => revokeApiKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
            toast({ type: 'success', message: 'API key revoked' });
        },
        onError: (err) => {
            toast({
                type: 'error',
                message: err.message || 'Failed to revoke API key',
            });
        },
    });
}
