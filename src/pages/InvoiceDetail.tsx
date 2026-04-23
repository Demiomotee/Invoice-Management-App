import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import { useToast } from '../context/ToastContext'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'

const BackArrow = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
    <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const btnBase = 'px-5 md:px-6 py-4 rounded-3xl text-xs font-bold transition-colors whitespace-nowrap'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoices()
  const { showToast } = useToast()
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit]   = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) return (
    <div className="max-w-[780px] mx-auto px-6 py-16 text-center">
      <p className="text-gray-2 mb-4">Invoice not found.</p>
      <Link to="/" className="text-purple text-sm font-bold hover:underline">Go back</Link>
    </div>
  )

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    showToast(`Invoice #${invoice.id} deleted`, 'error')
    navigate('/')
  }

  const handleMarkPaid = () => {
    markAsPaid(invoice.id)
    showToast(`Invoice #${invoice.id} marked as paid`, 'success')
  }

  const ActionButtons = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Invoice actions">
      {invoice.status !== 'paid' && (
        <button onClick={() => setShowEdit(true)} className={`${btnBase} bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1`}>Edit</button>
      )}
      <button onClick={() => setShowDelete(true)} className={`${btnBase} bg-[#EC5757] text-white hover:bg-[#FF9797]`}>Delete</button>
      {invoice.status !== 'paid' && (
        <button onClick={handleMarkPaid} className={`${btnBase} bg-purple text-white hover:bg-purple-light`}>Mark as Paid</button>
      )}
    </div>
  )

  return (
    <div className="max-w-[780px] mx-auto px-6 pb-28 md:pb-8 py-8 md:py-12 lg:py-[72px] md:px-12">
      <Link to="/" className="inline-flex items-center gap-6 text-xs font-bold text-dark-1 dark:text-white hover:text-gray-2 transition-colors mb-8">
        <BackArrow /> Go back
      </Link>

      <div className="flex items-center justify-between bg-white dark:bg-dark-2 rounded-invoice px-6 md:px-8 py-5 mb-4 shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto justify-between md:justify-start">
          <span className="text-[13px] text-gray-2">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex"><ActionButtons /></div>
      </div>

      <article className="bg-white dark:bg-dark-2 rounded-invoice p-6 md:p-8 lg:p-12 shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row md:justify-between gap-7 mb-8">
          <div>
            <p className="text-base font-bold text-dark-1 dark:text-white tracking-tight">
              <span className="text-purple">#</span>{invoice.id}
            </p>
            <p className="text-[13px] text-gray-2 mt-1">{invoice.description}</p>
          </div>
          <address className="not-italic text-[13px] text-gray-2 leading-loose md:text-right">
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </address>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 mb-10 md:mb-12">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[13px] text-gray-2 mb-2">Invoice Date</p>
              <p className="text-[15px] font-bold text-dark-1 dark:text-white">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-2 mb-2">Payment Due</p>
              <p className="text-[15px] font-bold text-dark-1 dark:text-white">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>
          <div>
            <p className="text-[13px] text-gray-2 mb-3">Bill To</p>
            <p className="text-[15px] font-bold text-dark-1 dark:text-white mb-2">{invoice.clientName}</p>
            <address className="not-italic text-[13px] text-gray-2 leading-loose">
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </address>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-[13px] text-gray-2 mb-2">Sent To</p>
            <p className="text-[15px] font-bold text-dark-1 dark:text-white break-all">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="bg-[#F9FAFE] dark:bg-dark-3 rounded-t-invoice">
          <div className="hidden md:grid grid-cols-[1fr_64px_120px_120px] gap-4 px-8 pt-8 pb-4 text-[13px] text-gray-2">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>
          {invoice.items.map((item, i) => (
            <div key={i} className="px-6 md:px-8 py-4 md:py-0 md:grid md:grid-cols-[1fr_64px_120px_120px] md:gap-4 md:pb-8">
              <div className="flex items-center justify-between md:contents">
                <div>
                  <p className="text-xs font-bold text-dark-1 dark:text-white">{item.name}</p>
                  <p className="text-xs font-bold text-gray-2 mt-1 md:hidden">{item.quantity} × {formatCurrency(item.price)}</p>
                </div>
                <p className="text-xs font-bold text-dark-1 dark:text-white md:hidden">{formatCurrency(item.total)}</p>
                <p className="hidden md:block text-xs font-bold text-gray-2 text-center">{item.quantity}</p>
                <p className="hidden md:block text-xs font-bold text-gray-2 text-right">{formatCurrency(item.price)}</p>
                <p className="hidden md:block text-xs font-bold text-dark-1 dark:text-white text-right">{formatCurrency(item.total)}</p>
              </div>
              {i < invoice.items.length - 1 && <div className="border-t border-gray-1 dark:border-dark-2 mt-4 md:hidden" />}
            </div>
          ))}
        </div>
        <div className="bg-[#373B53] dark:bg-dark-4 rounded-b-invoice flex justify-between items-center px-6 md:px-8 py-6 md:py-8">
          <p className="text-[13px] text-white">Amount Due</p>
          <p className="text-2xl md:text-[28px] font-bold text-white tracking-tight">{formatCurrency(invoice.total)}</p>
        </div>
      </article>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-2 px-6 py-5 flex items-center justify-end gap-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <ActionButtons />
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
      {showEdit && <InvoiceForm invoice={invoice} onClose={() => setShowEdit(false)} />}
    </div>
  )
}
E
