import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['League Spartan', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#7C5DFA',
          light: '#9277FF',
        },
        dark: {
          1: '#141625',
          2: '#1E2139',
          3: '#252945',
          4: '#0D0E14',
        },
        gray: {
          1: '#DFE3FA',
          2: '#888EB0',
          3: '#7E88C3',
        },
      },
      borderRadius: {
        invoice: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config
