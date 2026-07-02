import { useForm } from 'react-hook-form';
import { Button, Callout } from '@tremor/react';
import { customerNameRules } from '../../utils/validators';
import { KYC_TIERS } from '../../utils/constants';
import { useEnvironment } from '../../hooks/useEnvironment';
import type { KycTier, ProvisionPayload } from '../../types';
import type { ReactNode } from 'react';

interface FieldProps {
    label: string;
    error?: string;
    children: ReactNode;
}

function Field({ label, error, children }: FieldProps) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-brand-dark/80">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

interface ProvisionFormData {
    customerName: string;
    kycTier: KycTier;
    initialDeposit?: number;
}

interface ProvisionFormProps {
    onSubmit: (data: ProvisionPayload) => void | Promise<void>;
    isLoading: boolean;
    onCancel?: () => void;
}

export function ProvisionForm({
    onSubmit,
    isLoading,
    onCancel,
}: ProvisionFormProps) {
    const { mode } = useEnvironment();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProvisionFormData>({ defaultValues: { kycTier: 'tier1' } });

    const submit = handleSubmit((data: ProvisionFormData) => {
        onSubmit({
            customerName: data.customerName,
            // Auto-generate customer ID — not shown to the user
            customerId: `cust_${crypto.randomUUID().slice(0, 8)}`,
            kycTier: data.kycTier,
            initialDeposit: data.initialDeposit,
        });
    });

    return (
        <form onSubmit={submit} className="space-y-4">
            <Callout
                title={
                    mode === 'live'
                        ? 'This account will be provisioned in Live mode'
                        : 'This account will be provisioned in Sandbox mode'
                }
                color={mode === 'live' ? 'green' : 'yellow'}
            >
                {mode === 'live'
                    ? 'A real Nomba virtual account will be created.'
                    : 'A test account with a fabricated account number will be created — no real Nomba API calls are made.'}
            </Callout>

            <Field label="Customer Name" error={errors.customerName?.message}>
                <input
                    {...register('customerName', customerNameRules)}
                    placeholder="e.g. Chukwuemeka Okafor"
                    className="w-full bg-[#FFFDF8] border border-teal-mid/20 rounded-tremor-small px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold transition-colors"
                />
            </Field>

            <Field label="KYC Tier" error={errors.kycTier?.message}>
                {/* Native <select> avoids z-index conflicts with the Modal overlay */}
                <select
                    {...register('kycTier', {
                        required: 'KYC tier is required',
                    })}
                    className="w-full bg-[#FFFDF8] border border-teal-mid/20 rounded-tremor-small px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold transition-colors"
                >
                    {Object.entries(KYC_TIERS).map(
                        ([key, { label, limit }]) => (
                            <option key={key} value={key}>
                                {label} — {limit}
                            </option>
                        ),
                    )}
                </select>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    className="bg-accent-gold hover:bg-accent-gold/90 text-brand-dark border-accent-gold font-semibold"
                >
                    Provision Account
                </Button>
            </div>
        </form>
    );
}
