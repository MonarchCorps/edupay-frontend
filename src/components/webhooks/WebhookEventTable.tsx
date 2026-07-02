import { useState } from 'react';
import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
} from '@tremor/react';
import { Zap } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { WebhookPayloadViewer } from '../ui/WebhookPayloadViewer';
import { Pill } from '../ui/Pill';
import { ReplayButton } from './ReplayButton';
import { formatDateTime, truncateString } from '../../utils/formatters';
import { clsx } from 'clsx';
import type { WebhookEvent } from '../../types';

const HEAD_CELL = 'py-3 text-xs uppercase tracking-wide text-teal-mid/50';
const BODY_CELL = 'py-3.5';

interface WebhookEventTableProps {
    events?: WebhookEvent[];
    className?: string;
}

export function WebhookEventTable({
    events = [],
    className,
}: WebhookEventTableProps) {
    const [payloadEvent, setPayloadEvent] = useState<WebhookEvent | null>(null);

    if (!events.length) {
        return (
            <EmptyState
                icon={Zap}
                title="No webhook events"
                description="No events match the current filters."
            />
        );
    }

    return (
        <>
            <div className={clsx('overflow-x-auto', className)}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell className={HEAD_CELL}>
                                Received At
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Event Type
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Account
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Processed
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Error
                            </TableHeaderCell>
                            <TableHeaderCell className={HEAD_CELL}>
                                Actions
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow
                                key={event.id}
                                className={clsx(
                                    'transition-colors',
                                    event.error && 'bg-error/[0.04]',
                                )}
                            >
                                <TableCell
                                    className={clsx(
                                        BODY_CELL,
                                        'text-teal-mid/50 text-sm whitespace-nowrap',
                                    )}
                                >
                                    {formatDateTime(event.receivedAt)}
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <span className="mono-value text-xs bg-teal-mid/8 text-teal-mid px-2 py-0.5 rounded">
                                        {event.eventType}
                                    </span>
                                </TableCell>
                                <TableCell
                                    className={clsx(
                                        BODY_CELL,
                                        'mono-value text-xs text-teal-mid/60',
                                    )}
                                >
                                    {event.virtualAccountId}
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <Pill tone={event.processed ? 'success' : 'error'}>
                                        {event.processed
                                            ? 'Processed'
                                            : 'Pending'}
                                    </Pill>
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    {event.error ? (
                                        <span
                                            className="text-error text-xs cursor-help"
                                            title={event.error}
                                        >
                                            {truncateString(event.error, 40)}
                                        </span>
                                    ) : (
                                        <span className="text-teal-mid/30 text-xs">
                                            —
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className={BODY_CELL}>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setPayloadEvent(event)
                                            }
                                            className="text-xs text-teal-mid hover:text-brand-dark font-medium underline focus-visible:ring-2 focus-visible:ring-accent-gold rounded"
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
                    <WebhookPayloadViewer
                        payload={payloadEvent.rawPayload}
                        defaultOpen
                    />
                )}
            </Modal>
        </>
    );
}
