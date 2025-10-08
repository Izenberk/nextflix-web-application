import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getMovieVideos,
  type ListOpts as TmdbListOpts,
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

export type ListOpts = Readonly<{ language?: string; region?: string }>;
export type VideoOpts = Readonly<{
  language?: string;
  includeVideoLanguage?: string;
}>;

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

  /** Fail fast if v4 token not present */
  private get tmdbTokenV4(): string {
    const t = this.cfg.get<string>('TMDB_ACCESS_TOKEN_V4');
    if (!t) throw new Error('TMDB_ACCESS_TOKEN_V4 is not set');
    return t;
  }

  private toTmdbListOpts(opts?: ListOpts): TmdbListOpts | undefined {
    if (!opts) return undefined;
    const { language, region } = opts;
    return {
      ...(language ? { language } : {}),
      ...(region ? { region } : {}),
    };
  }

  private sanitizePage(page?: number): number {
    if (!Number.isFinite(page as number)) return 1;
    const p = Math.trunc(page as number);
    return p >= 1 ? p : 1;
  }

  // --- Popular --------------------------------------------------------------
  async fetchPopular(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    void this.tmdbTokenV4; // trigger presence check
    const safePage = this.sanitizePage(page);
    const payload = await getPopularMovies(safePage, this.toTmdbListOpts(opts));
    return mapToMovieSummaries(payload);
  }
  getPopular(page = 1, opts?: ListOpts) {
    return this.popularUC.execute(this.sanitizePage(page), opts);
  }

  // --- Top Rated ------------------------------------------------------------
  async fetchTopRated(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    void this.tmdbTokenV4;
    const safePage = this.sanitizePage(page);
    const payload = await getTopRatedMovies(
      safePage,
      this.toTmdbListOpts(opts),
    );
    return mapToMovieSummaries(payload);
  }
  getTopRated(page = 1, opts?: ListOpts) {
    return this.topRatedUC.execute(this.sanitizePage(page), opts);
  }

  // --- Upcoming -------------------------------------------------------------
  async fetchUpcoming(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    void this.tmdbTokenV4;
    const safePage = this.sanitizePage(page);
    const payload = await getUpcomingMovies(
      safePage,
      this.toTmdbListOpts(opts),
    );
    return mapToMovieSummaries(payload);
  }
  getUpcoming(page = 1, opts?: ListOpts) {
    return this.upcomingUC.execute(this.sanitizePage(page), opts);
  }

  // --- Now Playing ----------------------------------------------------------
  async fetchNowPlaying(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    void this.tmdbTokenV4;
    const safePage = this.sanitizePage(page);
    const payload = await getNowPlayingMovies(
      safePage,
      this.toTmdbListOpts(opts),
    );
    return mapToMovieSummaries(payload);
  }
  getNowPlaying(page = 1, opts?: ListOpts) {
    return this.nowPlayingUC.execute(this.sanitizePage(page), opts);
  }

  // --- Videos ---------------------------------------------------------------
  async fetchVideos(movieId: number, opts?: VideoOpts) {
    void this.tmdbTokenV4;
    if (!Number.isFinite(movieId) || movieId <= 0) {
      throw new TypeError('movieId must be a positive integer');
    }
    const payload = await getMovieVideos(movieId, opts);
    const list = payload?.results ?? [];
    return [...list]
      .map((v) => ({
        v,
        score:
          (v.site === 'YouTube' ? 10 : 0) +
          (v.type === 'Trailer' ? 5 : v.type === 'Teaser' ? 3 : 0) +
          (v.official ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.v);
  }
  getVideos(movieId: number, opts?: VideoOpts) {
    return this.fetchVideos(movieId, opts);
  }
}
