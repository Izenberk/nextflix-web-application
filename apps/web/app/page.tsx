import Providers from './providers'
import { PopularRow } from '@/presentation/sections/Rows'

export default function Page() {
  return (
    <Providers>
      <main className="space-y-8 mt-6">
        <PopularRow />
      </main>
      <footer className="py-10 text-center text-sm text-white/50">© Nextflix</footer>
    </Providers>
  )
}