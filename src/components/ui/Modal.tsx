import { useEffect, useRef, type ReactNode } from 'react';
import { clsx } from 'clsx';

const SIZES = {
    sm: 'max-w-[400px]',
    md: 'max-w-[560px]',
    lg: 'max-w-[720px]',
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    footer,
    className,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) panelRef.current?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-hidden={!isOpen}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                className={clsx(
                    'bg-white rounded-tremor-default shadow-tremor-dropdown w-full outline-none',
                    'transition-all duration-200 ease-out',
                    SIZES[size],
                    className,
                )}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-brand-dark"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-accent rounded p-1"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4">{children}</div>

                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
