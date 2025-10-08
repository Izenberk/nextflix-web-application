import type { MovieSummary } from './movie.entity';
export type ListOpts = { language?: string; region?: string };

export interface GetNowPlayingMoviesPort {
  fetchNowPlaying(page?: number, opts?: ListOpts): Promise<MovieSummary[]>;
}

export class GetNowPlayingMovies {
  constructor(private readonly port: GetNowPlayingMoviesPort) {}
  execute(page = 1, opts?: ListOpts) {
    return this.port.fetchNowPlaying(page, opts);
  }
}
