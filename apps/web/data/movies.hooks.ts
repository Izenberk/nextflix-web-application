'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchPopular, fetchTopRated, fetchNowPlaying, fetchTrending, type Paged } from './movies.repo'
import type { MovieSummary } from '@/domain/movies'

const base = { suspense: true, useErrorBoundary: true, staleTime: 60_000 as const }

export const usePopularMovies    = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','popular',page],    queryFn:()=>fetchPopular(page),    ...base })
export const useTopRatedMovies   = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','top-rated',page],  queryFn:()=>fetchTopRated(page),   ...base })
export const useNowPlayingMovies = (page=1) => useQuery<Paged<MovieSummary>>({ queryKey:['movies','now-playing',page],queryFn:()=>fetchNowPlaying(page), ...base })
export const useTrendingMovies   = (page=1, window:'day'|'week'='day') =>
  useQuery<Paged<MovieSummary>>({ queryKey:['movies','trending',page,window], queryFn:()=>fetchTrending(page, window), ...base })
