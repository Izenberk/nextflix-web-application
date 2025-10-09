import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nextflix',
  icons: {
    icon: '/favicon.ico',
  },
  description: 'Watch anything, anywhere — built by Korn.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#141414] text-white font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
