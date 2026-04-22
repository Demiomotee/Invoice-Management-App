import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'
import Sidebar from './components/Sidebar'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'

function BackButtonHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') {
      window.history.pushState(null, '', window.location.href)
    }
    const handlePopState = () => {
      if (location.pathname !== '/') {
        navigate('/', { replace: true })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [location.pathname, navigate])

  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <BackButtonHandler />
          <div className="flex min-h-screen bg-[#F8F8FB] dark:bg-dark-1 font-sans transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 min-h-screen overflow-x-hidden pt-[72px] lg:pt-0">
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/invoice/:id" element={<InvoiceDetail />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </InvoiceProvider>
    </ThemeProvider>
  )
}
