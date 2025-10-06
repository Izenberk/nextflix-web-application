import type { MovieSummary } from './movie.entity';

export interface GetUpcomingMoviesPort {
  fetch(
    page?: number,
    opts?: { language?: string; region?: string },
  ): Promise<MovieSummary[]>;
}
export class GetUpcomingMovies {
  constructor(private readonly port: GetUpcomingMoviesPort) {}
  execute(page = 1, opts?: { language?: string; region?: string }) {
    return this.port.fetch(page, opts);
  }
}
