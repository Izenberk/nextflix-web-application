import type { MovieSummary } from './movie.entity';

export interface GetNowPlayingMoviesPort {
  fetch(
    page?: number,
    opts?: { language?: string; region?: string },
  ): Promise<MovieSummary[]>;
}
export class GetNowPlayingMovies {
  constructor(private readonly port: GetNowPlayingMoviesPort) {}
  execute(page = 1, opts?: { language?: string; region?: string }) {
    return this.port.fetch(page, opts);
  }
}
