import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { ToastMessage, ToastType } from '../components/Toast'

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainerInline toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

import ToastContainer from '../components/Toast'
function ToastContainerInline({ toasts, removeToast }: { toasts: ToastMessage[]; removeToast: (id: string) => void }) {
  return <ToastContainer toasts={toasts} removeToast={removeToast} />
}

export const useToast = () => useContext(ToastContext)
