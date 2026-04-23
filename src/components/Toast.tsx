import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

interface Props {
  toasts: ToastMessage[]
  removeToast: (id: string) => void
}

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#33D69F" opacity="0.2"/>
      <path d="M4.5 8L7 10.5L11.5 5.5" stroke="#33D69F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#EC5757" opacity="0.2"/>
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#EC5757" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#7C5DFA" opacity="0.2"/>
      <path d="M8 7v4M8 5.5v.5" stroke="#7C5DFA" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

const colors = {
  success: { bar: '#33D69F', text: '#33D69F' },
  error:   { bar: '#EC5757', text: '#EC5757' },
  info:    { bar: '#7C5DFA', text: '#7C5DFA' },
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    const leaveTimer = setTimeout(() => {
      setLeaving(true)
      setTimeout(onRemove, 300)
    }, 3200)

    return () => clearTimeout(leaveTimer)
  }, [onRemove])

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={() => { setLeaving(true); setTimeout(onRemove, 300) }}
      style={{
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
      }}
      className="relative flex items-start gap-3 bg-white dark:bg-dark-2 rounded-lg px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer overflow-hidden min-w-[260px] max-w-[320px]"
    >

      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: colors[toast.type].bar }}
      />

  
      <div className="mt-0.5 flex-shrink-0 pl-1">
        {icons[toast.type]}
      </div>


      <p className="text-[13px] font-bold text-dark-1 dark:text-white leading-snug pr-2">
        {toast.message}
      </p>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: colors[toast.type].bar, opacity: 0.3 }}
      />
      <div
        className="absolute bottom-0 left-0 h-0.5"
        style={{
          backgroundColor: colors[toast.type].bar,
          animation: 'toast-progress 3.2s linear forwards',
        }}
      />
    </div>
  )
}

export default function ToastContainer({ toasts, removeToast }: Props) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 items-end"
      aria-label="Notifications"
    >
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}
