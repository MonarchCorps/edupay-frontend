import { useState } from 'react';
import { Button, Callout } from '@tremor/react';
import { useAccounts } from '../../hooks/useAccounts';
import { useSimulateWebhook } from '../../hooks/useSandbox';

const inputClass =
    'w-full bg-[#FFFDF8] border border-teal-mid/20 rounded-tremor-small px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold transition-colors';

interface FieldProps {
    label: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

function Field({ label, action, children }: FieldProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-brand-dark/80">
                    {label}
                </label>
                {action}
            </div>
            {children}
        </div>
    );
}

interface SimulateWebhookFormProps {
    onDone: () => void;
    onCancel?: () => void;
}

export function SimulateWebhookForm({
    onDone,
    onCancel,
}: SimulateWebhookFormProps) {
    // Already scoped to sandbox — this form only ever renders while the
    // header toggle is in Sandbox mode, and account queries filter by the
    // active mode already.
    const { data } = useAccounts({});
    const accounts = data?.data ?? [];
    const simulate = useSimulateWebhook();

    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('5000');
    const [senderName, setSenderName] = useState('');

    const selectedAccount = accounts.find((a) => a.id === accountId);
    const amountValue = Number(amount);
    const canSubmit =
        !!accountId && amountValue > 0 && senderName.trim().length > 0;

    const fillMatchedPreset = () => {
        if (selectedAccount) setSenderName(selectedAccount.customerName);
    };
    const fillMisdirectedPreset = () => {
        setSenderName('Ngozi Adebayo-Whitfield');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        await simulate.mutateAsync({
            accountId,
            amount: amountValue,
            senderName: senderName.trim(),
        });
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Callout title="Sandbox only" color="yellow">
                Sends a correctly-signed, Nomba-shaped webhook to your own
                webhook endpoint, exactly as if a real transfer had landed on
                this account. Never available for live accounts.
            </Callout>

            <Field label="Target Account">
                {/* Native <select> avoids z-index conflicts with the Modal overlay */}
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className={inputClass}
                    required
                >
                    <option value="" disabled>
                        Choose a sandbox account
                    </option>
                    {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.customerName} — {a.accountNumber}
                        </option>
                    ))}
                </select>
                {accounts.length === 0 && (
                    <p className="text-xs text-teal-mid/45 mt-1">
                        No sandbox accounts yet — provision one first.
                    </p>
                )}
            </Field>

            <Field label="Amount (NGN)">
                <input
                    type="number"
                    min={1}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`${inputClass} mono-value`}
                    required
                />
            </Field>

            <Field
                label="Sender Name"
                action={
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={fillMatchedPreset}
                            disabled={!selectedAccount}
                            className="text-xs font-medium text-success hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Matched preset
                        </button>
                        <button
                            type="button"
                            onClick={fillMisdirectedPreset}
                            className="text-xs font-medium text-error hover:underline"
                        >
                            Misdirected preset
                        </button>
                    </div>
                }
            >
                <input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Chukwuemeka Okafor"
                    className={inputClass}
                    required
                />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    loading={simulate.isPending}
                    disabled={!canSubmit || simulate.isPending}
                    className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
                >
                    Simulate Webhook
                </Button>
            </div>
        </form>
    );
}
