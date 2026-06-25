import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWebhookEvent, getWebhookEvents, replayWebhookEvent } from '../api/webhooks'
import { useToast } from './useToast'
import type { ApiError, WebhookEvent, WebhookParams } from '../types'

export function useWebhookEvents(params?: WebhookParams) {
  return useQuery({
    queryKey: ['webhooks', params],
    queryFn: () => getWebhookEvents(params),
    staleTime: 30_000,
  })
}

export function useWebhookEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['webhooks', id],
    queryFn: () => getWebhookEvent(id!),
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useReplayWebhookEvent(onSuccess?: (data: WebhookEvent | undefined) => void) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<WebhookEvent | undefined, ApiError, string>({
    mutationFn: (id) => replayWebhookEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      toast({ type: 'success', message: 'Webhook event replayed successfully' })
      onSuccess?.(data)
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to replay webhook event' })
    },
  })
}
