import { createContext, useContext, useEffect, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

const InvoiceContext = createContext()

const SAMPLE_INVOICES = [
  {
    id: 'RT3080',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33
  },
  {
    id: 'AA1449',
    createdAt: '2021-10-07',
    paymentDue: '2021-10-14',
    description: 'Interior Design',
    paymentTerms: 7,
    clientName: 'Alysa Werner',
    clientEmail: 'alysa@email.co.uk',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '63 Warwick Road', city: 'Carlisle', postCode: 'CA20 2TG', country: 'United Kingdom' },
    items: [{ name: 'Small Screen Design', quantity: 3, price: 102.04, total: 306.12 }],
    total: 306.12
  },
  {
    id: 'TY9141',
    createdAt: '2021-10-08',
    paymentDue: '2021-10-09',
    description: 'Logo Concept',
    paymentTerms: 1,
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisa.clarke@example.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '46 Abbey Row', city: 'Cambridge', postCode: 'CB5 6EG', country: 'United Kingdom' },
    items: [{ name: 'Logo Sketches', quantity: 1, price: 102.04, total: 102.04 }],
    total: 102.04
  },
  {
    id: 'FV2353',
    createdAt: '2021-11-05',
    paymentDue: '2021-12-12',
    description: 'Logo Re-design',
    paymentTerms: 7,
    clientName: 'Mark Owen',
    clientEmail: 'maysenh@mail.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '3 Crak Rd', city: 'Belfast', postCode: 'BT1 AB2', country: 'United Kingdom' },
    items: [
      { name: 'Logo Re-design', quantity: 1, price: 3102.04, total: 3102.04 },
    ],
    total: 3102.04
  }
]

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload }
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] }
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        )
      }
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload)
      }
    case 'MARK_PAID':
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === action.payload ? { ...inv, status: 'paid' } : inv
        )
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    invoices: [],
    filter: 'all'
  })

  useEffect(() => {
    const stored = localStorage.getItem('invoices')
    if (stored) {
      dispatch({ type: 'SET_INVOICES', payload: JSON.parse(stored) })
    } else {
      dispatch({ type: 'SET_INVOICES', payload: SAMPLE_INVOICES })
    }
  }, [])

  useEffect(() => {
    if (state.invoices.length > 0 || localStorage.getItem('invoices')) {
      localStorage.setItem('invoices', JSON.stringify(state.invoices))
    }
  }, [state.invoices])

  const generateId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const l1 = letters[Math.floor(Math.random() * 26)]
    const l2 = letters[Math.floor(Math.random() * 26)]
    const nums = String(Math.floor(Math.random() * 9000) + 1000)
    return `${l1}${l2}${nums}`
  }

  const getPaymentDue = (createdAt, terms) => {
    const date = new Date(createdAt)
    date.setDate(date.getDate() + terms)
    return date.toISOString().split('T')[0]
  }

  const addInvoice = (data, asDraft = false) => {
    const newInvoice = {
      ...data,
      id: generateId(),
      status: asDraft ? 'draft' : 'pending',
      paymentDue: getPaymentDue(data.createdAt, data.paymentTerms),
      total: data.items.reduce((sum, item) => sum + item.total, 0)
    }
    dispatch({ type: 'ADD_INVOICE', payload: newInvoice })
    return newInvoice.id
  }

  const updateInvoice = (data) => {
    const updated = {
      ...data,
      paymentDue: getPaymentDue(data.createdAt, data.paymentTerms),
      total: data.items.reduce((sum, item) => sum + item.total, 0)
    }
    dispatch({ type: 'UPDATE_INVOICE', payload: updated })
  }

  const deleteInvoice = (id) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id })
  }

  const markAsPaid = (id) => {
    dispatch({ type: 'MARK_PAID', payload: id })
  }

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }

  const filteredInvoices = state.filter === 'all'
    ? state.invoices
    : state.invoices.filter(inv => inv.status === state.filter)

  return (
    <InvoiceContext.Provider value={{
      invoices: state.invoices,
      filteredInvoices,
      filter: state.filter,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid,
      setFilter
    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export const useInvoices = () => useContext(InvoiceContext)
