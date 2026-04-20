import { useState, useRef, useEffect } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import './Filter.css'

const ChevronIcon = ({ open }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>
    <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const statuses = ['draft', 'pending', 'paid']

export default function Filter() {
  const { filter, setFilter } = useInvoices()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedFilters = filter === 'all' ? [] : [filter]

  const toggleStatus = (status) => {
    if (filter === status) {
      setFilter('all')
    } else {
      setFilter(status)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className="filter" ref={dropdownRef}>
      <button
        className="filter-toggle"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Filter by status"
      >
        <span className="filter-label">
          Filter <span className="filter-label-full">by status</span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          className="filter-dropdown"
          role="listbox"
          aria-label="Filter options"
          aria-multiselectable="true"
        >
          {statuses.map(status => (
            <label key={status} className="filter-option" role="option" aria-selected={selectedFilters.includes(status)}>
              <input
                type="checkbox"
                checked={selectedFilters.includes(status)}
                onChange={() => toggleStatus(status)}
                aria-label={`Filter by ${status}`}
              />
              <span className="checkbox-custom" aria-hidden="true">
                {selectedFilters.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="filter-option-label">{status}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
