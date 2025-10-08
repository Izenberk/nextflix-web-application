import type { MovieSummary } from './movie.entity';
export type ListOpts = { language?: string; region?: string };

export interface GetTopRatedMoviesPort {
  fetchTopRated(page?: number, opts?: ListOpts): Promise<MovieSummary[]>;
}

export class GetTopRatedMovies {
  constructor(private readonly port: GetTopRatedMoviesPort) {}
  execute(page = 1, opts?: ListOpts) {
    return this.port.fetchTopRated(page, opts);
  }
}
