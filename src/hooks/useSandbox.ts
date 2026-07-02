import { useMutation, useQueryClient } from '@tanstack/react-query';
import { simulateWebhook } from '../api/sandbox';
import { useToast } from './useToast';
import type { ApiError } from '../types';
import type { SimulateWebhookPayload, SimulateWebhookResult } from '../api/sandbox';

export function useSimulateWebhook() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation<SimulateWebhookResult, ApiError, SimulateWebhookPayload>({
        mutationFn: simulateWebhook,
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            if (result.error) {
                toast({
                    type: 'error',
                    message: `Webhook simulated but reconciliation failed: ${result.error}`,
                });
            } else if (result.misdirected) {
                toast({
                    type: 'warning',
                    message:
                        'Webhook simulated — flagged as misdirected (sender name mismatch).',
                });
            } else {
                toast({
                    type: 'success',
                    message: 'Webhook simulated — payment matched and credited.',
                });
            }
        },
        onError: (err) => {
            toast({
                type: 'error',
                message: err.message || 'Failed to simulate webhook',
            });
        },
    });
}
