import { useState, useEffect, useRef } from 'react'
import { useInvoices } from '../context/InvoiceContext'
import type { Invoice, InvoiceItem, InvoiceFormData } from '../context/InvoiceContext'

interface Props {
  invoice?: Invoice
  onClose: () => void
}

interface Errors {
  [key: string]: string
}

const TERMS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

const EMPTY_ITEM: InvoiceItem = { name: '', quantity: 1, price: 0, total: 0 }

function validate(data: InvoiceFormData): Errors {
  const e: Errors = {}
  if (!data.senderAddress.street.trim()) e.senderStreet = 'Required'
  if (!data.senderAddress.city.trim()) e.senderCity = 'Required'
  if (!data.senderAddress.postCode.trim()) e.senderPostCode = 'Required'
  if (!data.senderAddress.country.trim()) e.senderCountry = 'Required'
  if (!data.clientName.trim()) e.clientName = "Can't be empty"
  if (!data.clientEmail.trim()) e.clientEmail = "Can't be empty"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) e.clientEmail = 'Invalid email'
  if (!data.clientAddress.street.trim()) e.clientStreet = 'Required'
  if (!data.clientAddress.city.trim()) e.clientCity = 'Required'
  if (!data.clientAddress.postCode.trim()) e.clientPostCode = 'Required'
  if (!data.clientAddress.country.trim()) e.clientCountry = 'Required'
  if (!data.createdAt) e.createdAt = 'Required'
  if (!data.description.trim()) e.description = "Can't be empty"
  if (data.items.length === 0) e.items = 'An item must be added'
  return e
}

const inp = (err: boolean) =>
  `w-full px-5 py-4 rounded bg-white dark:bg-dark-2 border text-xs font-bold text-dark-1 dark:text-white transition-colors outline-none appearance-none
  ${err
    ? 'border-[#EC5757]'
    : 'border-gray-1 dark:border-dark-3 hover:border-purple focus:border-purple'
  }`

function Field({
  label, error, children, className = ''
}: {
  label: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-[13px] text-gray-2 dark:text-gray-1">{label}</label>
        {error && <span className="text-[10px] font-semibold text-[#EC5757]" role="alert">{error}</span>}
      </div>
      {children}
    </div>
  )
}

