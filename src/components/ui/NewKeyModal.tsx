import { Button, Text } from '@tremor/react';
import { Modal } from './Modal';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface NewKeyModalProps {
    apiKey: string | null;
    onClose: () => void;
    title?: string;
}

export function NewKeyModal({
    apiKey,
    onClose,
    title = 'Your New API Key',
}: NewKeyModalProps) {
    const { copy, copied } = useCopyToClipboard();
    return (
        <Modal isOpen={!!apiKey} onClose={onClose} title={title} size="md">
            <div className="space-y-4">
                <div className="bg-accent-light border border-accent-gold/30 rounded-tremor-small p-3">
                    <p className="mono-value text-sm break-all text-brand-dark font-medium">
                        {apiKey}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <Text className="text-error text-sm font-medium">
                        ⚠ This key will not be shown again. Copy it now.
                    </Text>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => apiKey && copy(apiKey)}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
