import { Suspense } from 'react'
import Providers from './providers'
import HeroSection, { HeroSkeleton } from '@/presentation/sections/HeroSection'
import Navbar from '@/presentation/components/Navbar'
import PopularRow, { PopularRowSkeleton } from '@/presentation/sections/PopularRow'
import { MovieDetailModalGlobal } from '@/presentation/components/MovieDetailModal'

export default function Page() {
  return (
    <Providers>
      <Navbar />
      <main className="relative pb-12 bg-black text-white overflow-hidden">
        <div className="relative z-0">
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection />
          </Suspense>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </div>

        <section className="relative z-10 md:-mt-10 lg:-mt-16 xl:-mt-20 space-y-10 md:space-y-12 px-2 sm:px-4 md:px-6 lg:px-8">
          <Suspense fallback={<PopularRowSkeleton />}>
            <PopularRow />
          </Suspense>
        </section>
      </main>
      <MovieDetailModalGlobal />

      <footer className="py-10 text-center text-xs text-neutral-500 bg-black">
        © Nextflix — a portfolio project by Korn
      </footer>
    </Providers>
  )
}
