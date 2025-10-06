import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  type ListOpts,
} from '@/data/tmdb/tmdb.client';
import { mapToMovieSummaries } from '@/data/tmdb/tmdb.mappers';

import {
  GetPopularMovies,
  GetPopularMoviesPort,
} from '@/domain/movies/get-popular.usecase';
import {
  GetTopRatedMovies,
  GetTopRatedMoviesPort,
} from '@/domain/movies/get-top-rated.usecase';
import {
  GetUpcomingMovies,
  GetUpcomingMoviesPort,
} from '@/domain/movies/get-upcoming.usecase';
import {
  GetNowPlayingMovies,
  GetNowPlayingMoviesPort,
} from '@/domain/movies/get-now-playing.usecase';
import type { MovieSummary } from '@/domain/movies/movie.entity';

@Injectable()
export class MoviesService
  implements
    GetPopularMoviesPort,
    GetTopRatedMoviesPort,
    GetUpcomingMoviesPort,
    GetNowPlayingMoviesPort
{
  private readonly popularUC = new GetPopularMovies(this);
  private readonly topRatedUC = new GetTopRatedMovies(this);
  private readonly upcomingUC = new GetUpcomingMovies(this);
  private readonly nowPlayingUC = new GetNowPlayingMovies(this);

  constructor(private readonly cfg: ConfigService) {}

  private apiKey(): string {
    const key = this.cfg.get<string>('TMDB_API_KEY');
    if (!key) throw new Error('TMDB_API_KEY is not configured');
    return key;
  }

  // Popular
  async fetch(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const payload = await getPopularMovies(this.apiKey(), page, opts);
    return mapToMovieSummaries(payload);
  }
  getPopular(page = 1, opts?: ListOpts) {
    return this.popularUC.execute(page, opts);
  }

  // Top Rated
  async fetchTopRated(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const payload = await getTopRatedMovies(this.apiKey(), page, opts);
    return mapToMovieSummaries(payload);
  }
  getTopRated(page = 1, opts?: ListOpts) {
    return this.topRatedUC.execute(page, opts);
  }

  // Upcoming
  async fetchUpcoming(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const payload = await getUpcomingMovies(this.apiKey(), page, opts);
    return mapToMovieSummaries(payload);
  }
  getUpcoming(page = 1, opts?: ListOpts) {
    return this.upcomingUC.execute(page, opts);
  }

  // Now Playing
  async fetchNowPlaying(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const payload = await getNowPlayingMovies(this.apiKey(), page, opts);
    return mapToMovieSummaries(payload);
  }
  getNowPlaying(page = 1, opts?: ListOpts) {
    return this.nowPlayingUC.execute(page, opts);
  }
}
