import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Select, SelectItem, NumberInput, Button } from '@tremor/react'
import { customerNameRules, customerIdRules } from '../../utils/validators'
import { KYC_TIERS } from '../../utils/constants'
import type { KycTier, ProvisionPayload } from '../../types'
import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface ProvisionFormData {
  customerName: string
  customerId: string
  initialDeposit?: number
}

interface ProvisionFormProps {
  onSubmit: (data: ProvisionPayload) => void | Promise<void>
  isLoading: boolean
  onCancel?: () => void
}

export function ProvisionForm({ onSubmit, isLoading, onCancel }: ProvisionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProvisionFormData>()

  const [kycTier, setKycTier] = useState<KycTier>('tier1')

  const submit = handleSubmit((data: ProvisionFormData) => {
    onSubmit({ ...data, kycTier })
  })

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Customer Name" error={errors.customerName?.message}>
        <input
          {...register('customerName', customerNameRules)}
          placeholder="e.g. Chukwuemeka Okafor"
          className="w-full border border-gray-300 rounded-tremor-small px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
        />
      </Field>

      <Field label="Customer ID" error={errors.customerId?.message}>
        <input
          {...register('customerId', customerIdRules)}
          placeholder="e.g. cust_abc123"
          className="w-full border border-gray-300 rounded-tremor-small px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-mid"
        />
      </Field>

      <Field label="KYC Tier">
        <Select value={kycTier} onValueChange={(v) => setKycTier(v as KycTier)}>
          {Object.entries(KYC_TIERS).map(([key, { label, limit }]) => (
            <SelectItem key={key} value={key}>
              {label} — {limit}
            </SelectItem>
          ))}
        </Select>
      </Field>

      <Field label="Initial Deposit (₦, optional)" error={errors.initialDeposit?.message}>
        <NumberInput
          placeholder="0.00"
          min={0}
          onValueChange={(v) => setValue('initialDeposit', v)}
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
          loading={isLoading}
          className="bg-accent hover:bg-accent/90 text-gray-900 border-accent font-semibold"
        >
          Provision Account
        </Button>
      </div>
    </form>
  )
}
