// apps/web/presentation/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import HeroVideo from './HeroVideo'
import type { PosterItem } from '../types'
import { useMovieTrailer } from '@/data/movies.hooks'
import { Info, Play } from 'lucide-react'

export default function Hero({ item }: { item: PosterItem & { id: number } }) {
  const poster = item.backdropUrl ?? item.posterUrl
  const trailer = useMovieTrailer(item.id)

  return (
    <section className="relative w-full overflow-hidden
                        aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9] xl:aspect-[16/7]">
      <HeroVideo
        youTubeKey={trailer.data?.site === 'YouTube' ? trailer.data.key : undefined}
        poster={poster}
        respectReducedMotion={false}
      />

      {/* Copy */}
      <div
        className="
          relative z-10 h-full max-w-7xl mx-auto 
          px-4 sm:px-6 lg:px-8
          flex items-end md:items-center lg:items-end
          pb-10 md:pb-20 lg:pb-24
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl"
        >
          <h1
            className="
              text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
              font-extrabold tracking-tight leading-tight sm:leading-snug
            "
          >
            {item.title}
          </h1>

          {item.overview && (
            <p
              className="
                mt-2 sm:mt-3 
                text-white/85 
                text-xs sm:text-sm md:text-base 
                line-clamp-3 sm:line-clamp-3 md:line-clamp-4
              "
            >
              {item.overview}
            </p>
          )}

          <div className="mt-4 sm:mt-5 flex flex-wrap gap-3">
            <button
              className="
                rounded-md px-3 sm:px-4 py-1.5 sm:py-2 
                bg-white text-black font-semibold text-xs sm:text-sm
                hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60
              "
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" stroke="none" />
                Play
              </span>
            </button>

            <button
              className="
                rounded-md px-3 sm:px-4 py-1.5 sm:py-2 
                bg-white/20 hover:bg-white/30 ring-1 ring-white/30 
                focus:outline-none focus:ring-2 focus:ring-white/60 
                text-xs sm:text-sm
              "
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                More Info
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
