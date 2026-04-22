import { useTheme } from '../context/ThemeContext'
import logoShape from '../assets/logo.svg'
import avatarImg from '../assets/avatar.jpg'

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="4" fill="#858BB2" />
    <path
      d="M10 1V3M10 17V19M1 10H3M17 10H19M3.22 3.22L4.64 4.64M15.36 15.36L16.78 16.78M16.78 3.22L15.36 4.64M4.64 15.36L3.22 16.78"
      stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"
    />
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.14 1.07C5.05 1.62 1.9 5.1 1.9 9.33c0 4.6 3.73 8.33 8.33 8.33 3.84 0 7.08-2.6 8.07-6.16-.8.26-1.65.4-2.54.4-4.6 0-8.33-3.73-8.33-8.33 0-.17 0-.34.01-.5z"
      fill="#858BB2"
    />
  </svg>
)

const Avatar = () => (
  <img
    src={avatarImg}
    alt="User profile"
    className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-purple-light transition-colors cursor-pointer"
  />
)

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <nav
        className="hidden lg:flex flex-col items-center justify-between w-[103px] bg-[#373B53] rounded-r-[20px] sticky top-0 h-screen z-50 flex-shrink-0"
        aria-label="Main navigation"
      >
        <div className="w-full">
          <div className="w-[103px] h-[103px] bg-purple rounded-r-[20px] flex items-center justify-center relative overflow-hidden cursor-pointer">
            <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-purple-light rounded-tl-[20px]" />
            <img src={logoShape} alt="Invoice App" className="relative z-10 w-10 h-10 object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <button
            onClick={toggleTheme}
            className="w-full h-[72px] flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="w-full h-px bg-[#494E6E]" role="separator" />
          <div className="w-full h-[88px] flex items-center justify-center">
            <Avatar />
          </div>
        </div>
      </nav>


      <nav
        className="lg:hidden fixed top-0 left-0 right-0 h-[72px] bg-[#373B53] z-50 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <div className="w-[72px] h-[72px] bg-purple flex items-center justify-center relative overflow-hidden rounded-br-[20px] flex-shrink-0 cursor-pointer">
          <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-purple-light rounded-tl-[20px]" />
          <img src={logoShape} alt="Invoice App" className="relative z-10 w-8 h-8 object-contain" />
        </div>

        <div className="flex items-center h-full">
          <button
            onClick={toggleTheme}
            className="px-7 h-full flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="w-px h-full bg-[#494E6E]" role="separator" />
          <div className="px-6 h-full flex items-center justify-center">
            <img
              src={avatarImg}
              alt="User profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-purple-light transition-colors cursor-pointer"
            />
          </div>
        </div>
      </nav>
    </>
  )
}
