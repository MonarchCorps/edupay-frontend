import { useEffect, useRef, useState, type ReactNode } from 'react';
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
    const [rendered, setRendered] = useState(isOpen);
    const [visible, setVisible] = useState(false);

    // Mount immediately on open — derived during render rather than in an
    // effect, since it's just adjusting state in response to a prop change.
    if (isOpen && !rendered) {
        setRendered(true);
    }

    // Keep the modal mounted briefly on close so the exit transition can
    // play, and flip `visible` a frame after mount so the enter transition
    // starts from its initial (hidden) state rather than snapping in.
    useEffect(() => {
        if (isOpen) {
            const raf = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(raf);
        }
        const hide = requestAnimationFrame(() => setVisible(false));
        const timeout = setTimeout(() => setRendered(false), 150);
        return () => {
            cancelAnimationFrame(hide);
            clearTimeout(timeout);
        };
    }, [isOpen]);

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

    if (!rendered) return null;

    return (
        <div
            className={clsx(
                'fixed inset-0 bg-[#0B211D]/55 z-50 flex items-center justify-center p-4',
                'transition-opacity duration-150 ease-out',
                visible ? 'opacity-100' : 'opacity-0',
            )}
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
                    'bg-[#FAF7F0] rounded-tremor-default shadow-tremor-dropdown w-full outline-none',
                    'transition-all duration-150 ease-out',
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                    SIZES[size],
                    className,
                )}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-teal-mid/10">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-brand-dark"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-teal-mid/50 hover:text-teal-mid focus-visible:ring-2 focus-visible:ring-accent-gold rounded p-1 transition-colors"
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
                    <div className="px-6 py-4 border-t border-teal-mid/10 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
