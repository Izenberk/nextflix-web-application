// apps/web/data/movies.hooks.ts
'use client'

import { useQuery } from '@tanstack/react-query'
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

/** Shared query options (v5: no `suspense` or `useErrorBoundary` here) */
const base = { staleTime: 60_000 as const }

/** Popular */
export const usePopularMovies = (page = 1) =>
  useQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopular(page),
    ...base,
  })

/** Top Rated */
export const useTopRatedMovies = (page = 1) =>
  useQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'top-rated', page],
    queryFn: () => fetchTopRated(page),
    ...base,
  })

/** Now Playing */
export const useNowPlayingMovies = (page = 1) =>
  useQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'now-playing', page],
    queryFn: () => fetchNowPlaying(page),
    ...base,
  })

/** Upcoming */
export const useUpcomingMovies = (page = 1) =>
  useQuery<Paged<MovieSummary>>({
    queryKey: ['movies', 'upcoming', page],
    queryFn: () => fetchUpcoming(page),
    ...base,
  })

/** Hero trailer (best-effort YouTube pick with graceful fallback) */
export const useMovieTrailer = (movieId?: number) =>
  useQuery<MovieVideo | null>({
    queryKey: ['movies', 'videos', 'trailer', movieId],
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
    ...base,
  })
