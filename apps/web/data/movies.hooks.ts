'use client'
import { useQuery } from '@tanstack/react-query'
import {
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
  fetchTrending,
  getMovieVideos,
  type Paged,
  type MovieVideo,
} from './movies.repo'
import type { MovieSummary } from '@/domain/movies'

const base = { suspense: true, useErrorBoundary: true, staleTime: 60_000 as const }

export const usePopularMovies    = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','popular',page],     queryFn:()=>fetchPopular(page),     ...base })
export const useTopRatedMovies   = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','top-rated',page],   queryFn:()=>fetchTopRated(page),    ...base })
export const useNowPlayingMovies = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','now-playing',page], queryFn:()=>fetchNowPlaying(page),  ...base })

// WARNING: Only enable this if your API supports /movies/trending
export const useTrendingMovies   = (page=1, window:'day'|'week'='day') =>
  useQuery<Paged<MovieSummary>>({ queryKey:['movies','trending',page,window], queryFn:()=>fetchTrending(page, window), ...base })

// --- Hero trailer ---
export const useMovieTrailer = (movieId?: number) =>
  useQuery<MovieVideo | null>({
    queryKey: ['movies','videos','trailer', movieId],
    enabled: !!movieId,
    queryFn: async () => {
      if (!movieId) return null
      const list = await getMovieVideos(movieId, { language: 'en-US', includeVideoLanguage: 'en,null' })
      if (!list.length) return null
      return (
        list.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
        list.find(v => v.site === 'YouTube' && v.type === 'Trailer') ??
        list.find(v => v.site === 'YouTube' && v.type === 'Teaser') ??
        list.find(v => v.site === 'YouTube') ?? // clip/featurette/etc.
        null
      )
    },
    suspense: true, useErrorBoundary: true, staleTime: 60_000,
  })
