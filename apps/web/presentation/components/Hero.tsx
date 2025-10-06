'use client'

import { motion } from 'framer-motion'
import type { PosterItem } from '../types'

export default function Hero({ item }: { item: PosterItem }) {
  const bg = item.backdropUrl ?? item.posterUrl
  return (
    <section className="relative aspect-[16/7] w-full overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden
      />
      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      {/* Copy */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-end pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{item.title}</h1>
          {item.overview && (
            <p className="mt-3 text-white/80 line-clamp-3">{item.overview}</p>
          )}
          <div className="mt-5 flex gap-3">
            <button className="rounded-md px-4 py-2 bg-white text-black font-semibold hover:opacity-90">
              ▶ Play
            </button>
            <button className="rounded-md px-4 py-2 bg-white/20 hover:bg-white/30">
              ℹ More Info
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
