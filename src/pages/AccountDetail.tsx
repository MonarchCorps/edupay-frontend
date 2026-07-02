import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Metric,
    Text,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    Flex,
    Title,
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    List,
    ListItem,
    TextInput,
} from '@tremor/react';
import { Check, AlertTriangle, ArrowLeft, Share2 } from 'lucide-react';
import { AccountStatusBadge } from '../components/accounts/AccountStatusBadge';
import { AccountCard } from '../components/ui/AccountCard';
import { Pill } from '../components/ui/Pill';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable';
import { MisdirectedAlert } from '../components/webhooks/MisdirectedAlert';
import { Modal } from '../components/ui/Modal';
import {
    useAccount,
    useAccountStatement,
    useCloseAccount,
    useRenameAccount,
    useUnfreezeAccount,
    useFreezeAccount,
} from '../hooks/useAccounts';
import { useTransactions, useResolveTransaction } from '../hooks/useTransactions';
import { useWebhookEvents } from '../hooks/useWebhooks';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import {
    formatCurrency,
    formatDateTime,
    formatRelativeTime,
} from '../utils/formatters';
import { KYC_TIERS } from '../utils/constants';
import { clsx } from 'clsx';

interface StatementTabProps {
    accountId: string | undefined;
}

function StatementTab({ accountId }: StatementTabProps) {
    const { data, isLoading } = useAccountStatement(accountId);
    const rows = data ?? [];
    if (isLoading)
        return <div className="h-32 bg-teal-mid/5 animate-pulse rounded" />;
    if (!rows.length)
        return <Text className="text-teal-mid/50">No statement entries.</Text>;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell className="text-xs uppercase tracking-wide text-teal-mid/50">
                        Date
                    </TableHeaderCell>
                    <TableHeaderCell className="text-xs uppercase tracking-wide text-teal-mid/50">
                        Description
                    </TableHeaderCell>
                    <TableHeaderCell className="text-xs uppercase tracking-wide text-teal-mid/50">
                        Direction
                    </TableHeaderCell>
                    <TableHeaderCell className="text-xs uppercase tracking-wide text-teal-mid/50 text-right">
                        Amount
                    </TableHeaderCell>
                    <TableHeaderCell className="text-xs uppercase tracking-wide text-teal-mid/50 text-right">
                        Running Balance
                    </TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell className="text-sm text-teal-mid/50 whitespace-nowrap py-3">
                            {formatDateTime(r.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-brand-dark py-3">
                            {r.senderName}
                        </TableCell>
                        <TableCell className="py-3">
                            <Pill tone={r.direction === 'credit' ? 'success' : 'error'}>
                                {r.direction === 'credit' ? 'Credit' : 'Debit'}
                            </Pill>
                        </TableCell>
                        <TableCell
                            className={clsx(
                                'mono-value font-medium text-right py-3',
                                r.direction === 'credit'
                                    ? 'text-success'
                                    : 'text-error',
                            )}
                        >
                            {r.direction === 'credit' ? '+' : '−'}
                            {formatCurrency(r.amount)}
                        </TableCell>
                        <TableCell className="mono-value font-semibold text-brand-dark text-right py-3">
                            {formatCurrency(r.runningBalance ?? 0)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AccountDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: account, isLoading } = useAccount(id);
    const { data: txnsData } = useTransactions({ virtualAccountId: id });
    const { data: webhooksData } = useWebhookEvents({ virtualAccountId: id });
    const rename = useRenameAccount();
    const close = useCloseAccount();
    const freeze = useFreezeAccount();
    const unfreeze = useUnfreezeAccount();
    const resolveTransaction = useResolveTransaction();

    const [closeOpen, setCloseOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const { copy: copyShare, copied: sharedCopied } = useCopyToClipboard();

    const transactions = txnsData?.data ?? [];
    const webhooks = webhooksData?.data ?? [];
    const misdirected = transactions.find((t) => t.misdirected);

    if (isLoading) {
        return (
            <div className="h-64 bg-teal-mid/5 animate-pulse rounded-tremor-default" />
        );
    }
    if (!account) {
        return (
            <div className="text-center py-16">
                <Text>Account not found.</Text>
                <Button
                    onClick={() => navigate('/accounts')}
                    className="mt-4"
                    variant="secondary"
                >
                    Back to Accounts
                </Button>
            </div>
        );
    }

    const historyWithDates = [
        {
            status: 'pending',
            date: account.createdAt,
            reason: 'Account provisioned',
        },
        {
            status: account.status,
            date: account.createdAt,
            reason: `Status: ${account.status}`,
        },
    ];

    return (
        <div className="space-y-5">
            <Button
                variant="secondary"
                size="xs"
                icon={ArrowLeft}
                onClick={() => navigate('/accounts')}
            >
                Back to Accounts
            </Button>

            {misdirected && (
                <MisdirectedAlert
                    account={account}
                    transaction={misdirected}
                    onAllocate={(txn) =>
                        resolveTransaction.mutate({ id: txn.id, action: 'allocate' })
                    }
                    onReturn={(txn) =>
                        resolveTransaction.mutate({ id: txn.id, action: 'return' })
                    }
                />
            )}

            <Card>
                <div className="flex flex-col md:flex-row gap-5">
                    <AccountCard
                        accountNumber={account.accountNumber}
                        bankName={account.bankName}
                        customerName={account.customerName}
                        size="lg"
                        className="flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                        <div>
                            <Title>{account.customerName}</Title>
                            <Text className="text-xs mt-1 text-teal-mid/45">
                                Customer ID: {account.customerId}
                            </Text>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <AccountStatusBadge status={account.status} />
                            <Pill tone="info">
                                {KYC_TIERS[account.kycTier]?.label}
                            </Pill>
                            <span className="text-xs text-teal-mid/45">
                                Created {formatRelativeTime(account.createdAt)}
                            </span>
                            <button
                                onClick={() =>
                                    copyShare(
                                        `Account: ${account.accountNumber} | Bank: ${account.bankName} | Name: ${account.customerName}`,
                                    )
                                }
                                className="flex items-center gap-1 text-xs text-teal-mid/50 hover:text-teal-mid px-2 py-1 border border-teal-mid/15 rounded-tremor-small transition-colors focus-visible:ring-2 focus-visible:ring-accent-gold"
                                aria-label="Share payment details"
                            >
                                {sharedCopied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-success" />
                                        <span className="text-success">
                                            Copied!
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share details</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {account.status === 'flagged' && (
                    <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-tremor-small bg-error/[0.06] border border-error/20">
                        <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
                        <p className="text-sm text-teal-mid/75">
                            <span className="font-semibold text-error">
                                This account is flagged
                            </span>{' '}
                            for suspicious activity — review the transaction
                            history below.
                        </p>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <Text>Balance</Text>
                    <Metric className="mono-value">
                        {formatCurrency(account.balance)}
                    </Metric>
                    {account.lastCreditAt && (
                        <Text className="text-xs mt-1">
                            Last credit{' '}
                            {formatRelativeTime(account.lastCreditAt)}
                        </Text>
                    )}
                </Card>
                <Card>
                    <Text>Transactions</Text>
                    <Metric>{transactions.length}</Metric>
                </Card>
                <Card>
                    <Text>Webhook Events</Text>
                    <Metric>{webhooks.length}</Metric>
                </Card>
            </div>

            <TabGroup>
                <TabList>
                    <Tab>Statement</Tab>
                    <Tab>Transactions</Tab>
                    <Tab>Webhook Events</Tab>
                    <Tab>History</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Card className="mt-4">
                            <StatementTab accountId={id} />
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card className="mt-4">
                            <TransactionTable transactions={transactions} />
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card className="mt-4">
                            <WebhookEventTable events={webhooks} />
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card className="mt-4">
                            <List>
                                {historyWithDates.map((h, i) => (
                                    <ListItem key={i}>
                                        <span className="font-medium text-brand-dark">
                                            {h.reason}
                                        </span>
                                        <span className="text-teal-mid/45 text-sm">
                                            {formatDateTime(h.date)}
                                        </span>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>

            <Card className="border-2 border-error/20">
                <Title className="text-error mb-4">Danger Zone</Title>
                <div className="space-y-4">
                    <div>
                        <Text className="mb-2 font-medium text-brand-dark">
                            Rename Account
                        </Text>
                        <Flex className="gap-2 max-w-sm">
                            <TextInput
                                placeholder="New customer name"
                                value={newName}
                                onValueChange={setNewName}
                            />
                            <Button
                                size="sm"
                                loading={rename.isPending}
                                onClick={() => {
                                    if (newName.trim() && id)
                                        rename.mutate({
                                            id,
                                            name: newName.trim(),
                                        });
                                }}
                                disabled={!newName.trim()}
                            >
                                Save
                            </Button>
                        </Flex>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {account.status === 'active' && (
                            <Button
                                size="sm"
                                variant="secondary"
                                color="blue"
                                loading={freeze.isPending}
                                onClick={() => id && freeze.mutate(id)}
                            >
                                Freeze Account
                            </Button>
                        )}
                        {account.status === 'frozen' && (
                            <Button
                                size="sm"
                                variant="secondary"
                                color="green"
                                loading={unfreeze.isPending}
                                onClick={() => id && unfreeze.mutate(id)}
                            >
                                Unfreeze Account
                            </Button>
                        )}
                        {account.status !== 'closed' && (
                            <Button
                                size="sm"
                                color="red"
                                onClick={() => setCloseOpen(true)}
                            >
                                Close Account
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={closeOpen}
                onClose={() => setCloseOpen(false)}
                title="Close Account"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setCloseOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            loading={close.isPending}
                            onClick={async () => {
                                if (id) await close.mutateAsync(id);
                                setCloseOpen(false);
                                navigate('/accounts');
                            }}
                        >
                            Confirm Close
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-teal-mid/70">
                    Closing this account will sweep the remaining balance and
                    disable all future inbound transfers. This action{' '}
                    <strong className="text-brand-dark">cannot be undone</strong>.
                </p>
            </Modal>
        </div>
    );
}
