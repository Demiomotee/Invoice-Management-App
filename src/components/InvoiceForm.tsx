import { useState, useEffect, useRef } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import type { Invoice, InvoiceItem, InvoiceFormData } from '../context/InvoiceContext'

interface Props {
  invoice?: Invoice
  onClose: () => void
}

interface Errors { [key: string]: string }

const TERMS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

const EMPTY_ITEM: InvoiceItem = { name: '', quantity: 1, price: 0, total: 0 }

function validate(data: InvoiceFormData): Errors {
  const e: Errors = {}
  if (!data.senderAddress.street.trim()) e.senderStreet = "Can't be empty"
  if (!data.senderAddress.city.trim()) e.senderCity = "Can't be empty"
  if (!data.senderAddress.postCode.trim()) e.senderPostCode = "Can't be empty"
  if (!data.senderAddress.country.trim()) e.senderCountry = "Can't be empty"
  if (!data.clientName.trim()) e.clientName = "Can't be empty"
  if (!data.clientEmail.trim()) {
    e.clientEmail = "Can't be empty"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    e.clientEmail = 'Must be a valid email'
  }
  if (!data.clientAddress.street.trim()) e.clientStreet = "Can't be empty"
  if (!data.clientAddress.city.trim()) e.clientCity = "Can't be empty"
  if (!data.clientAddress.postCode.trim()) e.clientPostCode = "Can't be empty"
  if (!data.clientAddress.country.trim()) e.clientCountry = "Can't be empty"
  if (!data.createdAt) e.createdAt = "Can't be empty"
  if (!data.description.trim()) e.description = "Can't be empty"
  if (data.items.length === 0) {
    e.items = 'An item must be added'
  } else {
    data.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item_name_${i}`] = "Can't be empty"
      if (!item.quantity || item.quantity < 1) e[`item_qty_${i}`] = 'Min 1'
      if (item.price < 0) e[`item_price_${i}`] = 'Invalid'
    })
  }
  return e
}

const inp = (err: boolean) =>
  `w-full px-5 py-4 rounded-[4px] bg-white dark:bg-dark-2 border text-xs font-bold text-dark-1 dark:text-white
   transition-colors outline-none
   ${err
    ? 'border-[#EC5757] focus:border-[#EC5757]'
    : 'border-gray-1 dark:border-dark-3 hover:border-purple focus:border-purple'
  }`

function Field({
  label, error, id, children, className = ''
}: {
  label: string; error?: string; id?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`text-[13px] ${error ? 'text-[#EC5757]' : 'text-gray-2 dark:text-gray-1'}`}
        >
          {label}
        </label>
        {error && (
          <span className="text-[10px] font-semibold text-[#EC5757] italic" role="alert">
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
      <path
        d="M11.583 3.556h-2.11l-.554-1.762A1 1 0 007.964 1H5.036a1 1 0 00-.955.794L3.527 3.556H1.417A.417.417 0 001 3.972v.417c0 .23.187.417.417.417h.416v8.68a1.25 1.25 0 001.25 1.25h6.834a1.25 1.25 0 001.25-1.25v-8.68h.416A.417.417 0 0012 4.389v-.417a.417.417 0 00-.417-.416zm-6.64-1.39h2.114l.38 1.39H4.563l.38-1.39zM9.75 13.069H3.25V4.806h6.5v8.263z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function InvoiceForm({ invoice, onClose }: Props) {
  const { addInvoice, updateInvoice } = useInvoices()
  const isEditing = !!invoice
  const firstRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().split('T')[0]

  const initialForm: InvoiceFormData = {
    senderAddress: invoice?.senderAddress ?? { street: '', city: '', postCode: '', country: '' },
    clientName: invoice?.clientName ?? '',
    clientEmail: invoice?.clientEmail ?? '',
    clientAddress: invoice?.clientAddress ?? { street: '', city: '', postCode: '', country: '' },
    createdAt: invoice?.createdAt ?? today,
    paymentTerms: invoice?.paymentTerms ?? 30,
    description: invoice?.description ?? '',
    items: invoice?.items.map(i => ({ ...i })) ?? [{ ...EMPTY_ITEM }],
  }

  const [form, setForm] = useState<InvoiceFormData>(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 50)
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  useEffect(() => {
    if (submitted) setErrors(validate(form))
  }, [form, submitted])

  const setField = (path: string, value: unknown) => {
    setForm(prev => {
      const parts = path.split('.')
      if (parts.length === 1) return { ...prev, [path]: value }
      return {
        ...prev,
        [parts[0]]: {
          ...(prev as Record<string, unknown>)[parts[0]] as object,
          [parts[1]]: value,
        },
      }
    })
  }

  const setItem = (index: number, field: keyof InvoiceItem, rawVal: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item
        const numVal = parseFloat(rawVal) || 0
        const updated = {
          ...item,
          [field]: (field === 'quantity' || field === 'price') ? numVal : rawVal,
        }
        if (field === 'quantity' || field === 'price') {
          updated.total =
            (field === 'quantity' ? numVal : item.quantity) *
            (field === 'price' ? numVal : item.price)
        }
        return updated
      }),
    }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (isEditing && invoice) {
      updateInvoice({ ...invoice, ...form })
    } else {
      addInvoice(form, false)
    }
    onClose()
  }

  const handleDraft = () => {
    addInvoice(form, true)
    onClose()
  }

  const hasErrors = submitted && Object.keys(errors).length > 0

  return (
    <div
      className="fixed inset-0 z-[150]"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${invoice?.id}` : 'New Invoice'}
        className="
          absolute top-[72px] lg:top-0 left-0 bottom-0
          w-full md:w-[616px] lg:left-[103px]
          bg-[#F8F8FB] dark:bg-dark-1
          flex flex-col
          md:rounded-r-[20px]
          overflow-hidden
          animate-[slideInLeft_0.35s_cubic-bezier(0.4,0,0.2,1)]
        "
      >

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-8 pb-4 md:px-14 md:pt-12">
          <h2 className="text-2xl font-bold text-dark-1 dark:text-white tracking-tight mb-10">
            {isEditing
              ? <><span className="text-gray-2">#</span>{invoice?.id}</>
              : 'New Invoice'
            }
          </h2>

    
          <p className="text-xs font-bold text-purple mb-6">Bill From</p>
          <div className="flex flex-col gap-6 mb-10">
            <Field label="Street Address" error={errors.senderStreet} id="senderStreet">
              <input
                id="senderStreet"
                ref={firstRef}
                className={inp(!!errors.senderStreet)}
                value={form.senderAddress.street}
                onChange={e => setField('senderAddress.street', e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Field label="City" error={errors.senderCity} id="senderCity">
                <input
                  id="senderCity"
                  className={inp(!!errors.senderCity)}
                  value={form.senderAddress.city}
                  onChange={e => setField('senderAddress.city', e.target.value)}
                />
              </Field>
              <Field label="Post Code" error={errors.senderPostCode} id="senderPostCode">
                <input
                  id="senderPostCode"
                  className={inp(!!errors.senderPostCode)}
                  value={form.senderAddress.postCode}
                  onChange={e => setField('senderAddress.postCode', e.target.value)}
                />
              </Field>
              <Field label="Country" error={errors.senderCountry} id="senderCountry" className="col-span-2 md:col-span-1">
                <input
                  id="senderCountry"
                  className={inp(!!errors.senderCountry)}
                  value={form.senderAddress.country}
                  onChange={e => setField('senderAddress.country', e.target.value)}
                />
              </Field>
            </div>
          </div>


          <p className="text-xs font-bold text-purple mb-6">Bill To</p>
          <div className="flex flex-col gap-6 mb-10">
            <Field label="Client's Name" error={errors.clientName} id="clientName">
              <input
                id="clientName"
                className={inp(!!errors.clientName)}
                value={form.clientName}
                onChange={e => setField('clientName', e.target.value)}
              />
            </Field>

            <Field label="Client's Email" error={errors.clientEmail} id="clientEmail">
              <div className="relative">
                <input
                  id="clientEmail"
                  type="email"
                  placeholder="e.g. email@example.com"
                  className={inp(!!errors.clientEmail) + ' pr-12'}
                  value={form.clientEmail}
                  onChange={e => setField('clientEmail', e.target.value)}
                  autoComplete="email"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                    <path
                      d="M14.667 0H1.333C.6 0 0 .6 0 1.333v9.334C0 11.4.6 12 1.333 12h13.334C15.4 12 16 11.4 16 10.667V1.333C16 .6 15.4 0 14.667 0zm0 2.667L8 6.667 1.333 2.667V1.333L8 5.333l6.667-4v1.334z"
                      fill="#888EB0"
                    />
                  </svg>
                </div>
              </div>
            </Field>

            <Field label="Street Address" error={errors.clientStreet} id="clientStreet">
              <input
                id="clientStreet"
                className={inp(!!errors.clientStreet)}
                value={form.clientAddress.street}
                onChange={e => setField('clientAddress.street', e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Field label="City" error={errors.clientCity} id="clientCity">
                <input
                  id="clientCity"
                  className={inp(!!errors.clientCity)}
                  value={form.clientAddress.city}
                  onChange={e => setField('clientAddress.city', e.target.value)}
                />
              </Field>
              <Field label="Post Code" error={errors.clientPostCode} id="clientPostCode">
                <input
                  id="clientPostCode"
                  className={inp(!!errors.clientPostCode)}
                  value={form.clientAddress.postCode}
                  onChange={e => setField('clientAddress.postCode', e.target.value)}
                />
              </Field>
              <Field label="Country" error={errors.clientCountry} id="clientCountry" className="col-span-2 md:col-span-1">
                <input
                  id="clientCountry"
                  className={inp(!!errors.clientCountry)}
                  value={form.clientAddress.country}
                  onChange={e => setField('clientAddress.country', e.target.value)}
                />
              </Field>
            </div>
          </div>


          <div className="flex flex-col gap-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Invoice Date" error={errors.createdAt} id="createdAt">
                <div className="relative">
                  <input
                    id="createdAt"
                    type="date"
                    className={inp(!!errors.createdAt) + ' pr-12 cursor-pointer'}
                    value={form.createdAt}
                    disabled={isEditing}
                    onChange={e => setField('createdAt', e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M14 2h-1V0h-2v2H5V0H3v2H2C.9 2 0 2.9 0 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H2V6h12v10zM4 8h2v2H4zm4 0h2v2H8zm4 0h2v2h-2z"
                        fill="#7C5DFA"
                      />
                    </svg>
                  </div>
                </div>
              </Field>

              <Field label="Payment Terms" id="paymentTerms">
                <div className="relative">
                  <select
                    id="paymentTerms"
                    className={inp(false) + ' appearance-none cursor-pointer pr-10'}
                    value={form.paymentTerms}
                    onChange={e => setField('paymentTerms', parseInt(e.target.value))}
                  >
                    {TERMS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
                      <path
                        d="M1 1L5.5 5.5L10 1"
                        stroke="#7C5DFA" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Field>
            </div>

            <Field label="Project Description" error={errors.description} id="description">
              <input
                id="description"
                className={inp(!!errors.description)}
                placeholder="e.g. Graphic Design Service"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
              />
            </Field>
          </div>


          <div>
            <p className="text-[18px] font-bold text-[#777F98] mb-5">Item List</p>

            <div className="hidden md:grid grid-cols-[1fr_64px_104px_72px_16px] gap-4 mb-3 text-[13px] text-gray-2">
              <span>Item Name</span>
              <span className="text-center">Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>

            <div className="flex flex-col gap-5 md:gap-4">
              {form.items.map((item, i) => (
                <div key={i}>
                  <div className="md:hidden flex flex-col gap-4 pb-5 border-b border-gray-1 dark:border-dark-3 last:border-0 last:pb-0">
                    <Field label="Item Name" error={errors[`item_name_${i}`]} id={`item-name-${i}`}>
                      <input
                        id={`item-name-${i}`}
                        className={inp(!!errors[`item_name_${i}`])}
                        value={item.name}
                        placeholder="Item name"
                        onChange={e => setItem(i, 'name', e.target.value)}
                      />
                    </Field>
                    <div className="grid grid-cols-[64px_1fr_80px_16px] gap-4 items-end">
                      <Field label="Qty." id={`item-qty-${i}`}>
                        <input
                          id={`item-qty-${i}`}
                          type="number"
                          min="1"
                          className={inp(!!errors[`item_qty_${i}`]) + ' text-center'}
                          value={item.quantity}
                          onChange={e => setItem(i, 'quantity', e.target.value)}
                        />
                      </Field>
                      <Field label="Price" id={`item-price-${i}`}>
                        <input
                          id={`item-price-${i}`}
                          type="number"
                          min="0"
                          step="0.01"
                          className={inp(!!errors[`item_price_${i}`])}
                          value={item.price}
                          onChange={e => setItem(i, 'price', e.target.value)}
                        />
                      </Field>
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] text-gray-2">Total</span>
                        <span
                          className="text-xs font-bold text-gray-2 flex items-center"
                          style={{ height: '48px' }}
                        >
                          {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}
                        className="text-gray-2 hover:text-[#EC5757] transition-colors self-end pb-3"
                        aria-label={`Remove item ${item.name || i + 1}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-[1fr_64px_104px_72px_16px] gap-4 items-center">
                    <input
                      className={inp(!!errors[`item_name_${i}`])}
                      value={item.name}
                      placeholder="Item name"
                      onChange={e => setItem(i, 'name', e.target.value)}
                      aria-label="Item name"
                    />
                    <input
                      type="number"
                      min="1"
                      className={inp(!!errors[`item_qty_${i}`]) + ' text-center'}
                      value={item.quantity}
                      onChange={e => setItem(i, 'quantity', e.target.value)}
                      aria-label="Quantity"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={inp(!!errors[`item_price_${i}`])}
                      value={item.price}
                      onChange={e => setItem(i, 'price', e.target.value)}
                      aria-label="Price"
                    />
                    <span className="text-xs font-bold text-gray-2">
                      {(item.quantity * item.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}
                      className="text-gray-2 hover:text-[#EC5757] transition-colors"
                      aria-label={`Remove item ${item.name || i + 1}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="text-[10px] font-semibold text-[#EC5757] mt-3" role="alert">
                {errors.items}
              </p>
            )}

            <button
              onClick={() => setForm(p => ({ ...p, items: [...p.items, { ...EMPTY_ITEM }] }))}
              className="w-full mt-5 bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 rounded-3xl py-4 text-xs font-bold hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors"
            >
              + Add New Item
            </button>
          </div>

          {hasErrors && (
            <div className="mt-6 space-y-1" role="alert" aria-live="assertive">
              <p className="text-[10px] font-semibold text-[#EC5757]">— All fields must be added</p>
              {errors.items && (
                <p className="text-[10px] font-semibold text-[#EC5757]">— {errors.items}</p>
              )}
            </div>
          )}

          <div className="h-6" />
        </div>

        <div className="flex-shrink-0 bg-white dark:bg-dark-2 px-6 md:px-14 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-4 rounded-3xl text-xs font-bold bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors"
              >
                Discard
              </button>
              <div className="flex-1" />
              <button
                onClick={handleDraft}
                className="px-6 py-4 rounded-3xl text-xs font-bold bg-[#373B53] text-[#888EB0] hover:bg-dark-1 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-4 rounded-3xl text-xs font-bold bg-purple text-white hover:bg-purple-light transition-colors"
              >
                Save &amp; Send
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-4 rounded-3xl text-xs font-bold bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors"
              >
                Cancel
              </button>
              <div className="flex-1" />
              <button
                onClick={handleSubmit}
                className="px-6 py-4 rounded-3xl text-xs font-bold bg-purple text-white hover:bg-purple-light transition-colors"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
