import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'
import Sidebar from './components/Sidebar'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <BrowserRouter>
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
