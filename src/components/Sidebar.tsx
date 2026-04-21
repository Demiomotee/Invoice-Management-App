import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="4" fill="#858BB2" />
    <path d="M10 1V3M10 17V19M1 10H3M17 10H19M3.22 3.22L4.64 4.64M15.36 15.36L16.78 16.78M16.78 3.22L15.36 4.64M4.64 15.36L3.22 16.78"
      stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M9.14 1.07C5.05 1.62 1.9 5.1 1.9 9.33c0 4.6 3.73 8.33 8.33 8.33 3.84 0 7.08-2.6 8.07-6.16-.8.26-1.65.4-2.54.4-4.6 0-8.33-3.73-8.33-8.33 0-.17 0-.34.01-.5z"
      fill="#858BB2" />
  </svg>
)

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav
      className="
        w-[103px] bg-[#373B53] flex flex-col items-center justify-between
        sticky top-0 h-screen z-50 flex-shrink-0 rounded-r-[20px]
        md:w-20 
        max-md:w-full max-md:h-[72px] max-md:flex-row max-md:rounded-none max-md:rounded-b-[20px]
      "
      aria-label="Main navigation"
    >

      <div className="flex items-center justify-center py-7 max-md:py-0 max-md:px-7">
        <div className="w-16 h-16 bg-purple rounded-[20px] flex items-center justify-center relative overflow-hidden max-md:w-[72px] max-md:h-[72px] max-md:rounded-none max-md:rounded-br-[20px]">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-purple-light rounded-t-[20px]" />
          <svg width="28" height="26" viewBox="0 0 28 26" fill="none" className="relative z-10" aria-hidden="true">
            <path d="M0 0h28v22l-14 4L0 22V0z" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pb-6 max-md:flex-row max-md:pb-0 max-md:pr-7">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-11 h-11 rounded-full hover:opacity-70 transition-opacity"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="w-full h-px bg-[#494E6E] max-md:w-px max-md:h-10" role="separator" />

        <div
          className="w-10 h-10 rounded-full bg-gray-3 flex items-center justify-center text-white text-xs font-bold border-2 border-transparent hover:border-white transition-colors cursor-pointer"
          aria-label="User profile"
        >
          AB
        </div>
      </div>
    </nav>
  )
}
