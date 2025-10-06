'use client'

import { Suspense } from 'react'
import Row from '@/presentation/components/Row'
import { SectionSkeleton, SectionErrorBoundary } from './SectionFallbacks'
import { useTrendingMovies, usePopularMovies, useTopRatedMovies, useNowPlayingMovies } from '@/data/movies.hooks'

function TrendingInner() {
  const { data } = useTrendingMovies()
  return <Row title="Trending Now" items={data?.items ?? []} />
}

function PopularInner() {
  const { data } = usePopularMovies()
  return <Row title="Popular on Nextflix" items={data?.items ?? []} />
}

function TopRatedInner() {
  const { data } = useTopRatedMovies()
  return <Row title="Top Rated" items={data?.items ?? []} />
}

function NowPlayingInner() {
  const { data } = useNowPlayingMovies()
  return <Row title="Now Playing" items={data?.items ?? []} />
}

export function TrendingRow() {
  return (
    <SectionErrorBoundary title="Trending Now">
      <Suspense fallback={<SectionSkeleton title="Trending Now" />}>
        <TrendingInner />
      </Suspense>
    </SectionErrorBoundary>
  )
}

export function PopularRow() {
  return (
    <SectionErrorBoundary title="Popular">
      <Suspense fallback={<SectionSkeleton title="Popular" />}>
        <PopularInner />
      </Suspense>
    </SectionErrorBoundary>
  )
}

export function TopRatedRow() {
  return (
    <SectionErrorBoundary title="Top Rated">
      <Suspense fallback={<SectionSkeleton title="Top Rated" />}>
        <TopRatedInner />
      </Suspense>
    </SectionErrorBoundary>
  )
}

export function NowPlayingRow() {
  return (
    <SectionErrorBoundary title="Now Playing">
      <Suspense fallback={<SectionSkeleton title="Now Playing" />}>
        <NowPlayingInner />
      </Suspense>
    </SectionErrorBoundary>
  )
}
