import { MovieSummary } from '@/domain/movies/movie.entity';

const img = (path?: string | null, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export function mapToMovieSummaries(payload: any): MovieSummary[] {
  return (payload?.results ?? []).map((m: any) => ({
    id: m.id,
    title: m.title ?? m.name ?? 'Untitled',
    posterUrl: img(m.poster_path, 'w342'),
    backdropUrl: img(m.backdrop_path, 'w780'),
    overview: m.overview ?? '',
    voteAverage: Number(m.vote_average ?? 0),
  }));
}
