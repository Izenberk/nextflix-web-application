import type { MovieSummary } from '@/domain/movies'
import { apiGet } from './api'
import { normalizeMoviesResponse } from '@/domain/movies' // from the domain helper we defined earlier

type PageResp = { page?: number; results?: unknown; items?: unknown }

type Paged<T> = { page: number; items: T[] }

function toPage<T>(data: PageResp | unknown, fallbackPage: number, items: T[]): Paged<T> {
  const p = (data as PageResp)?.page
  const page = typeof p === 'number' ? p : fallbackPage
  return { page, items }
}

export async function fetchPopular(page = 1): Promise<{ page: number; items: MovieSummary[] }> {
  const data = await apiGet<PageResp>('/movies/popular', { query: { page } })
  const items = normalizeMoviesResponse(data)
  return toPage<MovieSummary>(data, page, items)
}

export async function fetchTrending(page = 1): Promise<{ page: number; items: MovieSummary[] }> {
  const data = await apiGet<PageResp>('/movies/trending', { query: { page } })
  const items = normalizeMoviesResponse(data)
  return toPage<MovieSummary>(data, page, items)
}

export async function fetchTopRated(page = 1): Promise<{ page: number; items: MovieSummary[] }> {
  const data = await apiGet<PageResp>('/movies/top-rated', { query: { page } })
  const items = normalizeMoviesResponse(data)
  return toPage<MovieSummary>(data, page, items)
}

export async function fetchNowPlaying(page = 1): Promise<{ page: number; items: MovieSummary[] }> {
  const data = await apiGet<PageResp>('/movies/now-playing', { query: { page } })
  const items = normalizeMoviesResponse(data)
  return toPage<MovieSummary>(data, page, items)
}
