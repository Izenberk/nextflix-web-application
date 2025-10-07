'use client'
import type { MovieSummary } from '@/domain/movies'

export default function MovieCard({
  m,
  horizontal = false,
}: {
  m: MovieSummary
  horizontal?: boolean
}) {
  const img = m.backdropUrl ?? m.posterUrl

  // ---- HORIZONTAL STYLE (Netflix row look) ----
  if (horizontal) {
    return (
      <div className="relative w-64 md:w-80 shrink-0 cursor-pointer">
        <div className="aspect-video bg-neutral-800 rounded-md overflow-hidden">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={m.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-neutral-400">
              No Image
            </div>
          )}
          {/* bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* title text over image */}
          <div className="absolute bottom-2 left-3 right-3 text-sm md:text-base font-semibold text-white drop-shadow-md line-clamp-1">
            {m.title}
          </div>
        </div>
      </div>
    )
  }

  // ---- VERTICAL POSTER STYLE (used for other rows) ----
  return (
    <div className="w-64 md:w-80 shrink-0 cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-800">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={m.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-neutral-400">
            No Image
          </div>
        )}

        {/* gradient overlay now clipped inside rounded container */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* title text */}
        <div className="absolute bottom-2 left-3 right-3 text-sm md:text-base font-semibold text-white drop-shadow-md line-clamp-1">
          {m.title}
        </div>
      </div>
    </div>
  )
}
