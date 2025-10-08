// apps/web/data/movies.hooks.ts
'use client'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { MovieSummary } from '@/domain/movies'
import {
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
  fetchUpcoming,
  getMovieVideos,
  type Paged,
  type MovieVideo,
} from './movies.repo'

/** Shared query options */
const base = {
  staleTime: 60_000 as const,
  gcTime: 5 * 60_000,       // optional: replaces cacheTime in v5
  retry: 1,                 // optional: fail fast for UI
  refetchOnWindowFocus: false as const,
}

/** Popular (suspense) */
export const usePopularMovies = (page = 1) =>
  useSuspenseQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopular(page),
    ...base,
  })

/** Top Rated (suspense) */
export const useTopRatedMovies = (page = 1) =>
  useSuspenseQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'top-rated', page],
    queryFn: () => fetchTopRated(page),
    ...base,
  })

/** Now Playing (suspense) */
export const useNowPlayingMovies = (page = 1) =>
  useSuspenseQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'now-playing', page],
    queryFn: () => fetchNowPlaying(page),
    ...base,
  })

/** Upcoming (suspense) */
export const useUpcomingMovies = (page = 1) =>
  useSuspenseQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => fetchUpcoming(page),
    ...base,
  })

/**
 * Hero trailer: keep non-suspense (optional resource).
 * We guard with `enabled` so it won’t fire without an id.
 */
export const useMovieTrailer = (movieId?: number) =>
  useQuery<MovieVideo | null>({
    queryKey: ['movies', 'videos', 'trailer', movieId ?? 'none'],
    enabled: !!movieId,
    queryFn: async () => {
      if (!movieId) return null
      const list = await getMovieVideos(movieId, {
        language: 'en-US',
        includeVideoLanguage: 'en,null',
      })
      if (!list.length) return null
      return (
        list.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
        list.find(v => v.site === 'YouTube' && v.type === 'Trailer') ??
        list.find(v => v.site === 'YouTube' && v.type === 'Teaser') ??
        list.find(v => v.site === 'YouTube') ??
        null
      )
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 0,
  })
