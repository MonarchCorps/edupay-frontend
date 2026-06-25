import { useMemo } from 'react'
import { useAccounts } from './useAccounts'
import { useTransactions } from './useTransactions'
import { useWebhookEvents } from './useWebhooks'
import { subDays, format, startOfDay } from 'date-fns'
import type { Account, AccountStatus, WebhookEvent } from '../types'

interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  flaggedAccounts: Account[]
  totalVolume: number
  webhooksToday: number
  failedWebhooksToday: number
  statusBreakdown: Partial<Record<AccountStatus, number>>
  volumeChartData: Array<{ date: string; Volume: number }>
  recentAccounts: Account[]
  recentWebhooks: WebhookEvent[]
}

export function useDashboard() {
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts({})
  const { data: transactionsData, isLoading: loadingTxns } = useTransactions({})
  const { data: webhooksData, isLoading: loadingWebhooks } = useWebhookEvents({})

  const stats = useMemo((): DashboardStats => {
    const accounts = accountsData?.data ?? []
    const transactions = transactionsData?.data ?? []
    const webhooks = webhooksData?.data ?? []

    const totalVolume = transactions
      .filter((t) => t.direction === 'credit' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0)

    const today = startOfDay(new Date())
    const webhooksToday = webhooks.filter(
      (w) => new Date(w.receivedAt) >= today
    )
    const failedToday = webhooksToday.filter((w) => w.error)

    const statusBreakdown = accounts.reduce<Partial<Record<AccountStatus, number>>>((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1
      return acc
    }, {})

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      const label = format(date, 'MMM d')
      const dayStart = startOfDay(date).toISOString()
      const dayEnd = new Date(startOfDay(date).getTime() + 86_400_000).toISOString()
      const Volume = transactions
        .filter(
          (t) =>
            t.direction === 'credit' &&
            t.status === 'success' &&
            t.createdAt >= dayStart &&
            t.createdAt < dayEnd
        )
        .reduce((sum, t) => sum + t.amount / 100, 0)
      return { date: label, Volume }
    })

    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.status === 'active').length,
      flaggedAccounts: accounts.filter((a) => a.status === 'flagged'),
      totalVolume,
      webhooksToday: webhooksToday.length,
      failedWebhooksToday: failedToday.length,
      statusBreakdown,
      volumeChartData: last7Days,
      recentAccounts: accounts.slice(0, 5),
      recentWebhooks: webhooks.slice(0, 5),
    }
  }, [accountsData, transactionsData, webhooksData])

  return {
    stats,
    isLoading: loadingAccounts || loadingTxns || loadingWebhooks,
  }
}
