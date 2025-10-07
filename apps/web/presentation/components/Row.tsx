'use client'
import { useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MovieSummary } from '@/domain/movies'
import MovieCard from './MovieCard'

export default function Row({ title, items }: { title: string; items: MovieSummary[] }) {
  const [x, setX] = useState(0)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  async function handleScroll(direction: 'left' | 'right') {
    if (!containerRef.current) return
    const container = containerRef.current
    const maxScroll = container.scrollWidth - container.clientWidth

    // scroll by ~80% of visible width (bigger step = smoother experience)
    const step = container.clientWidth * 0.8
    const newX = direction === 'left'
      ? Math.min(x + step, 0)
      : Math.max(x - step, -maxScroll)

    setX(newX)
    await controls.start({
      x: newX,
      transition: { type: 'spring', stiffness: 90, damping: 18 },
    })
  }

  return (
    <section className="relative group space-y-2 px-6 overflow-hidden">
      <h2 className="text-lg md:text-xl font-semibold">{title}</h2>

      {/* Left Button */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                   hidden h-40 w-10 items-center justify-center
                   bg-gradient-to-r from-black/70 to-transparent
                   opacity-0 group-hover:flex group-hover:opacity-100
                   transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Motion container */}
      <motion.div
        ref={containerRef}
        className="flex gap-3 pb-4 cursor-grab motion-smooth"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -(containerRef.current?.scrollWidth ?? 0), right: 0 }}
        dragElastic={0.06}
        onUpdate={(latest) => setX(latest.x ?? 0)}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      >
        {items.map((m) => (
          <motion.div
            key={m.id}
            className="shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <MovieCard m={m} horizontal />
          </motion.div>
        ))}
      </motion.div>

      {/* Right Button */}
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                   hidden h-40 w-10 items-center justify-center
                   bg-gradient-to-l from-black/70 to-transparent
                   opacity-0 group-hover:flex group-hover:opacity-100
                   transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Optional: fade mask edges for Netflix vibe */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#141414] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#141414] to-transparent" />
    </section>
  )
}
