import { Link } from 'react-router-dom';
import {
    Card,
    Metric,
    Text,
    ProgressBar,
    Callout,
    Grid,
    Col,
    Flex,
    Title,
    Button,
} from '@tremor/react';
import { AlertTriangle, Zap, PlusCircle } from 'lucide-react';
import { VolumeChart } from '../components/charts/VolumeChart';
import { AccountStatusChart } from '../components/charts/AccountStatusChart';
import { AccountTable } from '../components/accounts/AccountTable';
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency } from '../utils/formatters';

// suppress unused import warnings for Tremor layout components
void Col;

export default function Dashboard() {
    const { stats, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <Grid numItemsMd={4} className="gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <div className="h-20 bg-gray-100 rounded" />
                        </Card>
                    ))}
                </Grid>
            </div>
        );
    }

    const {
        totalAccounts,
        activeAccounts,
        flaggedAccounts,
        totalVolume,
        webhooksToday,
        failedWebhooksToday,
        statusBreakdown,
        volumeChartData,
        recentAccounts,
        recentWebhooks,
    } = stats;

    if (totalAccounts === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-mid/10 rounded-2xl mb-6">
                    <Zap className="w-8 h-8 text-brand-mid" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No virtual accounts yet
                </h2>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    Provision your first virtual account to start accepting
                    payments and tracking transactions.
                </p>
                <Link to="/accounts">
                    <Button
                        icon={PlusCircle}
                        className="bg-accent hover:bg-accent/90 text-gray-900 border-accent font-semibold"
                    >
                        Provision your first account
                    </Button>
                </Link>
            </div>
        );
    }

    const activePercent =
        totalAccounts > 0
            ? Math.round((activeAccounts / totalAccounts) * 100)
            : 0;

    return (
        <div className="space-y-6">
            {flaggedAccounts.length > 0 && (
                <Callout
                    title={`${flaggedAccounts.length} account${flaggedAccounts.length > 1 ? 's' : ''} flagged for review`}
                    icon={AlertTriangle}
                    color="red"
                >
                    <Link
                        to="/accounts?status=flagged"
                        className="text-sm underline font-medium"
                    >
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
                    <ProgressBar
                        value={activePercent}
                        color="teal"
                        className="mt-2"
                    />
                    <Text className="mt-1">{activePercent}% of total</Text>
                </Card>
                <Card>
                    <Text>Total Volume (Credits)</Text>
                    <Metric>{formatCurrency(totalVolume)}</Metric>
                </Card>
                <Card>
                    <Text>Webhooks Today</Text>
                    <Metric
                        className={
                            failedWebhooksToday > 0
                                ? 'text-red-600'
                                : 'text-green-600'
                        }
                    >
                        {webhooksToday}
                    </Metric>
                    {failedWebhooksToday > 0 && (
                        <Text className="text-red-500">
                            {failedWebhooksToday} failed
                        </Text>
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
                    <AccountStatusChart
                        breakdown={statusBreakdown}
                        className="mt-4"
                    />
                </Card>
            </Grid>

            <Card>
                <Flex className="mb-4">
                    <Title>Recent Accounts</Title>
                    <Link
                        to="/accounts"
                        className="text-sm text-brand-mid hover:text-brand-dark font-medium"
                    >
                        View all →
                    </Link>
                </Flex>
                <AccountTable accounts={recentAccounts} showActions={false} />
            </Card>

            <Card>
                <Flex className="mb-4">
                    <Title>Recent Webhook Events</Title>
                    <Link
                        to="/webhooks"
                        className="text-sm text-brand-mid hover:text-brand-dark font-medium"
                    >
                        View all →
                    </Link>
                </Flex>
                <WebhookEventTable events={recentWebhooks} />
            </Card>
        </div>
    );
}
