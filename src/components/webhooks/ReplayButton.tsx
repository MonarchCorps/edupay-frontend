import { Button } from '@tremor/react';
import { RotateCcw } from 'lucide-react';
import { useReplayWebhookEvent } from '../../hooks/useWebhooks';
import type { WebhookEvent } from '../../types';

interface ReplayButtonProps {
    eventId: string;
    onSuccess?: (data: WebhookEvent | undefined) => void;
    className?: string;
}

export function ReplayButton({
    eventId,
    onSuccess,
    className,
}: ReplayButtonProps) {
    const { mutate, isPending } = useReplayWebhookEvent(onSuccess);

    return (
        <Button
            size="xs"
            variant="secondary"
            color="sky"
            loading={isPending}
            onClick={() => mutate(eventId)}
            icon={isPending ? undefined : RotateCcw}
            className={className}
            aria-label="Replay webhook event"
        >
            {isPending ? 'Replaying…' : 'Replay'}
        </Button>
    );
}
