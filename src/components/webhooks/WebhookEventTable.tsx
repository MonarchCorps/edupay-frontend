import { useState } from 'react'
import {
  Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge,
} from '@tremor/react'
import { Zap } from 'lucide-react'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { WebhookPayloadViewer } from '../ui/WebhookPayloadViewer'
import { ReplayButton } from './ReplayButton'
import { formatDateTime, truncateString } from '../../utils/formatters'
import { clsx } from 'clsx'
import type { WebhookEvent } from '../../types'

interface WebhookEventTableProps {
  events?: WebhookEvent[]
  className?: string
}

export function WebhookEventTable({ events = [], className }: WebhookEventTableProps) {
  const [payloadEvent, setPayloadEvent] = useState<WebhookEvent | null>(null)

  if (!events.length) {
    return (
      <EmptyState
        icon={Zap}
        title="No webhook events"
        description="No events match the current filters."
      />
    )
  }

  return (
    <>
      <div className={clsx('overflow-x-auto', className)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Received At</TableHeaderCell>
              <TableHeaderCell>Event Type</TableHeaderCell>
              <TableHeaderCell>Account</TableHeaderCell>
              <TableHeaderCell>Processed</TableHeaderCell>
              <TableHeaderCell>Error</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow
                key={event.id}
                className={clsx(
                  'transition-colors',
                  event.error && 'bg-red-50/50'
                )}
              >
                <TableCell className="text-gray-500 text-sm whitespace-nowrap">
                  {formatDateTime(event.receivedAt)}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {event.eventType}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-600">
                  {event.virtualAccountId}
                </TableCell>
                <TableCell>
                  <Badge color={event.processed ? 'green' : 'red'}>
                    {event.processed ? 'Processed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.error ? (
                    <span
                      className="text-red-600 text-xs cursor-help"
                      title={event.error}
                    >
                      {truncateString(event.error, 40)}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPayloadEvent(event)}
                      className="text-xs text-brand-mid hover:text-brand-dark font-medium underline"
                    >
                      View Payload
                    </button>
                    {(!event.processed || event.error) && (
                      <ReplayButton eventId={event.id} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={!!payloadEvent}
        onClose={() => setPayloadEvent(null)}
        title={`Payload — ${payloadEvent?.eventType ?? ''}`}
        size="lg"
      >
        {payloadEvent && (
          <WebhookPayloadViewer payload={payloadEvent.rawPayload} defaultOpen />
        )}
      </Modal>
    </>
  )
}
