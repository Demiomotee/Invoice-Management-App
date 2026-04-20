import { useState, useEffect, useRef } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import './InvoiceForm.css'

const TrashIcon = () => (
  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11.583 3.556h-2.11l-.554-1.762A1 1 0 007.964 1H5.036a1 1 0 00-.955.794L3.527 3.556H1.417A.417.417 0 001 3.972v.417c0 .23.187.417.417.417h.416v8.68a1.25 1.25 0 001.25 1.25h6.834a1.25 1.25 0 001.25-1.25v-8.68h.416A.417.417 0 0012 4.389v-.417a.417.417 0 00-.417-.416zm-6.64-1.39h2.114l.38 1.39H4.563l.38-1.39zM9.75 13.069H3.25V4.806h6.5v8.263z" fill="currentColor"/>
  </svg>
)

const EMPTY_ITEM = { name: '', quantity: 1, price: 0, total: 0 }

const TERMS_OPTIONS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

function validate(data) {
  const errors = {}

  if (!data.senderAddress?.street?.trim()) errors.senderStreet = 'Required'
  if (!data.senderAddress?.city?.trim()) errors.senderCity = 'Required'
  if (!data.senderAddress?.postCode?.trim()) errors.senderPostCode = 'Required'
  if (!data.senderAddress?.country?.trim()) errors.senderCountry = 'Required'

  if (!data.clientName?.trim()) errors.clientName = "Client's name can't be empty"
  if (!data.clientEmail?.trim()) {
    errors.clientEmail = "Client's email can't be empty"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    errors.clientEmail = 'Must be a valid email'
  }

  if (!data.clientAddress?.street?.trim()) errors.clientStreet = 'Required'
  if (!data.clientAddress?.city?.trim()) errors.clientCity = 'Required'
  if (!data.clientAddress?.postCode?.trim()) errors.clientPostCode = 'Required'
  if (!data.clientAddress?.country?.trim()) errors.clientCountry = 'Required'

  if (!data.createdAt) errors.createdAt = 'Required'
  if (!data.description?.trim()) errors.description = "Description can't be empty"

  if (!data.items || data.items.length === 0) {
    errors.items = 'An item must be added'
  } else {
    const itemErrors = data.items.map(item => {
      const e = {}
      if (!item.name?.trim()) e.name = "Name can't be empty"
      if (!item.quantity || item.quantity < 1) e.quantity = 'Min 1'
      if (item.price === '' || item.price === undefined || item.price < 0) e.price = 'Must be positive'
      return e
    })
    if (itemErrors.some(e => Object.keys(e).length > 0)) {
      errors.itemErrors = itemErrors
    }
  }

  return errors
}

