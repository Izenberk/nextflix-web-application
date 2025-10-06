'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPopular, fetchTrending, fetchTopRated, fetchNowPlaying } from './movies.repo'
import type { MovieSummary } from '@/domain/movies'

export type Paged<T> = { page: number; items: T[] }

const opts = {
  suspense: true,
  useErrorBoundary: true,
  staleTime: 60_000, // 1 min
}

export const useTrendingMovies   = (page = 1) => useQuery<Paged<MovieSummary>>({ queryKey: ['movies','trending',page],   queryFn: () => fetchTrending(page),   ...opts })
export const usePopularMovies    = (page = 1) => useQuery<Paged<MovieSummary>>({  queryKey: ['movies','popular',page],    queryFn: () => fetchPopular(page),    ...opts })
export const useTopRatedMovies   = (page = 1) => useQuery<Paged<MovieSummary>>({  queryKey: ['movies','top-rated',page],  queryFn: () => fetchTopRated(page),   ...opts })
export const useNowPlayingMovies = (page = 1) => useQuery<Paged<MovieSummary>>({  queryKey: ['movies','now-playing',page],queryFn: () => fetchNowPlaying(page), ...opts })
