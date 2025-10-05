import { MovieSummaryDto } from './dto/movie-summary.dto';

type AnyMovie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  posterPath?: string;
  release_date?: string;
  releaseDate?: string;
  vote_average?: number;
  voteAverage?: number;
};

export function toMovieSummaryDto(m: AnyMovie): MovieSummaryDto {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview ?? '',
    posterPath: m.posterPath ?? m.poster_path ?? '',
    releaseDate: m.releaseDate ?? m.release_date ?? '',
    voteAverage: m.voteAverage ?? m.vote_average ?? 0,
  };
}
