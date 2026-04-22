import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'


interface ThemeContextType { theme: 'dark' | 'light'; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('invoice-theme') as 'dark' | 'light') || 'dark')
  useEffect(() => {
    theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    localStorage.setItem('invoice-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
