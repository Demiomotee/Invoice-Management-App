import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'

const BackArrow = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
    <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const btnBase = 'px-6 py-4 rounded-3xl text-xs font-bold transition-colors'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoices()
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) return (
    <div className="max-w-[780px] mx-auto px-6 py-16 text-center">
      <p className="text-gray-2 mb-4">Invoice not found.</p>
      <Link to="/" className="text-purple text-sm font-bold hover:underline">Go back</Link>
    </div>
  )

  const handleDelete = () => { deleteInvoice(invoice.id); navigate('/') }

  const ActionButtons = () => (
    <div className="flex items-center gap-2" role="group" aria-label="Invoice actions">
      {invoice.status !== 'paid' && (
        <button onClick={() => setShowEdit(true)} className={`${btnBase} bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1`}>Edit</button>
      )}
      <button onClick={() => setShowDelete(true)} className={`${btnBase} bg-[#EC5757] text-white hover:bg-[#FF9797]`}>Delete</button>
      {invoice.status !== 'paid' && (
        <button onClick={() => markAsPaid(invoice.id)} className={`${btnBase} bg-purple text-white hover:bg-purple-light`}>Mark as Paid</button>
      )}
    </div>
  )

  return (
    <div className="max-w-[780px] mx-auto px-6 py-16 pb-36 md:py-14 md:px-12 md:pb-20">
      <Link to="/" className="inline-flex items-center gap-6 text-xs font-bold text-dark-1 dark:text-white hover:text-gray-2 transition-colors mb-8">
        <BackArrow /> Go back
      </Link>

      <div className="flex items-center justify-between bg-white dark:bg-dark-2 rounded-invoice px-8 py-5 mb-6 shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-gray-2">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex"><ActionButtons /></div>
      </div>

      <article className="bg-white dark:bg-dark-2 rounded-invoice p-12 max-md:p-6 shadow-[0_10px_20px_rgba(72,84,159,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between mb-8 max-md:flex-col max-md:gap-7">
          <div>
            <p className="text-base font-bold text-dark-1 dark:text-white tracking-tight">
              <span className="text-purple">#</span>{invoice.id}
            </p>
            <p className="text-[13px] text-gray-2 mt-1">{invoice.description}</p>
          </div>
          <address className="not-italic text-right text-[11px] text-gray-2 leading-loose max-md:text-left">
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </address>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12 max-md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <MetaBlock label="Invoice Date" value={formatDate(invoice.createdAt)} />
            <MetaBlock label="Payment Due" value={formatDate(invoice.paymentDue)} />
          </div>
          <div>
            <p className="text-[13px] text-gray-2 mb-3">Bill To</p>
            <p className="text-[15px] font-bold text-dark-1 dark:text-white mb-2">{invoice.clientName}</p>
            <address className="not-italic text-[11px] text-gray-2 leading-loose">
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </address>
          </div>
          <div className="max-md:col-span-2">
            <MetaBlock label="Sent To" value={invoice.clientEmail} />
          </div>
        </div>

        <div className="bg-[#F9FAFE] dark:bg-dark-3 rounded-t-invoice overflow-hidden">
          <table className="w-full" aria-label="Invoice items">
            <thead>
              <tr className="text-[11px] text-gray-2 max-md:hidden">
                <th className="text-left font-normal p-8 pb-4">Item Name</th>
                <th className="text-right font-normal p-8 pb-4">QTY.</th>
                <th className="text-right font-normal p-8 pb-4">Price</th>
                <th className="text-right font-normal p-8 pb-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="text-xs font-bold">
                  <td className="text-dark-1 dark:text-white p-4 pl-8">{item.name}</td>
                  <td className="text-gray-2 text-right p-4">{item.quantity}</td>
                  <td className="text-gray-2 text-right p-4">{formatCurrency(item.price)}</td>
                  <td className="text-dark-1 dark:text-white text-right p-4 pr-8">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#373B53] dark:bg-dark-4 rounded-b-invoice flex justify-between items-center px-8 py-6">
          <p className="text-[13px] text-white">Amount Due</p>
          <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(invoice.total)}</p>
        </div>
      </article>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-2 px-6 py-5 flex justify-end gap-2 shadow-[-4px_0_20px_rgba(0,0,0,0.1)] z-50">
        <ActionButtons />
      </div>

      {showDelete && <DeleteModal invoiceId={invoice.id} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />}
      {showEdit && <InvoiceForm invoice={invoice} onClose={() => setShowEdit(false)} />}
    </div>
  )
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-gray-2 mb-2">{label}</p>
      <p className="text-[15px] font-bold text-dark-1 dark:text-white tracking-tight">{value}</p>
    </div>
  )
}
