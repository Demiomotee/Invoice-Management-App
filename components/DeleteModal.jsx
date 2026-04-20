import { useEffect, useRef } from 'react'
import './DeleteModal.css'

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    cancelBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable?.[0]
        const last = focusable?.[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="modal-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        ref={modalRef}
      >
        <h2 id="modal-title" className="modal-title">Confirm Deletion</h2>
        <p id="modal-desc" className="modal-desc">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            ref={cancelBtnRef}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