export default function InvoiceForm({ invoice, onClose }: Props) {
  const { addInvoice, updateInvoice } = useInvoices()
  const isEditing = !!invoice
  const firstRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<InvoiceFormData>({
    senderAddress: invoice?.senderAddress ?? { street: '', city: '', postCode: '', country: '' },
    clientName: invoice?.clientName ?? '',
    clientEmail: invoice?.clientEmail ?? '',
    clientAddress: invoice?.clientAddress ?? { street: '', city: '', postCode: '', country: '' },
    createdAt: invoice?.createdAt ?? today,
    paymentTerms: invoice?.paymentTerms ?? 30,
    description: invoice?.description ?? '',
    items: invoice?.items ?? [{ ...EMPTY_ITEM }],
  })

  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    firstRef.current?.focus()
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
          [parts[1]]: value
        }
      }
    })
  }

  const setItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          updated.total = (parseFloat(String(updated.quantity)) || 0) * (parseFloat(String(updated.price)) || 0)
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
    if (isEditing && invoice) updateInvoice({ ...invoice, ...form })
    else addInvoice(form, false)
    onClose()
  }

  const handleDraft = () => {
    addInvoice(form, true)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="presentation"
    >

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${invoice?.id}` : 'New Invoice'}
        className="
          flex flex-col bg-[#F8F8FB] dark:bg-dark-1
          w-full lg:max-w-[719px]
          absolute top-[72px] lg:top-0
          bottom-0 left-0
          lg:rounded-r-[20px]
          overflow-hidden
          animate-[slideInLeft_0.35s_cubic-bezier(0.4,0,0.2,1)]"
      >

        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 md:px-10 md:pt-12 lg:px-14 lg:pt-14">
          <h2 className="text-2xl font-bold text-dark-1 dark:text-white tracking-tight mb-10 md:mb-12">
            {isEditing
              ? <><span className="text-gray-2">#</span>{invoice?.id}</>
              : 'New Invoice'
            }
          </h2>


          <p className="text-xs font-bold text-purple mb-6">Bill From</p>
          <div className="flex flex-col gap-6 mb-10">
            <Field label="Street Address" error={errors.senderStreet}>
              <input ref={firstRef} className={inp(!!errors.senderStreet)} value={form.senderAddress.street} onChange={e => setField('senderAddress.street', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Field label="City" error={errors.senderCity}>
                <input className={inp(!!errors.senderCity)} value={form.senderAddress.city} onChange={e => setField('senderAddress.city', e.target.value)} />
              </Field>
              <Field label="Post Code" error={errors.senderPostCode}>
                <input className={inp(!!errors.senderPostCode)} value={form.senderAddress.postCode} onChange={e => setField('senderAddress.postCode', e.target.value)} />
              </Field>
              <Field label="Country" error={errors.senderCountry} className="col-span-2 md:col-span-1">
                <input className={inp(!!errors.senderCountry)} value={form.senderAddress.country} onChange={e => setField('senderAddress.country', e.target.value)} />
              </Field>
            </div>
          </div>

          <p className="text-xs font-bold text-purple mb-6">Bill To</p>
          <div className="flex flex-col gap-6 mb-10">
            <Field label="Client's Name" error={errors.clientName}>
              <input className={inp(!!errors.clientName)} value={form.clientName} onChange={e => setField('clientName', e.target.value)} />
            </Field>
            <Field label="Client's Email" error={errors.clientEmail}>
              <input className={inp(!!errors.clientEmail)} type="email" placeholder="e.g. email@example.com" value={form.clientEmail} onChange={e => setField('clientEmail', e.target.value)} />
            </Field>
            <Field label="Street Address" error={errors.clientStreet}>
              <input className={inp(!!errors.clientStreet)} value={form.clientAddress.street} onChange={e => setField('clientAddress.street', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Field label="City" error={errors.clientCity}>
                <input className={inp(!!errors.clientCity)} value={form.clientAddress.city} onChange={e => setField('clientAddress.city', e.target.value)} />
              </Field>
              <Field label="Post Code" error={errors.clientPostCode}>
                <input className={inp(!!errors.clientPostCode)} value={form.clientAddress.postCode} onChange={e => setField('clientAddress.postCode', e.target.value)} />
              </Field>
              <Field label="Country" error={errors.clientCountry} className="col-span-2 md:col-span-1">
                <input className={inp(!!errors.clientCountry)} value={form.clientAddress.country} onChange={e => setField('clientAddress.country', e.target.value)} />
              </Field>
            </div>
          </div>


          <div className="flex flex-col gap-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Invoice Date" error={errors.createdAt}>
                <input className={inp(!!errors.createdAt)} type="date" value={form.createdAt} disabled={isEditing} onChange={e => setField('createdAt', e.target.value)} />
              </Field>
              <Field label="Payment Terms" error="">
                <select className={inp(false)} value={form.paymentTerms} onChange={e => setField('paymentTerms', parseInt(e.target.value))}>
                  {TERMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Project Description" error={errors.description}>
              <input className={inp(!!errors.description)} placeholder="e.g. Graphic Design Service" value={form.description} onChange={e => setField('description', e.target.value)} />
            </Field>
          </div>

          
          <div>
            <p className="text-[18px] font-bold text-[#777F98] mb-4">Item List</p>

            <div className="hidden md:grid grid-cols-[1fr_64px_100px_64px_16px] gap-4 mb-2 text-[13px] text-gray-2">
              <span>Item Name</span>
              <span className="text-center">Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>

            <div className="flex flex-col gap-4 md:gap-3">
              {form.items.map((item, i) => (
                <div key={i}>
                  <div className="md:hidden flex flex-col gap-4">
                    <Field label="Item Name">
                      <input className={inp(false)} value={item.name} placeholder="Item name" onChange={e => setItem(i, 'name', e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-[64px_1fr_64px_16px] gap-4 items-end">
                      <Field label="Qty.">
                        <input className={inp(false)} type="number" min="1" value={item.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} />
                      </Field>
                      <Field label="Price">
                        <input className={inp(false)} type="number" min="0" step="0.01" value={item.price} onChange={e => setItem(i, 'price', e.target.value)} />
                      </Field>
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] text-gray-2">Total</span>
                        <span className="text-xs font-bold text-gray-2 flex items-center" style={{ height: '48px' }}>
                          {item.total.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}
                        className="text-gray-2 hover:text-[#EC5757] transition-colors self-end pb-3"
                        aria-label="Remove item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:grid grid-cols-[1fr_64px_100px_64px_16px] gap-4 items-center">
                    <input className={inp(false)} value={item.name} placeholder="Item name" onChange={e => setItem(i, 'name', e.target.value)} />
                    <input className={inp(false) + ' text-center'} type="number" min="1" value={item.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} />
                    <input className={inp(false)} type="number" min="0" step="0.01" value={item.price} onChange={e => setItem(i, 'price', e.target.value)} />
                    <span className="text-xs font-bold text-gray-2">{item.total.toFixed(2)}</span>
                    <button
                      onClick={() => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}
                      className="text-gray-2 hover:text-[#EC5757] transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="text-[10px] font-semibold text-[#EC5757] mt-2" role="alert">{errors.items}</p>
            )}

            <button
              onClick={() => setForm(p => ({ ...p, items: [...p.items, { ...EMPTY_ITEM }] }))}
              className="w-full mt-4 bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 rounded-3xl py-4 text-xs font-bold hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors"
            >
              + Add New Item
            </button>
          </div>

          {submitted && Object.keys(errors).length > 0 && (
            <div className="mt-6 text-[10px] font-semibold text-[#EC5757]" role="alert" aria-live="assertive">
              <p>— All fields must be added</p>
              {errors.items && <p>— {errors.items}</p>}
            </div>
          )}

          <div className="h-4" />
        </div>

        <div className="flex-shrink-0 px-6 py-5 md:px-10 lg:px-14 bg-white dark:bg-dark-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2">
          {!isEditing ? (
            <>
              <button onClick={onClose} className="px-5 md:px-6 py-4 rounded-3xl text-xs font-bold bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors">
                Discard
              </button>
              <div className="flex-1" />
              <button onClick={handleDraft} className="px-5 md:px-6 py-4 rounded-3xl text-xs font-bold bg-[#373B53] text-gray-2 hover:bg-dark-1 transition-colors">
                Save as Draft
              </button>
              <button onClick={handleSubmit} className="px-5 md:px-6 py-4 rounded-3xl text-xs font-bold bg-purple text-white hover:bg-purple-light transition-colors">
                Save &amp; Send
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="px-5 md:px-6 py-4 rounded-3xl text-xs font-bold bg-[#F9FAFE] dark:bg-dark-3 text-gray-3 dark:text-gray-1 hover:bg-gray-1 dark:hover:bg-dark-1 transition-colors">
                Cancel
              </button>
              <div className="flex-1" />
              <button onClick={handleSubmit} className="px-5 md:px-6 py-4 rounded-3xl text-xs font-bold bg-purple text-white hover:bg-purple-light transition-colors">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
      <path d="M11.583 3.556h-2.11l-.554-1.762A1 1 0 007.964 1H5.036a1 1 0 00-.955.794L3.527 3.556H1.417A.417.417 0 001 3.972v.417c0 .23.187.417.417.417h.416v8.68a1.25 1.25 0 001.25 1.25h6.834a1.25 1.25 0 001.25-1.25v-8.68h.416A.417.417 0 0012 4.389v-.417a.417.417 0 00-.417-.416zm-6.64-1.39h2.114l.38 1.39H4.563l.38-1.39zM9.75 13.069H3.25V4.806h6.5v8.263z" fill="currentColor" />
    </svg>
  )
}
