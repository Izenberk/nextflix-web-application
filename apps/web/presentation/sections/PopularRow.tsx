'use client'

import { useState } from 'react'
import type { MovieSummary } from '@/domain/movies'
import { usePopularMovies } from '@/data/movies.hooks'
import Row from '@/presentation/components/Row'
import MovieDetailModal from '@/presentation/components/MovieDetailModal'

export default function PopularRow() {
  // Suspense-enabled query (per your hooks config)
  const { data } = usePopularMovies(1)
  const items = data?.items ?? []

  // Modal state
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<MovieSummary | null>(null)

  return (
    <>
      <Row
        title="Popular on Nextflix"
        items={items}
        onOpen={(m) => {
          setSelected(m)
          setOpen(true)
        }}
      />
      <MovieDetailModal open={open} onOpenChange={setOpen} movie={selected} />
    </>
  )
}

// Optional skeleton for Suspense fallback (keeps look consistent)
export function PopularRowSkeleton() {
  return (
    <section className="space-y-2 px-6">
      <h2 className="text-lg md:text-xl font-semibold">Popular on Nextflix</h2>
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 w-64 md:w-80 animate-pulse rounded-md bg-white/10" />
        ))}
      </div>
    </section>
  )
}
