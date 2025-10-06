'use client'
import { PropsWithChildren, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: PropsWithChildren) {
  const qc = useMemo(() => new QueryClient(), [])
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
