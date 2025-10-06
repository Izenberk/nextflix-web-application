import { apiGet } from './api'
import type { MovieSummary } from '@/domain/movies'
export type Paged<T> = { page: number; items: T[] }
type PageResp = { page?: number; items?: MovieSummary[] }

const toPage = (data: PageResp, fallbackPage: number): Paged<MovieSummary> => ({
  page: typeof data.page === 'number' ? data.page : fallbackPage,
  items: Array.isArray(data.items) ? data.items : [],
})

export const fetchPopular     = (page=1) => apiGet<PageResp>('/movies/popular',     { query:{page} }).then(d=>toPage(d,page))
export const fetchTopRated    = (page=1) => apiGet<PageResp>('/movies/top-rated',   { query:{page} }).then(d=>toPage(d,page))
export const fetchNowPlaying  = (page=1) => apiGet<PageResp>('/movies/now-playing', { query:{page} }).then(d=>toPage(d,page))
export const fetchTrending    = (page=1, window:'day'|'week'='day') =>
  apiGet<PageResp>('/movies/trending', { query:{page, window} }).then(d=>toPage(d,page))
