import type { MovieSummary } from './movie.entity';
export type ListOpts = { language?: string; region?: string };

export interface GetUpcomingMoviesPort {
  fetchUpcoming(page?: number, opts?: ListOpts): Promise<MovieSummary[]>;
}

export class GetUpcomingMovies {
  constructor(private readonly port: GetUpcomingMoviesPort) {}
  execute(page = 1, opts?: ListOpts) {
    return this.port.fetchUpcoming(page, opts);
  }
}
