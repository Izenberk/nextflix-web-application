// domain/movies.ts

// ——— Public domain types ———
export type MovieSummary = {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;     // may be empty string from some APIs
  voteAverage: number;  // 0..10
  year?: number;        // derived convenience
};

export type MovieDetail = MovieSummary & {
  runtime?: number; // minutes
  genres?: { id: number; name: string }[];
  tagline?: string;
};

// ——— Image helpers ———
// Keep TMDB-specifics in helpers so the domain type stays provider-agnostic.
const TMDB_IMG = 'https://image.tmdb.org/t/p'
type PosterSize = 'w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original'
type BackdropSize = 'w300'|'w780'|'w1280'|'original'

const toUrl = (path: string | null | undefined, size: PosterSize | BackdropSize = 'w500') =>
  path && path.trim() ? `${TMDB_IMG}/${size}${path}` : null

export function buildImageUrl(
  path: string | null | undefined,
  size: PosterSize | BackdropSize = "w500"
): string | null {
  return path ? `${TMDB_IMG}/${size}${path}` : null;
}

// ——— Raw provider shapes ———
// Minimal TMDB fields we actually use (kept loose; no lib required).
export type TmdbMovie = {
  id: number;
  title?: string;
  name?: string; // TV sometimes uses "name"
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;     // "YYYY-MM-DD"
  first_air_date?: string;   // for TV
};

// ——— Mappers / Normalizers ———
export function mapTmdbToMovieSummary(m: TmdbMovie): MovieSummary {
  const vote = typeof m.vote_average === "number" && Number.isFinite(m.vote_average) ? m.vote_average : 0;
  const dateStr = m.release_date ?? m.first_air_date ?? "";
  const year = /^\d{4}/.test(dateStr) ? Number(dateStr.slice(0, 4)) : undefined;

  return {
    id: m.id,
    title: m.title ?? m.name ?? "Untitled",
    posterUrl: buildImageUrl(m.poster_path, "w500"),
    backdropUrl: buildImageUrl(m.backdrop_path, "w1280"),
    overview: m.overview ?? "",
    voteAverage: Math.min(10, Math.max(0, vote)),
    year,
  };
}


export function normalizeMoviesResponse(payload: unknown): MovieSummary[] {
  const any = payload as any

  const take = (arr: any[]): MovieSummary[] => {
    if (!arr || arr.length === 0) return []

    return arr.map((m: any) => {
      // accept any of these shapes:
      const rawPosterPath =
        m.posterUrl ? null : // if API already gave a full url, don't treat as path
        m.posterPath ?? m.poster_path ?? null

      const rawBackdropPath =
        m.backdropUrl ? null :
        m.backdropPath ?? m.backdrop_path ?? null

      const posterUrl =
        // prefer full url if provided by API, else build from path
        (typeof m.posterUrl === 'string' ? m.posterUrl : null) ?? toUrl(rawPosterPath, 'w500')

      const backdropUrl =
        (typeof m.backdropUrl === 'string' ? m.backdropUrl : null) ?? toUrl(rawBackdropPath, 'w1280')

      const vote =
        typeof m.voteAverage === 'number' ? m.voteAverage :
        typeof m.vote_average === 'number' ? m.vote_average : 0

      const date =
        m.releaseDate ?? m.release_date ?? m.first_air_date ?? ''

      return {
        id: Number(m.id),
        title: String(m.title ?? m.name ?? 'Untitled'),
        posterUrl,
        backdropUrl,
        overview: m.overview ?? '',
        voteAverage: Math.min(10, Math.max(0, vote)),
        // add year if you want:
        // year: /^\d{4}/.test(date) ? Number(date.slice(0,4)) : undefined,
      } as MovieSummary
    })
  }

  if (Array.isArray(any)) return take(any)
  if (Array.isArray(any?.items)) return take(any.items)
  if (Array.isArray(any?.results)) return take(any.results)
  return []
}

