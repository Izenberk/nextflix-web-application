import type { MovieSummary } from './movie.entity';

export interface GetTopRatedMoviesPort {
  fetch(
    page?: number,
    opts?: { language?: string; region?: string },
  ): Promise<MovieSummary[]>;
}
export class GetTopRatedMovies {
  constructor(private readonly port: GetTopRatedMoviesPort) {}
  execute(page = 1, opts?: { language?: string; region?: string }) {
    return this.port.fetch(page, opts);
  }
}
