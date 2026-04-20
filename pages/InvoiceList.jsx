import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import Filter from '../components/Filter'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'
import './InvoiceList.css'

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.313 10.313V6.313h4V4.687h-4V.687H4.687v4H.687v1.626h4v4h1.626z" fill="white"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EmptyIllustration = () => (
  <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="121" cy="187.5" rx="121" ry="12.5" fill="var(--bg-card)" opacity="0.5"/>
    <circle cx="121" cy="96" r="80" fill="var(--bg-card)"/>
    <path d="M96 76h50a6 6 0 016 6v38a6 6 0 01-6 6H96a6 6 0 01-6-6V82a6 6 0 016-6z" fill="var(--clr-purple)" opacity="0.3"/>
    <rect x="100" y="88" width="32" height="4" rx="2" fill="var(--clr-purple)" opacity="0.5"/>
    <rect x="100" y="98" width="42" height="4" rx="2" fill="var(--clr-gray-3)" opacity="0.4"/>
    <rect x="100" y="108" width="36" height="4" rx="2" fill="var(--clr-gray-3)" opacity="0.4"/>
    <circle cx="160" cy="68" r="12" fill="var(--clr-red)" opacity="0.3"/>
    <path d="M156 68h8M160 64v8" stroke="var(--clr-red)" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
  </svg>
)

export default function InvoiceList() {
  const { filteredInvoices, invoices, filter } = useInvoices()
  const [showForm, setShowForm] = useState(false)

  const count = filteredInvoices.length

  const getSubtitle = () => {
    if (invoices.length === 0) return 'No invoices'
    if (filter === 'all') return `There are ${count} total invoice${count !== 1 ? 's' : ''}`
    return `There ${count !== 1 ? 'are' : 'is'} ${count} ${filter} invoice${count !== 1 ? 's' : ''}`
  }

  return (
    <div className="invoice-list-page">
      <header className="list-header">
        <div className="list-header-left">
          <h1 className="list-title">Invoices</h1>
          <p className="list-subtitle">{getSubtitle()}</p>
        </div>
        <div className="list-header-right">
          <Filter />
          <button
            className="btn-new-invoice"
            onClick={() => setShowForm(true)}
            aria-label="Create new invoice"
          >
            <span className="btn-new-icon" aria-hidden="true">
              <PlusIcon />
            </span>
            New <span className="btn-new-full">Invoice</span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <div className="empty-state" role="status">
          <EmptyIllustration />
          <h2 className="empty-title">There is nothing here</h2>
          <p className="empty-desc">
            {filter === 'all'
              ? 'Create an invoice by clicking the New Invoice button and get started.'
              : `No ${filter} invoices found. Try a different filter.`}
          </p>
        </div>
      ) : (
        <ul className="invoice-list" role="list" aria-label="Invoice list">
          {filteredInvoices.map((invoice) => (
            <li key={invoice.id} className="invoice-card-wrapper">
              <Link
                to={`/invoice/${invoice.id}`}
                className="invoice-card"
                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, due ${formatDate(invoice.paymentDue)}, ${formatCurrency(invoice.total)}, status: ${invoice.status}`}
              >
                <span className="invoice-id">
                  <span className="invoice-id-hash" aria-hidden="true">#</span>
                  {invoice.id}
                </span>
                <span className="invoice-due">Due {formatDate(invoice.paymentDue)}</span>
                <span className="invoice-client">{invoice.clientName}</span>
                <span className="invoice-amount">{formatCurrency(invoice.total)}</span>
                <StatusBadge status={invoice.status} />
                <span className="invoice-arrow" aria-hidden="true"><ChevronRight /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <InvoiceForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
