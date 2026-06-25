import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  closeAccount,
  freezeAccount,
  getAccount,
  getAccountStatement,
  getAccounts,
  provisionAccount,
  renameAccount,
  unfreezeAccount,
} from '../api/accounts'
import { useToast } from './useToast'
import type { AccountParams, ApiError, ProvisionPayload } from '../types'

export function useAccounts(params?: AccountParams) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => getAccounts(params),
    staleTime: 30_000,
  })
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => getAccount(id!),
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useAccountStatement(id: string | undefined) {
  return useQuery({
    queryKey: ['accounts', id, 'statement'],
    queryFn: () => getAccountStatement(id!),
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useProvisionAccount() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<Awaited<ReturnType<typeof provisionAccount>>, ApiError, ProvisionPayload>({
    mutationFn: provisionAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast({ type: 'success', message: 'Account provisioned successfully' })
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to provision account' })
    },
  })
}

export function useRenameAccount() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<Awaited<ReturnType<typeof renameAccount>>, ApiError, { id: string; name: string }>({
    mutationFn: ({ id, name }) => renameAccount(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast({ type: 'success', message: 'Account renamed successfully' })
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to rename account' })
    },
  })
}

export function useFreezeAccount() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<Awaited<ReturnType<typeof freezeAccount>>, ApiError, string>({
    mutationFn: (id) => freezeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast({ type: 'success', message: 'Account frozen' })
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to freeze account' })
    },
  })
}

export function useUnfreezeAccount() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<Awaited<ReturnType<typeof unfreezeAccount>>, ApiError, string>({
    mutationFn: (id) => unfreezeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast({ type: 'success', message: 'Account unfrozen' })
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to unfreeze account' })
    },
  })
}

export function useCloseAccount() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation<Awaited<ReturnType<typeof closeAccount>>, ApiError, string>({
    mutationFn: (id) => closeAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast({ type: 'success', message: 'Account closed successfully' })
    },
    onError: (err) => {
      toast({ type: 'error', message: err.message || 'Failed to close account' })
    },
  })
}
