import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'
import containerQueries from '@tailwindcss/container-queries'
import scrollbarHide from 'tailwind-scrollbar-hide'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './presentation/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './domain/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          gray: '#2F2F2F',
        },
      },
      boxShadow: {
        poster: '0 8px 15px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [
    typography,
    aspectRatio,
    containerQueries,
    scrollbarHide,
  ],
}

export default config
