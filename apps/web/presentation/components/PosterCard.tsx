'use client'

import Image from 'next/image'
import type { PosterItem } from '../types'

export default function PosterCard({ item, onClick }: { item: PosterItem; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-[140px] md:w-[180px] lg:w-[200px] shrink-0 focus:outline-none"
      aria-label={item.title}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.posterUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                        bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      {/* title + meta */}
      <div className="mt-2 text-left">
        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
        <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
          {item.year && <span>{item.year}</span>}
          {typeof item.rating === 'number' && (
            <span className="rounded bg-white/10 px-1.5 py-0.5">{item.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </button>
  )
}
