import { useEffect, useRef } from 'react'

interface Props {
  invoiceId: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ invoiceId, onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCancel(); return }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-6 animate-[fadeIn_0.15s_ease]"
      onClick={e => e.target === e.currentTarget && onCancel()}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        className="bg-white dark:bg-dark-2 rounded-lg p-12 max-w-[480px] w-full animate-[slideUp_0.2s_ease]"
      >
        <h2 id="modal-title" className="text-2xl font-bold text-dark-1 dark:text-white tracking-tight mb-3">
          Confirm Deletion
        </h2>
        <p id="modal-desc" className="text-[13px] text-gray-2 leading-relaxed mb-6">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-6 py-4 rounded-3xl text-xs font-bold bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-4 rounded-3xl text-xs font-bold bg-[#EC5757] text-white hover:bg-[#FF9797] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
