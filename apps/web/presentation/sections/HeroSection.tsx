// apps/web/presentation/sections/HeroSection.tsx
'use client'

import Hero from '@/presentation/components/Hero'
import { useNowPlayingMovies } from '@/data/movies.hooks'

export default function HeroSection() {
  // Suspense is enabled in your hooks; this will suspend until ready
  const { data } = useNowPlayingMovies(1)
  const item = data?.items?.[0]
  if (!item) return null
  return <Hero item={item as any} />
}

export function HeroSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading hero"
      className="relative w-full overflow-hidden
                 aspect-[16/9] md:aspect-[21/9] xl:aspect-[16/7]"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-900" />
      {/* Readability scrim (same as real hero) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Copy skeleton */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8 sm:pb-10">
        <div className="w-full max-w-xl">
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-5/6 rounded bg-white/10" />
            <div className="h-3 w-2/3 rounded bg-white/10" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-28 rounded bg-white/20" />
            <div className="h-10 w-28 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
