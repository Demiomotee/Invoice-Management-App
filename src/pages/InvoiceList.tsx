import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import Filter from '../components/Filter'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function InvoiceList() {
  const { filteredInvoices, invoices, filter } = useInvoices()
  const [showForm, setShowForm] = useState(false)
  const count = filteredInvoices.length

  const subtitle = invoices.length === 0
    ? 'No invoices'
    : filter === 'all'
      ? `There are ${count} total invoice${count !== 1 ? 's' : ''}`
      : `There ${count !== 1 ? 'are' : 'is'} ${count} ${filter} invoice${count !== 1 ? 's' : ''}`

  return (
    <div className="max-w-[780px] mx-auto px-6 py-8 md:py-12 lg:py-[72px] md:px-12">


      <header className="flex items-center justify-between mb-8 md:mb-14 gap-4">
        <div>
          <h1 className="text-2xl md:text-[36px] font-bold text-dark-1 dark:text-white tracking-tight leading-none">
            Invoices
          </h1>
          <p className="text-[13px] text-gray-2 mt-1.5 md:hidden">
            {count} invoice{count !== 1 ? 's' : ''}
          </p>

          <p className="text-[13px] text-gray-2 mt-1.5 hidden md:block">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <Filter />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 md:gap-4 bg-purple hover:bg-purple-light transition-colors text-white rounded-3xl pl-2 pr-3 md:pr-4 py-2 text-xs font-bold"
            aria-label="Create new invoice"
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11">
                <path d="M6.313 10.313V6.313h4V4.687h-4V.687H4.687v4H.687v1.626h4v4h1.626z" fill="#7C5DFA" />
              </svg>
            </span>
            <span>
              New <span className="hidden sm:inline">Invoice</span>
            </span>
          </button>
        </div>
      </header>


      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center pt-16 text-center" role="status">
          <svg width="242" height="200" viewBox="0 0 242 200" fill="none" aria-hidden="true">
            <ellipse cx="121" cy="187.5" rx="121" ry="12.5" fill="#DFE3FA" opacity="0.3" />
            <circle cx="121" cy="96" r="80" fill="white" className="dark:fill-dark-2" />
            <path d="M96 76h50a6 6 0 016 6v38a6 6 0 01-6 6H96a6 6 0 01-6-6V82a6 6 0 016-6z" fill="#7C5DFA" opacity="0.15" />
            <rect x="100" y="88" width="32" height="4" rx="2" fill="#7C5DFA" opacity="0.3" />
            <rect x="100" y="98" width="42" height="4" rx="2" fill="#888EB0" opacity="0.3" />
            <rect x="100" y="108" width="36" height="4" rx="2" fill="#888EB0" opacity="0.3" />
          </svg>
          <h2 className="text-xl font-bold text-dark-1 dark:text-white tracking-tight mt-10 mb-6">
            There is nothing here
          </h2>
          <p className="text-[13px] text-gray-2 leading-relaxed max-w-[220px]">
            {filter === 'all'
              ? 'Create an invoice by clicking the New Invoice button and get started.'
              : `No ${filter} invoices found. Try a different filter.`}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4" role="list" aria-label="Invoice list">
          {filteredInvoices.map((invoice, i) => (
            <li key={invoice.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-[slideUp_0.2s_ease_both]">

              <Link
                to={`/invoice/${invoice.id}`}
                className="block bg-white dark:bg-dark-2 rounded-invoice p-6 border border-transparent hover:border-purple transition-colors shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)] no-underline md:hidden"
                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, due ${formatDate(invoice.paymentDue)}, ${formatCurrency(invoice.total)}, status: ${invoice.status}`}
              >

                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-dark-1 dark:text-white">
                    <span className="text-purple">#</span>{invoice.id}
                  </span>
                  <span className="text-[13px] text-gray-2">{invoice.clientName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-gray-2 mb-2">Due {formatDate(invoice.paymentDue)}</p>
                    <p className="text-base font-bold text-dark-1 dark:text-white">{formatCurrency(invoice.total)}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
              </Link>


              <Link
                to={`/invoice/${invoice.id}`}
                className="hidden md:grid items-center gap-5 grid-cols-[100px_1fr_auto_auto_auto_24px] bg-white dark:bg-dark-2 rounded-invoice px-8 py-5 border border-transparent hover:border-purple transition-colors shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)] no-underline"
                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, due ${formatDate(invoice.paymentDue)}, ${formatCurrency(invoice.total)}, status: ${invoice.status}`}
              >
                <span className="text-xs font-bold text-dark-1 dark:text-white">
                  <span className="text-purple">#</span>{invoice.id}
                </span>
                <span className="text-[13px] text-gray-2">Due {formatDate(invoice.paymentDue)}</span>
                <span className="text-[13px] text-gray-2">{invoice.clientName}</span>
                <span className="text-base font-bold text-dark-1 dark:text-white text-right">{formatCurrency(invoice.total)}</span>
                <StatusBadge status={invoice.status} />
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
                  <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

            </li>
          ))}
        </ul>
      )}

      {showForm && <InvoiceForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
