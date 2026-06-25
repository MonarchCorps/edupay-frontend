import { useMemo, useState } from 'react'
import { Card, Callout, Flex, Select, SelectItem, DateRangePicker, type DateRangePickerValue } from '@tremor/react'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { WebhookEventTable } from '../components/webhooks/WebhookEventTable'
import { useWebhookEvents } from '../hooks/useWebhooks'
import { WEBHOOK_EVENT_TYPES } from '../utils/constants'
import type { WebhookEventType, WebhookParams } from '../types'

export default function WebhookEvents() {
  const [eventType, setEventType] = useState('')
  const [processed, setProcessed] = useState('')
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({})

  const params = useMemo((): WebhookParams => ({
    ...(eventType && { eventType: eventType as WebhookEventType }),
    ...(processed !== '' && { processed: processed === 'true' }),
    ...(dateRange.from && { from: dateRange.from.toISOString() }),
    ...(dateRange.to && { to: dateRange.to.toISOString() }),
  }), [eventType, processed, dateRange])

  const { data, isLoading } = useWebhookEvents(params)
  const events = useMemo(() => data?.data ?? [], [data])
  const failedEvents = useMemo(() => events.filter((e) => e.error), [events])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Webhook Events"
        subtitle="Incoming Nomba webhook events, processing status, and replay controls"
      />

      {failedEvents.length > 0 && (
        <Callout
          title={`${failedEvents.length} event${failedEvents.length > 1 ? 's' : ''} failed processing — review below`}
          icon={AlertTriangle}
          color="red"
        >
          Use the Replay button on each failed event to retry delivery.
        </Callout>
      )}

      <Card>
        <Flex className="gap-3 flex-wrap mb-4">
          <Select
            placeholder="Event type"
            value={eventType}
            onValueChange={setEventType}
            className="max-w-[200px]"
          >
            <SelectItem value="">All event types</SelectItem>
            {WEBHOOK_EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                <span className="font-mono text-xs">{t}</span>
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Status"
            value={processed}
            onValueChange={setProcessed}
            className="max-w-[160px]"
          >
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="true">Processed</SelectItem>
            <SelectItem value="false">Pending / Failed</SelectItem>
          </Select>

          <DateRangePicker
            className="max-w-xs"
            placeholder="Date range"
            value={dateRange}
            onValueChange={setDateRange}
          />
        </Flex>

        {isLoading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <WebhookEventTable events={events} />
        )}
      </Card>
    </div>
  )
}
