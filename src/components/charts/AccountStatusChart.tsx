import { DonutChart, Legend } from '@tremor/react'
import { ACCOUNT_STATUSES } from '../../utils/constants'
import { clsx } from 'clsx'
import type { AccountStatus } from '../../types'
import type { Color } from '@tremor/react'

interface AccountStatusChartProps {
  breakdown?: Partial<Record<AccountStatus, number>>
  className?: string
}

export function AccountStatusChart({ breakdown = {}, className }: AccountStatusChartProps) {
  const data = Object.entries(breakdown).map(([status, count]) => ({
    name: ACCOUNT_STATUSES[status as AccountStatus]?.label ?? status,
    value: count,
  }))

  const colours: Color[] = Object.keys(breakdown).map(
    (s) => ACCOUNT_STATUSES[s as AccountStatus]?.tremorColour ?? 'gray'
  )

  if (!data.length) return null

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <DonutChart
        className="h-40"
        data={data}
        index="name"
        category="value"
        colors={colours}
        showAnimation
      />
      <Legend
        categories={data.map((d) => d.name)}
        colors={colours}
        className="justify-center"
      />
    </div>
  )
}
