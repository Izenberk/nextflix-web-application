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

// NOTE: Your backend doesn't implement /movies/trending yet. This will 404.
// Either add the endpoint or remove this function (and its hook) for now.
export const fetchTrending    = (page=1, window:'day'|'week'='day') =>
  apiGet<PageResp>('/movies/trending', { query:{page, window} }).then(d=>toPage(d,page))

// --- Videos for hero ---
export type MovieVideo = {
  name: string
  site: 'YouTube' | 'Vimeo'
  key: string
  type: string
  official?: boolean
  published_at?: string
}

export const getMovieVideos = async (id: number, opts?: { language?: string; includeVideoLanguage?: string }) => {
  const res = await apiGet<{ results?: MovieVideo[] }>(`/movies/${id}/videos`, {
    query: {
      ...(opts?.language ? { language: opts.language } : {}),
      ...(opts?.includeVideoLanguage ? { includeVideoLanguage: opts.includeVideoLanguage } : {}),
    }
  })
  const list = Array.isArray(res?.results) ? res.results : []
  if (process.env.NODE_ENV !== 'production') {
    // console.debug('[videos]', { id, count: list.length, sample: list.slice(0,2) })
  }
  return list
}

export type MovieDetail = MovieSummary & {
  overview?: string | null
  genres?: { id: number; name: string }[]
  runtime?: number | null
  releaseDate?: string | null
  voteAverage?: number | null
  originalTitle?: string | null
  originalLanguage?: string | null
  popularity?: number | null
}

export async function getMovieById(id: string | number): Promise<MovieDetail> {
  const res = await apiGet<MovieDetail>(`/movies/${id}`)
  // Defensive sanity checks
  return {
    id: res.id,
    title: res.title ?? '(Untitled)',
    backdropUrl: res.backdropUrl ?? null,
    posterUrl: res.posterUrl ?? null,
    overview: res.overview ?? null,
    genres: Array.isArray(res.genres) ? res.genres : [],
    runtime: typeof res.runtime === 'number' ? res.runtime : null,
    releaseDate: res.releaseDate ?? null,
    voteAverage: typeof res.voteAverage === 'number' ? res.voteAverage : null,
    originalTitle: res.originalTitle ?? null,
    originalLanguage: res.originalLanguage ?? null,
    popularity: typeof res.popularity === 'number' ? res.popularity : null,
  }
}


