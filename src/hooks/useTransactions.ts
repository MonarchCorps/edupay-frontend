import { useQuery } from '@tanstack/react-query'
import { getTransaction, getTransactions } from '../api/transactions'
import type { TransactionParams } from '../types'

export function useTransactions(params?: TransactionParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
    staleTime: 30_000,
  })
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => getTransaction(id!),
    enabled: !!id,
    staleTime: 30_000,
  })
}
