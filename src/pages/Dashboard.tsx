import { Link } from 'react-router-dom';
import {
    Card,
    ProgressBar,
    Callout,
    Grid,
    Col,
    Flex,
    Title,
    Button,
} from '@tremor/react';
import {
    AlertTriangle,
    PlusCircle,
    Users,
    CheckCircle2,
    Wallet,
    Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { VolumeChart } from '../components/charts/VolumeChart';
import { AccountStatusChart } from '../components/charts/AccountStatusChart';
import { AccountTable } from '../components/accounts/AccountTable';
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable';
import { LogoMark } from '../components/ui/Logo';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency } from '../utils/formatters';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

// suppress unused import warnings for Tremor layout components
void Col;

const TONE_CHIP: Record<'gold' | 'success' | 'error' | 'neutral', string> = {
    gold: 'bg-accent-gold/15 text-[#8A6423]',
    success: 'bg-success/15 text-success',
    error: 'bg-error/15 text-error',
    neutral: 'bg-teal-mid/10 text-teal-mid',
};

interface StatCardProps {
    icon: LucideIcon;
    tone: keyof typeof TONE_CHIP;
    label: string;
    value: ReactNode;
    mono?: boolean;
    hero?: boolean;
    footer?: ReactNode;
}

function StatCard({
    icon: Icon,
    tone,
    label,
    value,
    mono,
    hero,
    footer,
}: StatCardProps) {
    return (
        <Card className={hero ? 'ring-1 ring-accent-gold/30' : undefined}>
            <Flex alignItems="start" className="gap-3">
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-teal-mid/50 font-semibold">
                        {label}
                    </p>
                    <p
                        className={clsx(
                            'font-bold text-brand-dark mt-1.5 truncate',
                            hero ? 'text-3xl' : 'text-2xl',
                            mono && 'mono-value',
                        )}
                    >
                        {value}
                    </p>
                    {footer}
                </div>
                <div
                    className={clsx(
                        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                        TONE_CHIP[tone],
                    )}
                >
                    <Icon className="w-4.5 h-4.5" />
                </div>
            </Flex>
        </Card>
    );
}

export default function Dashboard() {
    const { stats, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-teal-mid/10 rounded w-48" />
                <Grid numItemsMd={4} className="gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <div className="h-20 bg-teal-mid/5 rounded" />
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
                <div className="mb-6 opacity-90">
                    <LogoMark size={64} />
                </div>
                <h2 className="text-xl font-semibold text-brand-dark mb-2">
                    No virtual accounts yet
                </h2>
                <p className="text-sm text-teal-mid/55 mb-6 max-w-xs">
                    Provision your first virtual account to start accepting
                    payments and tracking transactions.
                </p>
                <Link to="/accounts">
                    <Button
                        icon={PlusCircle}
                        className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
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
                <StatCard
                    icon={Users}
                    tone="neutral"
                    label="Total Accounts"
                    value={totalAccounts}
                />
                <StatCard
                    icon={CheckCircle2}
                    tone="success"
                    label="Active Accounts"
                    value={activeAccounts}
                    footer={
                        <>
                            <ProgressBar
                                value={activePercent}
                                color="emerald"
                                className="mt-2"
                            />
                            <p className="text-xs text-teal-mid/50 mt-1">
                                {activePercent}% of total
                            </p>
                        </>
                    }
                />
                <StatCard
                    icon={Wallet}
                    tone="gold"
                    hero
                    label="Total Volume (Credits)"
                    value={formatCurrency(totalVolume)}
                    mono
                />
                <StatCard
                    icon={Zap}
                    tone={failedWebhooksToday > 0 ? 'error' : 'success'}
                    label="Webhooks Today"
                    value={webhooksToday}
                    footer={
                        failedWebhooksToday > 0 ? (
                            <p className="text-xs text-error mt-1">
                                {failedWebhooksToday} failed
                            </p>
                        ) : undefined
                    }
                />
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
                        className="text-sm text-teal-mid hover:text-brand-dark font-medium"
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
                        className="text-sm text-teal-mid hover:text-brand-dark font-medium"
                    >
                        View all →
                    </Link>
                </Flex>
                <WebhookEventTable events={recentWebhooks} />
            </Card>
        </div>
    );
}
