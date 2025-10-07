'use client'
import { Suspense } from 'react'
import Row from '@/presentation/components/Row'
import { RowSkeleton } from '@/presentation/components/RowSkeleton'
import { usePopularMovies } from '@/data/movies.hooks'

function MoviesInner() {
  const { data } = usePopularMovies()
  return <Row title="Popular on Nextflix" items={data?.items ?? []} />
}

export function MoviesRow() {
  return (
    <Suspense fallback={<div className="px-4"><RowSkeleton /></div>}>
      <MoviesInner />
    </Suspense>
  )
}
