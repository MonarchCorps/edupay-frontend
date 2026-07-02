import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Title, Text, List, ListItem, Flex } from '@tremor/react';
import { Key, Trash2, Plus, LogOut, FlaskConical, Globe } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Pill } from '../components/ui/Pill';
import { NewKeyModal } from '../components/ui/NewKeyModal';
import {
    useApiKeys,
    useGenerateApiKey,
    useRevokeApiKey,
} from '../hooks/useApiKeys';
import { useMe } from '../hooks/useAuth';
import { maskApiKey, formatDateTime } from '../utils/formatters';
import { useEnvironment } from '../hooks/useEnvironment';
import { clearSessionToken } from '../api/auth';
import { USE_MOCK } from '../utils/constants';
import { clsx } from 'clsx';
import type { ApiKey, Environment } from '../types';

interface RowProps {
    label: string;
    value: string;
    mono?: boolean;
}

function Row({ label, value, mono }: RowProps) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-teal-mid/8 last:border-0">
            <span className="text-teal-mid/55 font-medium">{label}</span>
            <span
                className={
                    mono
                        ? 'mono-value text-xs text-brand-dark'
                        : 'text-brand-dark'
                }
            >
                {value}
            </span>
        </div>
    );
}

const MODE_OPTIONS: Array<{
    value: Environment;
    label: string;
    icon: typeof FlaskConical;
}> = [
    { value: 'sandbox', label: 'Sandbox', icon: FlaskConical },
    { value: 'live', label: 'Live', icon: Globe },
];

export default function Settings() {
    const navigate = useNavigate();
    const { mode } = useEnvironment();
    const { data: merchant } = useMe();
    const { data: keys = [], isLoading } = useApiKeys();
    const generate = useGenerateApiKey();
    const revoke = useRevokeApiKey();
    const [newKey, setNewKey] = useState<string | null>(null);
    const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
    const [keyMode, setKeyMode] = useState<Environment>('sandbox');

    const handleLogout = () => {
        clearSessionToken();
        navigate('/onboarding', { replace: true });
    };

    const handleGenerate = async () => {
        const result = await generate.mutateAsync(keyMode);
        setNewKey(result.key);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <PageHeader
                title="Settings"
                subtitle="Manage your API keys and account information"
            />

            <Card>
                <Flex className="mb-2 flex-wrap gap-3">
                    <Title>API Keys</Title>
                </Flex>

                <div className="flex items-center justify-between flex-wrap gap-3 mb-5 p-3 rounded-tremor-small bg-teal-mid/5 border border-teal-mid/10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal-mid/50 mb-1.5">
                            Mode for new key
                        </p>
                        <div className="inline-flex rounded-tremor-small border border-teal-mid/15 overflow-hidden">
                            {MODE_OPTIONS.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setKeyMode(value)}
                                    className={clsx(
                                        'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent-gold',
                                        keyMode === value
                                            ? value === 'live'
                                                ? 'bg-success/15 text-success'
                                                : 'bg-accent-gold/20 text-[#8A6423]'
                                            : 'bg-transparent text-teal-mid/45 hover:text-teal-mid',
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button
                        size="sm"
                        icon={Plus}
                        loading={generate.isPending}
                        onClick={handleGenerate}
                        className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
                    >
                        Generate New Key
                    </Button>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-12 bg-teal-mid/5 rounded animate-pulse"
                            />
                        ))}
                    </div>
                ) : keys.length === 0 ? (
                    <EmptyState
                        icon={Key}
                        title="No API keys yet"
                        description="Generate your first API key to start making requests."
                    />
                ) : (
                    <List>
                        {keys.map((k) => (
                            <ListItem key={k.id}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <code className="mono-value text-sm text-brand-dark">
                                            {maskApiKey(k.key)}
                                        </code>
                                        <Pill
                                            tone={
                                                k.environment === 'live'
                                                    ? 'success'
                                                    : 'gold'
                                            }
                                        >
                                            {k.environment}
                                        </Pill>
                                    </div>
                                    <p className="text-xs text-teal-mid/40 mt-0.5">
                                        Created {formatDateTime(k.createdAt)}
                                    </p>
                                </div>
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    color="red"
                                    icon={Trash2}
                                    onClick={() => setRevokeTarget(k)}
                                    aria-label="Revoke API key"
                                >
                                    Revoke
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Card>

            <Card>
                <Title className="mb-4">Account Info</Title>
                <div className="space-y-3 text-sm">
                    <Row
                        label="Merchant Name"
                        value={
                            USE_MOCK
                                ? 'Mock Merchant'
                                : (merchant?.name ?? '—')
                        }
                    />
                    <Row
                        label="Email"
                        value={USE_MOCK ? 'mock@edupay.dev' : (merchant?.email ?? '—')}
                    />
                    <Row
                        label="Merchant ID"
                        value={USE_MOCK ? '—' : (merchant?.id ?? '—')}
                        mono
                    />
                    <Row
                        label="Created"
                        value={
                            USE_MOCK || !merchant
                                ? '—'
                                : formatDateTime(merchant.createdAt)
                        }
                    />
                    <Row
                        label="Active Mode"
                        value={mode === 'live' ? 'Live' : 'Sandbox'}
                    />
                </div>
            </Card>

            <Card className="border border-error/20">
                <Flex>
                    <div>
                        <Title className="text-error text-base">
                            Sign Out
                        </Title>
                        <Text className="text-teal-mid/55 text-sm mt-0.5">
                            Ends your dashboard session on this browser.
                            You'll need to sign in again to access the
                            dashboard.
                        </Text>
                    </div>
                    <Button
                        variant="secondary"
                        color="red"
                        icon={LogOut}
                        onClick={handleLogout}
                        className="flex-shrink-0"
                    >
                        Sign Out
                    </Button>
                </Flex>
            </Card>

            <NewKeyModal apiKey={newKey} onClose={() => setNewKey(null)} />

            <Modal
                isOpen={!!revokeTarget}
                onClose={() => setRevokeTarget(null)}
                title="Revoke API Key"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setRevokeTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            loading={revoke.isPending}
                            onClick={async () => {
                                if (revokeTarget)
                                    await revoke.mutateAsync(revokeTarget.id);
                                setRevokeTarget(null);
                            }}
                        >
                            Revoke Key
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-teal-mid/70">
                    Revoking{' '}
                    <code className="mono-value">
                        {maskApiKey(revokeTarget?.key)}
                    </code>{' '}
                    will immediately invalidate any requests using this key.
                </p>
            </Modal>
        </div>
    );
}
