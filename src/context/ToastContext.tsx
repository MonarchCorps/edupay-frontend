import { createContext, useCallback, useState, type ReactNode } from 'react'
import type { Toast, ToastType } from '../types'

interface ToastInput {
  type?: ToastType
  message: string
  duration?: number
}

interface ToastContextValue {
  toast: (input: ToastInput) => void
  toasts: Toast[]
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ type = 'info', message, duration = 4000 }: ToastInput) => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <ToastList toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-green-600',
  error:   'bg-red-600',
  warning: 'bg-yellow-500',
  info:    'bg-brand-mid',
}

interface ToastListProps {
  toasts: Toast[]
  dismiss: (id: number) => void
}

function ToastList({ toasts, dismiss }: ToastListProps) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-tremor-default text-white text-sm font-medium shadow-tremor-dropdown ${TOAST_STYLES[t.type] ?? TOAST_STYLES.info}`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-white/80 hover:text-white flex-shrink-0"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
