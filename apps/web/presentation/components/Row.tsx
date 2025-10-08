'use client'
import { useRef, useState, useLayoutEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MovieSummary } from '@/domain/movies'
import MovieCard from './MovieCard'

type Props = {
  title: string
  items?: MovieSummary[] | null
  onOpen?: (m: MovieSummary) => void
}

export default function Row({ title, items = [], onOpen }: Props) {
  const [x, setX] = useState(0)
  const [max, setMax] = useState(0)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const scrollWidth = el.scrollWidth
      const clientWidth = el.clientWidth
      const maxScroll = Math.max(0, scrollWidth - clientWidth)
      setMax(maxScroll)
      setX(prev => {
        const clamped = Math.max(-maxScroll, Math.min(0, prev))
        if (clamped !== prev) controls.set({ x: clamped })
        return clamped
      })
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items?.length])

  const step = () => {
    const el = containerRef.current
    if (!el) return 0
    return Math.max(200, Math.floor(el.clientWidth * 0.8))
  }

  async function handleScroll(direction: 'left' | 'right') {
    const s = step()
    if (s === 0) return
    const next = direction === 'left' ? Math.min(x + s, 0) : Math.max(x - s, -max)
    setX(next)
    await controls.start({ x: next, transition: { type: 'spring', stiffness: 90, damping: 18 } })
  }

  const atStart = x >= -4
  const atEnd = x <= -(max - 4)
  const hasItems = Array.isArray(items) && items.length > 0

  return (
    <section className="relative group space-y-2 px-6">
      <h2 className="text-lg md:text-xl font-semibold">{title}</h2>

      {/* Left Button */}
      <button
        type="button"
        onClick={() => handleScroll('left')}
        aria-label="Scroll left"
        disabled={atStart}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-10
          hidden md:flex h-40 w-10 items-center justify-center
          transition
          ${atStart
            ? 'pointer-events-none opacity-0' // completely hide when at start
            : 'bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 hover:opacity-100'
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
        `}
      >
        <ChevronLeft size={28} />
      </button>


      {/* Track (drag to scroll) */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={containerRef}
          className="flex gap-3 pb-4 cursor-grab active:cursor-grabbing select-none"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.06}
          onUpdate={(latest) => {
            const cur = typeof latest.x === 'number' ? latest.x : 0
            setX(cur)
          }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        >
          {hasItems ? (
            items.map((m) => (
              <motion.div
                key={m.id}
                className="shrink-0"
                // remove whileHover scale here
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              >
                <MovieCard m={m} horizontal onOpen={onOpen} />
              </motion.div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 w-64 md:w-80 animate-pulse rounded-md bg-white/10" />
            ))
          )}
        </motion.div>
      </div>

      {/* Right Button */}
      <button
        type="button"
        onClick={() => handleScroll('right')}
        aria-label="Scroll right"
        disabled={atEnd || max === 0}
        className="
          absolute right-0 top-1/2 -translate-y-1/2 z-10
          hidden md:flex h-40 w-10 items-center justify-center
          bg-gradient-to-l from-white/30 to-transparent
          opacity-0 group-hover:opacity-100 transition
          disabled:opacity-30 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
        "
      >
        <ChevronRight size={28} />
      </button>
    </section>
  )
}
