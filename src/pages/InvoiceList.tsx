import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import Filter from '../components/Filter'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'
import emptyStateImg from '../assets/empty-state.svg'

export default function InvoiceList() {
  const { filteredInvoices, invoices, filter } = useInvoices()
  const [showForm, setShowForm] = useState(false)
  const count = filteredInvoices.length

  const subtitle =
    invoices.length === 0
      ? 'No invoices'
      : filter === 'all'
      ? `There are ${count} total invoice${count !== 1 ? 's' : ''}`
      : `There ${count !== 1 ? 'are' : 'is'} ${count} ${filter} invoice${count !== 1 ? 's' : ''}`

  return (
    <div className="max-w-[780px] mx-auto px-6 py-8 md:py-14 md:px-12">

      <header className="flex items-center justify-between mb-8 md:mb-16 gap-4">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight leading-none text-dark-1 dark:text-white">
            Invoices
          </h1>
          <p className="text-[13px] text-gray-2 mt-2 md:hidden">
            {count} invoice{count !== 1 ? 's' : ''}
          </p>
          <p className="text-[13px] text-gray-2 mt-2 hidden md:block">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-6 md:gap-10">
          <Filter />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 md:gap-4 bg-purple hover:bg-purple-light transition-colors text-white rounded-[24px] pl-2 pr-4 py-2 text-xs font-bold whitespace-nowrap"
            aria-label="Create new invoice"
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11">
                <path d="M6.313 10.313V6.313h4V4.687h-4V.687H4.687v4H.687v1.626h4v4h1.626z" fill="#7C5DFA" />
              </svg>
            </span>
            New<span className="hidden sm:inline"> Invoice</span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center pt-8 md:pt-16 text-center" role="status">
          <img
            src={emptyStateImg}
            alt=""
            aria-hidden="true"
            className="w-[214px] h-[200px] object-contain"
          />
          <h2 className="text-xl font-bold text-dark-1 dark:text-white tracking-tight mt-10 mb-4">
            There is nothing here
          </h2>
          <p className="text-[13px] text-gray-2 leading-relaxed max-w-[230px]">
            {filter === 'all' ? (
              <>
                Create an invoice by clicking the{' '}
                <span className="font-bold text-dark-1 dark:text-white">New Invoice</span>{' '}
                button and get started
              </>
            ) : (
              `No ${filter} invoices found. Try a different filter.`
            )}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4" role="list" aria-label="Invoice list">
          {filteredInvoices.map((invoice, i) => (
            <li
              key={invoice.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-[slideUp_0.2s_ease_both]"
            >

              <Link
                to={`/invoice/${invoice.id}`}
                className="flex flex-col bg-white dark:bg-dark-2 rounded-invoice p-6 border border-transparent hover:border-purple transition-colors shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)] no-underline md:hidden"
                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-dark-1 dark:text-white">
                    <span className="text-purple">#</span>{invoice.id}
                  </span>
                  <span className="text-[13px] text-gray-2 truncate max-w-[160px]">
                    {invoice.clientName}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[13px] text-gray-2 mb-2">Due {formatDate(invoice.paymentDue)}</p>
                    <p className="text-base font-bold text-dark-1 dark:text-white">{formatCurrency(invoice.total)}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
              </Link>

              <Link
                to={`/invoice/${invoice.id}`}
                className="hidden md:flex items-center bg-white dark:bg-dark-2 rounded-invoice px-8 py-[18px] border border-transparent hover:border-purple transition-colors shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)] no-underline gap-4"
                aria-label={`Invoice ${invoice.id}, ${invoice.clientName}`}
              >
                <span className="w-[100px] text-xs font-bold text-dark-1 dark:text-white flex-shrink-0">
                  <span className="text-purple">#</span>{invoice.id}
                </span>
                <span className="w-[130px] text-[13px] text-gray-2 flex-shrink-0">
                  Due {formatDate(invoice.paymentDue)}
                </span>
                <span className="flex-1 min-w-0 text-[13px] text-gray-2 truncate">
                  {invoice.clientName}
                </span>
                <span className="w-[120px] text-base font-bold text-dark-1 dark:text-white text-right flex-shrink-0">
                  {formatCurrency(invoice.total)}
                </span>
                <StatusBadge status={invoice.status} />
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="flex-shrink-0" aria-hidden="true">
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
