import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate } from '../utils/formatters'
import './InvoiceDetail.css'

const BackArrow = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoices()
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) {
    return (
      <div className="detail-page">
        <div className="not-found">
          <p>Invoice not found.</p>
          <Link to="/" className="back-link">
            <BackArrow /> Go back
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate('/')
  }

  const handleMarkPaid = () => {
    markAsPaid(invoice.id)
  }

  return (
    <div className="detail-page">
      <Link to="/" className="back-link" aria-label="Go back to invoice list">
        <BackArrow />
        <span>Go back</span>
      </Link>

      <div className="detail-status-bar">
        <div className="detail-status-left">
          <span className="detail-status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="detail-actions desktop-actions" role="group" aria-label="Invoice actions">
          {invoice.status !== 'paid' && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowEdit(true)}
              aria-label="Edit invoice"
            >
              Edit
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={() => setShowDelete(true)}
            aria-label={`Delete invoice ${invoice.id}`}
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              className="btn btn-primary"
              onClick={handleMarkPaid}
              aria-label="Mark invoice as paid"
            >
              Mark as Paid
            </button>
          )}
          {invoice.status === 'draft' && (
            <button
              className="btn btn-primary"
              onClick={handleMarkPaid}
              aria-label="Mark invoice as paid"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>


      <article className="detail-card" aria-label={`Invoice ${invoice.id} details`}>
        <div className="detail-top">
          <div>
            <p className="detail-id">
              <span className="detail-id-hash" aria-hidden="true">#</span>
              {invoice.id}
            </p>
            <p className="detail-desc">{invoice.description}</p>
          </div>
          <address className="detail-sender-address">
            <span>{invoice.senderAddress?.street}</span>
            <span>{invoice.senderAddress?.city}</span>
            <span>{invoice.senderAddress?.postCode}</span>
            <span>{invoice.senderAddress?.country}</span>
          </address>
        </div>

        <div className="detail-meta">
          <div className="detail-meta-col">
            <div>
              <p className="detail-label">Invoice Date</p>
              <p className="detail-value">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="detail-label">Payment Due</p>
              <p className="detail-value">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>
          <div className="detail-meta-col">
            <p className="detail-label">Bill To</p>
            <p className="detail-value">{invoice.clientName}</p>
            <address className="detail-client-address">
              <span>{invoice.clientAddress?.street}</span>
              <span>{invoice.clientAddress?.city}</span>
              <span>{invoice.clientAddress?.postCode}</span>
              <span>{invoice.clientAddress?.country}</span>
            </address>
          </div>
          <div className="detail-meta-col">
            <p className="detail-label">Sent To</p>
            <p className="detail-value">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="detail-items">
          <table className="items-table" aria-label="Invoice items">
            <thead className="items-thead">
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col" className="text-right">QTY.</th>
                <th scope="col" className="text-right">Price</th>
                <th scope="col" className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="item-row">
                  <td className="item-name">{item.name}</td>
                  <td className="item-qty text-right">{item.quantity}</td>
                  <td className="item-price text-right">{formatCurrency(item.price)}</td>
                  <td className="item-total text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="items-total">
            <p className="items-total-label">Amount Due</p>
            <p className="items-total-amount">{formatCurrency(invoice.total)}</p>
          </div>
        </div>
      </article>

  
      <div className="mobile-actions" role="group" aria-label="Invoice actions">
        {invoice.status !== 'paid' && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>
        )}
        <button
          className="btn btn-danger"
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
        {(invoice.status === 'pending' || invoice.status === 'draft') && (
          <button
            className="btn btn-primary"
            onClick={handleMarkPaid}
          >
            Mark as Paid
          </button>
        )}
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <InvoiceForm
          invoice={invoice}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}
