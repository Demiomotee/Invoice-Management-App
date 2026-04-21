import { useState, useRef, useEffect } from 'react'
import { useInvoices } from '../context/InvoiceContext'

const statuses = ['draft', 'pending', 'paid'] as const

export default function Filter() {
  const { filter, setFilter } = useInvoices()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-3 text-xs font-bold text-dark-1 dark:text-white hover:text-gray-2 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        Filter <span className="hidden sm:inline">by status</span>
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 bg-white dark:bg-dark-2 rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.4)] p-6 flex flex-col gap-4 min-w-[192px] z-50 animate-[fadeIn_0.15s_ease]"
          role="listbox"
          aria-multiselectable="true"
        >
          {statuses.map(status => (
            <label
              key={status}
              className="flex items-center gap-3 text-xs font-bold text-dark-1 dark:text-white capitalize cursor-pointer hover:text-purple transition-colors"
            >
              <input
                type="checkbox"
                checked={filter === status}
                onChange={() => setFilter(filter === status ? 'all' : status)}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors
                ${filter === status ? 'bg-purple border-purple' : 'border-gray-1 dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-purple'}`}
              >
                {filter === status && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {status}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
