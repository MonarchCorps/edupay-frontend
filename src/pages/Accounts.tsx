import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Card,
    Button,
    Select,
    SelectItem,
    TextInput,
    Flex,
} from '@tremor/react';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { AccountTable } from '../components/accounts/AccountTable';
import { ProvisionForm } from '../components/accounts/ProvisionForm';
import {
    useAccounts,
    useProvisionAccount,
    useFreezeAccount,
    useUnfreezeAccount,
    useCloseAccount,
} from '../hooks/useAccounts';
import { ACCOUNT_STATUSES, KYC_TIERS } from '../utils/constants';
import { useDebounce } from '../hooks/useDebounce';
import type {
    Account,
    AccountParams,
    AccountStatus,
    KycTier,
    ProvisionPayload,
} from '../types';

export default function Accounts() {
    const [searchParams] = useSearchParams();
    const [provisionOpen, setProvisionOpen] = useState(false);
    const [closeTarget, setCloseTarget] = useState<Account | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get('status') ?? '',
    );
    const [tierFilter, setTierFilter] = useState('');

    const debouncedSearch = useDebounce(search, 300);

    const params = useMemo(
        (): AccountParams => ({
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(statusFilter && { status: statusFilter as AccountStatus }),
            ...(tierFilter && { kycTier: tierFilter as KycTier }),
        }),
        [debouncedSearch, statusFilter, tierFilter],
    );

    const { data, isLoading } = useAccounts(params);
    const provision = useProvisionAccount();
    const freeze = useFreezeAccount();
    const unfreeze = useUnfreezeAccount();
    const close = useCloseAccount();

    const accounts = data?.data ?? [];

    const handleProvision = useCallback(
        async (formData: ProvisionPayload) => {
            await provision.mutateAsync(formData);
            setProvisionOpen(false);
        },
        [provision],
    );

    const handleClose = useCallback(async () => {
        if (!closeTarget) return;
        await close.mutateAsync(closeTarget.id);
        setCloseTarget(null);
    }, [close, closeTarget]);

    return (
        <div className="space-y-4">
            <PageHeader
                title="Virtual Accounts"
                subtitle="Manage provisioned DVA accounts"
                action={
                    <Button
                        onClick={() => setProvisionOpen(true)}
                        icon={Plus}
                        className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
                    >
                        Provision Account
                    </Button>
                }
            />

            <Card>
                <Flex className="gap-3 flex-wrap mb-4">
                    <TextInput
                        placeholder="Search by name or account number…"
                        icon={Search}
                        value={search}
                        onValueChange={setSearch}
                        className="max-w-xs"
                    />
                    <Select
                        placeholder="Status"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                        className="max-w-[160px]"
                    >
                        <SelectItem value="">All statuses</SelectItem>
                        {Object.entries(ACCOUNT_STATUSES).map(
                            ([k, { label }]) => (
                                <SelectItem key={k} value={k}>
                                    {label}
                                </SelectItem>
                            ),
                        )}
                    </Select>
                    <Select
                        placeholder="KYC Tier"
                        value={tierFilter}
                        onValueChange={setTierFilter}
                        className="max-w-[160px]"
                    >
                        <SelectItem value="">All tiers</SelectItem>
                        {Object.entries(KYC_TIERS).map(([k, { label }]) => (
                            <SelectItem key={k} value={k}>
                                {label}
                            </SelectItem>
                        ))}
                    </Select>
                </Flex>

                {isLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-12 bg-teal-mid/5 rounded animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <AccountTable
                        accounts={accounts}
                        onFreeze={(id) => freeze.mutate(id)}
                        onUnfreeze={(id) => unfreeze.mutate(id)}
                        onClose={(acc) => setCloseTarget(acc)}
                    />
                )}
            </Card>

            <Modal
                isOpen={provisionOpen}
                onClose={() => setProvisionOpen(false)}
                title="Provision Virtual Account"
                size="md"
            >
                <ProvisionForm
                    onSubmit={handleProvision}
                    isLoading={provision.isPending}
                    onCancel={() => setProvisionOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={!!closeTarget}
                onClose={() => setCloseTarget(null)}
                title="Close Account"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setCloseTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            loading={close.isPending}
                            onClick={handleClose}
                        >
                            Close Account
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-teal-mid/70">
                    Are you sure you want to close the account for{' '}
                    <strong className="text-brand-dark">
                        {closeTarget?.customerName}
                    </strong>
                    ? This action will sweep the remaining balance and cannot
                    be undone.
                </p>
            </Modal>
        </div>
    );
}
