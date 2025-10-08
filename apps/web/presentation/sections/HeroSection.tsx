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
      className="
        relative w-full overflow-hidden
        aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9] xl:aspect-[16/7]
      "
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-900" />

      {/* Readability scrim — match Hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Copy skeleton — match container + alignment + paddings */}
      <div
        className="
          relative z-10 h-full max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          flex items-end md:items-center lg:items-end
          pb-10 md:pb-20 lg:pb-24
        "
      >
        <div className="w-full max-w-xl">
          {/* Title block approximates heading size/width */}
          <div className="h-8 sm:h-10 md:h-12 lg:h-14 w-3/4 rounded bg-white/10" />

          {/* Overview lines */}
          <div className="mt-2 sm:mt-3 space-y-2">
            <div className="h-3 sm:h-3.5 w-full rounded bg-white/10" />
            <div className="h-3 sm:h-3.5 w-5/6 rounded bg-white/10" />
            <div className="h-3 sm:h-3.5 w-2/3 rounded bg-white/10" />
          </div>

          {/* Buttons row */}
          <div className="mt-4 sm:mt-5 flex gap-3">
            <div className="h-8 sm:h-9 md:h-10 w-24 sm:w-28 rounded bg-white/20" />
            <div className="h-8 sm:h-9 md:h-10 w-24 sm:w-28 rounded bg-white/10 ring-1 ring-white/20" />
          </div>
        </div>
      </div>
    </section>
  )
}

