// apps/web/presentation/sections/UpcomingRow.tsx
'use client'

import { useState } from 'react'
import type { MovieSummary } from '@/domain/movies'
import { useUpcomingMovies } from '@/data/movies.hooks'
import Row from '@/presentation/components/Row'
import MovieDetailModal from '@/presentation/components/MovieDetailModal'

export default function UpcomingRow() {
  const { data } = useUpcomingMovies(1)
  const items = data?.items ?? []
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<MovieSummary | null>(null)

  return (
    <>
      <Row
        title="Upcoming"
        items={items}
        onOpen={(m) => { setSelected(m); setOpen(true) }}
      />
      <MovieDetailModal open={open} onOpenChange={setOpen} movie={selected} />
    </>
  )
}

export function UpcomingRowSkeleton() {
  return (
    <section className="space-y-2 px-6">
      <h2 className="text-lg md:text-xl font-semibold">Upcoming</h2>
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 w-64 md:w-80 animate-pulse rounded-md bg-white/10" />
        ))}
      </div>
    </section>
  )
}