export default function InvoiceForm({ invoice = null, onClose }) {
  const { addInvoice, updateInvoice } = useInvoices()
  const isEditing = !!invoice
  const overlayRef = useRef(null)
  const firstInputRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientName: '',
    clientEmail: '',
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    createdAt: today,
    paymentTerms: 30,
    description: '',
    items: [{ ...EMPTY_ITEM }],
    ...(invoice || {})
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    firstInputRef.current?.focus()

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])


  useEffect(() => {
    if (submitted) {
      setErrors(validate(form))
    }
  }, [form, submitted])

  const set = (path, value) => {
    setForm(prev => {
      const parts = path.split('.')
      if (parts.length === 1) return { ...prev, [path]: value }
      return {
        ...prev,
        [parts[0]]: { ...prev[parts[0]], [parts[1]]: value }
      }
    })
  }

  const setItem = (index, field, value) => {
    setForm(prev => {
      const items = prev.items.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          updated.total = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.price) || 0)
        }
        return updated
      })
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }))
  }

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleSaveDraft = () => {
    addInvoice(form, true)
    onClose()
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (isEditing) {
      updateInvoice({ ...invoice, ...form })
    } else {
      addInvoice(form, false)
    }
    onClose()
  }

  const fieldClass = (errKey) => `form-field${errors[errKey] ? ' form-field--error' : ''}`

  return (
    <div
      className="form-overlay"
      ref={overlayRef}
      role="presentation"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className="form-panel"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${invoice.id}` : 'Create New Invoice'}
      >
        <div className="form-scroll">
          <h2 className="form-title">
            {isEditing
              ? <>Edit <span className="form-title-hash">#</span>{invoice.id}</>
              : 'New Invoice'
            }
          </h2>


          <fieldset className="form-section">
            <legend className="form-section-title">Bill From</legend>
            <div className={fieldClass('senderStreet')}>
              <div className="form-field-header">
                <label htmlFor="senderStreet">Street Address</label>
                {errors.senderStreet && <span className="form-error" role="alert">{errors.senderStreet}</span>}
              </div>
              <input
                id="senderStreet"
                type="text"
                ref={firstInputRef}
                value={form.senderAddress.street}
                onChange={e => set('senderAddress.street', e.target.value)}
                aria-invalid={!!errors.senderStreet}
                aria-describedby={errors.senderStreet ? 'err-senderStreet' : undefined}
              />
            </div>
            <div className="form-row three-col">
              <div className={fieldClass('senderCity')}>
                <div className="form-field-header">
                  <label htmlFor="senderCity">City</label>
                  {errors.senderCity && <span className="form-error">{errors.senderCity}</span>}
                </div>
                <input id="senderCity" type="text" value={form.senderAddress.city} onChange={e => set('senderAddress.city', e.target.value)} aria-invalid={!!errors.senderCity} />
              </div>
              <div className={fieldClass('senderPostCode')}>
                <div className="form-field-header">
                  <label htmlFor="senderPostCode">Post Code</label>
                  {errors.senderPostCode && <span className="form-error">{errors.senderPostCode}</span>}
                </div>
                <input id="senderPostCode" type="text" value={form.senderAddress.postCode} onChange={e => set('senderAddress.postCode', e.target.value)} aria-invalid={!!errors.senderPostCode} />
              </div>
              <div className={`${fieldClass('senderCountry')} full-on-mobile`}>
                <div className="form-field-header">
                  <label htmlFor="senderCountry">Country</label>
                  {errors.senderCountry && <span className="form-error">{errors.senderCountry}</span>}
                </div>
                <input id="senderCountry" type="text" value={form.senderAddress.country} onChange={e => set('senderAddress.country', e.target.value)} aria-invalid={!!errors.senderCountry} />
              </div>
            </div>
          </fieldset>


          <fieldset className="form-section">
            <legend className="form-section-title">Bill To</legend>
            <div className={fieldClass('clientName')}>
              <div className="form-field-header">
                <label htmlFor="clientName">Client's Name</label>
                {errors.clientName && <span className="form-error" role="alert">{errors.clientName}</span>}
              </div>
              <input id="clientName" type="text" value={form.clientName} onChange={e => set('clientName', e.target.value)} aria-invalid={!!errors.clientName} />
            </div>
            <div className={fieldClass('clientEmail')}>
              <div className="form-field-header">
                <label htmlFor="clientEmail">Client's Email</label>
                {errors.clientEmail && <span className="form-error" role="alert">{errors.clientEmail}</span>}
              </div>
              <input id="clientEmail" type="email" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} aria-invalid={!!errors.clientEmail} placeholder="e.g. email@example.com" />
            </div>
            <div className={fieldClass('clientStreet')}>
              <div className="form-field-header">
                <label htmlFor="clientStreet">Street Address</label>
                {errors.clientStreet && <span className="form-error">{errors.clientStreet}</span>}
              </div>
              <input id="clientStreet" type="text" value={form.clientAddress.street} onChange={e => set('clientAddress.street', e.target.value)} aria-invalid={!!errors.clientStreet} />
            </div>
            <div className="form-row three-col">
              <div className={fieldClass('clientCity')}>
                <div className="form-field-header">
                  <label htmlFor="clientCity">City</label>
                  {errors.clientCity && <span className="form-error">{errors.clientCity}</span>}
                </div>
                <input id="clientCity" type="text" value={form.clientAddress.city} onChange={e => set('clientAddress.city', e.target.value)} aria-invalid={!!errors.clientCity} />
              </div>
              <div className={fieldClass('clientPostCode')}>
                <div className="form-field-header">
                  <label htmlFor="clientPostCode">Post Code</label>
                  {errors.clientPostCode && <span className="form-error">{errors.clientPostCode}</span>}
                </div>
                <input id="clientPostCode" type="text" value={form.clientAddress.postCode} onChange={e => set('clientAddress.postCode', e.target.value)} aria-invalid={!!errors.clientPostCode} />
              </div>
              <div className={`${fieldClass('clientCountry')} full-on-mobile`}>
                <div className="form-field-header">
                  <label htmlFor="clientCountry">Country</label>
                  {errors.clientCountry && <span className="form-error">{errors.clientCountry}</span>}
                </div>
                <input id="clientCountry" type="text" value={form.clientAddress.country} onChange={e => set('clientAddress.country', e.target.value)} aria-invalid={!!errors.clientCountry} />
              </div>
            </div>
          </fieldset>


          <fieldset className="form-section">
            <legend className="sr-only">Invoice Details</legend>
            <div className="form-row two-col">
              <div className={fieldClass('createdAt')}>
                <div className="form-field-header">
                  <label htmlFor="createdAt">Invoice Date</label>
                  {errors.createdAt && <span className="form-error">{errors.createdAt}</span>}
                </div>
                <input
                  id="createdAt"
                  type="date"
                  value={form.createdAt}
                  onChange={e => set('createdAt', e.target.value)}
                  aria-invalid={!!errors.createdAt}
                  disabled={isEditing}
                />
              </div>
              <div className="form-field">
                <div className="form-field-header">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                </div>
                <select
                  id="paymentTerms"
                  value={form.paymentTerms}
                  onChange={e => set('paymentTerms', parseInt(e.target.value))}
                >
                  {TERMS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={fieldClass('description')}>
              <div className="form-field-header">
                <label htmlFor="description">Project Description</label>
                {errors.description && <span className="form-error" role="alert">{errors.description}</span>}
              </div>
              <input id="description" type="text" value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. Graphic Design Service" aria-invalid={!!errors.description} />
            </div>
          </fieldset>


          <div className="form-items-section">
            <h3 className="form-items-title">Item List</h3>

            {form.items.length > 0 && (
              <div className="items-header" aria-hidden="true">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>
            )}

            {form.items.map((item, i) => {
              const itemErr = errors.itemErrors?.[i] || {}
              return (
                <div key={i} className="item-row-form" role="group" aria-label={`Item ${i + 1}`}>
                  <div className={`form-field item-name-field${itemErr.name ? ' form-field--error' : ''}`}>
                    <label htmlFor={`item-name-${i}`} className="mobile-label">Item Name</label>
                    <input
                      id={`item-name-${i}`}
                      type="text"
                      value={item.name}
                      onChange={e => setItem(i, 'name', e.target.value)}
                      placeholder="Item name"
                      aria-invalid={!!itemErr.name}
                    />
                    {itemErr.name && <span className="form-error">{itemErr.name}</span>}
                  </div>
                  <div className={`form-field item-qty-field${itemErr.quantity ? ' form-field--error' : ''}`}>
                    <label htmlFor={`item-qty-${i}`} className="mobile-label">Qty.</label>
                    <input
                      id={`item-qty-${i}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => setItem(i, 'quantity', e.target.value)}
                      aria-invalid={!!itemErr.quantity}
                    />
                  </div>
                  <div className={`form-field item-price-field${itemErr.price ? ' form-field--error' : ''}`}>
                    <label htmlFor={`item-price-${i}`} className="mobile-label">Price</label>
                    <input
                      id={`item-price-${i}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={e => setItem(i, 'price', e.target.value)}
                      aria-invalid={!!itemErr.price}
                    />
                  </div>
                  <div className="item-total-display">
                    <span className="mobile-label">Total</span>
                    <span className="item-total-value" aria-label={`Total: ${item.total.toFixed(2)}`}>
                      {item.total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="item-delete-btn"
                    onClick={() => removeItem(i)}
                    aria-label={`Remove item ${item.name || i + 1}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )
            })}

            {errors.items && (
              <p className="form-error form-error-items" role="alert">{errors.items}</p>
            )}

            
            <button
              type="button"
              className="btn-add-item"
              onClick={addItem}
            >
              + Add New Item
            </button>
          </div>


          {submitted && Object.keys(errors).length > 0 && (
            <div className="form-error-summary" role="alert" aria-live="assertive">
              <p>- All fields must be added</p>
              {errors.items && <p>- {errors.items}</p>}
            </div>
          )}
        </div>

   
        <div className="form-footer">
          {!isEditing ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Discard</button>
              <div className="form-footer-right">
                <button type="button" className="btn btn-dark" onClick={handleSaveDraft}>Save as Draft</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save &amp; Send</button>
              </div>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
