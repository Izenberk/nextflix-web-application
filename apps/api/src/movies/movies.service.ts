import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPopularMovies } from '@/data/tmdb/tmdb.client';
import { mapToMovieSummaries } from '@/data/tmdb/tmdb.mappers';
import {
  GetPopularMovies,
  GetPopularMoviesPort,
} from '@/domain/movies/get-popular.usecase';
import { MovieSummary } from '@/domain/movies/movie.entity';

@Injectable()
export class MoviesService implements GetPopularMoviesPort {
  private readonly usecase = new GetPopularMovies(this);
  constructor(private readonly cfg: ConfigService) {}
  async fetch(page = 1): Promise<MovieSummary[]> {
    const key = this.cfg.get<string>('TMDB_API_KEY')!;
    const payload = await getPopularMovies(key, page);
    return mapToMovieSummaries(payload);
  }
  getPopular(page = 1) {
    return this.usecase.execute(page);
  }
}
