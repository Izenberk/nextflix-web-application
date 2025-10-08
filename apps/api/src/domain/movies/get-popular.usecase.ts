import type { MovieSummary } from './movie.entity';

export type ListOpts = { language?: string; region?: string };

export interface GetPopularMoviesPort {
  fetchPopular(page?: number, opts?: ListOpts): Promise<MovieSummary[]>;
}

export class GetPopularMovies {
  constructor(private readonly port: GetPopularMoviesPort) {}
  execute(page = 1, opts?: ListOpts) {
    return this.port.fetchPopular(page, opts);
  }
}
