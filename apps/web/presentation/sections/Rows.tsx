'use client'
import MovieCard from '@/presentation/components/MovieCard'
import type { MovieSummary } from '@/domain/movies'

type Props = { title: string; items?: MovieSummary[] | null }

export default function Rows({ title, items = [] }: Props) {
  const hasItems = Array.isArray(items) && items.length > 0

  return (
    <section className="space-y-3">
      <h2 className="px-4 text-lg font-semibold md:text-xl">{title}</h2>

      <div
        className="
          flex gap-3 overflow-x-auto px-4 pb-2
          scroll-smooth snap-x snap-mandatory
          scrollbar-hide
        "
        role="list"
        aria-label={`${title} movies`}
      >
        {hasItems ? (
          items.map((m) => (
            <div key={m.id} role="listitem" className="snap-start shrink-0">
              <MovieCard m={m} horizontal />
            </div>
          ))
        ) : (
          <div className="flex gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 w-64 md:w-80 animate-pulse rounded-md bg-white/10" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
