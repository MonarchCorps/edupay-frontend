import { Link } from 'react-router-dom'
import {
  Card, Metric, Text, ProgressBar, Callout, Grid, Col, Flex, Title,
} from '@tremor/react'
import { AlertTriangle, Zap } from 'lucide-react'
import { VolumeChart } from '../components/charts/VolumeChart'
import { AccountStatusChart } from '../components/charts/AccountStatusChart'
import { AccountTable } from '../components/accounts/AccountTable'
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable'
import { useDashboard } from '../hooks/useDashboard'
import { formatCurrency } from '../utils/formatters'

// suppress unused import warnings for Tremor layout components
void Col

export default function Dashboard() {
  const { stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <Grid numItemsMd={4} className="gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><div className="h-20 bg-gray-100 rounded" /></Card>
          ))}
        </Grid>
      </div>
    )
  }

  const {
    totalAccounts, activeAccounts, flaggedAccounts,
    totalVolume, webhooksToday, failedWebhooksToday,
    statusBreakdown, volumeChartData,
    recentAccounts, recentWebhooks,
  } = stats

  const activePercent = totalAccounts > 0
    ? Math.round((activeAccounts / totalAccounts) * 100)
    : 0

  return (
    <div className="space-y-6">
      {flaggedAccounts.length > 0 && (
        <Callout
          title={`${flaggedAccounts.length} account${flaggedAccounts.length > 1 ? 's' : ''} flagged for review`}
          icon={AlertTriangle}
          color="red"
        >
          <Link to="/accounts?status=flagged" className="text-sm underline font-medium">
            View flagged accounts →
          </Link>
        </Callout>
      )}

      <Grid numItemsMd={2} numItemsLg={4} className="gap-4">
        <Card>
          <Text>Total Accounts</Text>
          <Metric>{totalAccounts}</Metric>
        </Card>
        <Card>
          <Text>Active Accounts</Text>
          <Metric>{activeAccounts}</Metric>
          <ProgressBar value={activePercent} color="teal" className="mt-2" />
          <Text className="mt-1">{activePercent}% of total</Text>
        </Card>
        <Card>
          <Text>Total Volume (Credits)</Text>
          <Metric>{formatCurrency(totalVolume)}</Metric>
        </Card>
        <Card>
          <Text>Webhooks Today</Text>
          <Metric className={failedWebhooksToday > 0 ? 'text-red-600' : 'text-green-600'}>
            {webhooksToday}
          </Metric>
          {failedWebhooksToday > 0 && (
            <Text className="text-red-500">{failedWebhooksToday} failed</Text>
          )}
        </Card>
      </Grid>

      <Grid numItemsMd={2} className="gap-4">
        <Card>
          <Title>Transfer Volume — Last 7 Days</Title>
          <VolumeChart data={volumeChartData} className="mt-4" />
        </Card>
        <Card>
          <Title>Account Status Breakdown</Title>
          <AccountStatusChart breakdown={statusBreakdown} className="mt-4" />
        </Card>
      </Grid>

      <Card>
        <Flex className="mb-4">
          <Title>Recent Accounts</Title>
          <Link to="/accounts" className="text-sm text-brand-mid hover:text-brand-dark font-medium">
            View all →
          </Link>
        </Flex>
        <AccountTable accounts={recentAccounts} showActions={false} />
      </Card>

      <Card>
        <Flex className="mb-4">
          <Title>Recent Webhook Events</Title>
          <Link to="/webhooks" className="text-sm text-brand-mid hover:text-brand-dark font-medium">
            View all →
          </Link>
        </Flex>
        <WebhookEventTable events={recentWebhooks} />
      </Card>
    </div>
  )
}

void Zap
