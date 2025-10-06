'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import type { MovieSummary } from '@/domain/movies'
import MovieCard from './MovieCard'

export default function Row({ title, items }: { title: string; items: MovieSummary[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const recalc = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 0)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    recalc()
    const onScroll = () => recalc()
    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(recalc)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [recalc])

  const scrollAmount = 0.9 // viewport width fraction per click
  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * scrollAmount) * dir
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  // keyboard nav on container
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') scroll(-1)
    if (e.key === 'ArrowRight') scroll(1)
  }

  return (
    <section className="relative">
      <h2 className="mb-2 px-4 text-lg font-semibold">{title}</h2>

      <div
        className="group/row relative"
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label={`${title} carousel`}
      >
        {/* Faded edges using CSS mask for that Netflix vibe */}
        <div
          className="relative overflow-x-auto px-4"
          ref={scrollerRef}
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
          }}
        >
          <div className="flex gap-3 snap-x snap-mandatory">
            {items.map((m) => (
              <div key={m.id} className="snap-start">
                <MovieCard m={m} />
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next chevrons (show on hover, always on md+) */}
        <button
          aria-label="Previous"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center
                     rounded-full bg-black/60 hover:bg-black/80 ring-1 ring-white/10 text-white
                     transition-opacity opacity-0 group-hover/row:opacity-100
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        <button
          aria-label="Next"
          onClick={() => scroll(1)}
          disabled={!canNext}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center
                     rounded-full bg-black/60 hover:bg-black/80 ring-1 ring-white/10 text-white
                     transition-opacity opacity-0 group-hover/row:opacity-100
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </section>
  )
}
