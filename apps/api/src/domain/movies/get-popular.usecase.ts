import { MovieSummary } from './movie.entity';
export interface GetPopularMoviesPort {
  fetch(page?: number): Promise<MovieSummary[]>;
}
export class GetPopularMovies {
  constructor(private readonly port: GetPopularMoviesPort) {}
  execute(page = 1) {
    return this.port.fetch(page);
  }
}
