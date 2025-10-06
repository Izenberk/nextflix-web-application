import type { TmdbPaged, TmdbMovieRaw } from '@/data/tmdb/tmdb.types';
import type { MovieSummary } from '@/domain/movies/movie.entity';

const IMG = {
  poster(p?: string | null): string | null {
    return p ? `https://image.tmdb.org/t/p/w342${p}` : null;
  },
  backdrop(p?: string | null): string | null {
    return p ? `https://image.tmdb.org/t/p/w780${p}` : null;
  },
};

export function mapToMovieSummaries(
  payload: TmdbPaged<TmdbMovieRaw>,
): MovieSummary[] {
  return payload.results.map(
    (m): MovieSummary => ({
      id: m.id,
      title: m.title ?? m.name ?? '',
      overview: m.overview ?? '',
      posterUrl: IMG.poster(m.poster_path), // string | null (never undefined)
      backdropUrl: IMG.backdrop(m.backdrop_path), // string | null (never undefined)
      releaseDate: m.release_date ?? m.first_air_date ?? null, // string | null
      voteAverage: typeof m.vote_average === 'number' ? m.vote_average : 0,
    }),
  );
}
