// api/src/movies/movies.service.ts
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

// Narrow the options we actually accept at this layer.
// Keeps TMDB details from leaking and lets you evolve later.
export type ListOpts = Readonly<{
  language?: string;
  region?: string;
}>;

export type VideoOpts = Readonly<{
  language?: string;
  includeVideoLanguage?: string; // e.g. 'en,null' to allow fallback
}>;

@Injectable()
export class MoviesService
  implements
    GetPopularMoviesPort,
    GetTopRatedMoviesPort,
    GetUpcomingMoviesPort,
    GetNowPlayingMoviesPort
{
  // Prefer readonly fields; avoids accidental reassignment
  private readonly popularUC = new GetPopularMovies(this);
  private readonly topRatedUC = new GetTopRatedMovies(this);
  private readonly upcomingUC = new GetUpcomingMovies(this);
  private readonly nowPlayingUC = new GetNowPlayingMovies(this);

  constructor(private readonly cfg: ConfigService) {}

  // Use getOrThrow for fail-fast, typed key access
  private get tmdbApiKey(): string {
    return this.cfg.getOrThrow<string>('TMDB_API_KEY');
  }

  // --- Internal helpers -----------------------------------------------------

  /** Adapts our public ListOpts -> TMDB client opts (type safe). */
  private toTmdbListOpts(opts?: ListOpts): TmdbListOpts | undefined {
    if (!opts) return undefined;
    const { language, region } = opts;
    // Return only defined keys to avoid sending undefined in query
    return {
      ...(language ? { language } : {}),
      ...(region ? { region } : {}),
    };
  }

  /** Defensive: ensure positive integer pages (service-level contract). */
  private sanitizePage(page?: number): number {
    if (!Number.isFinite(page as number)) return 1;
    const p = Math.trunc(page as number);
    return p >= 1 ? p : 1;
  }

  // --- Popular --------------------------------------------------------------

  async fetch(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const safePage = this.sanitizePage(page);
    const payload = await getPopularMovies(
      this.tmdbApiKey,
      safePage,
      this.toTmdbListOpts(opts),
    );
    return mapToMovieSummaries(payload);
  }

  getPopular(page = 1, opts?: ListOpts) {
    return this.popularUC.execute(this.sanitizePage(page), opts);
  }

  // --- Top Rated ------------------------------------------------------------

  async fetchTopRated(page = 1, opts?: ListOpts): Promise<MovieSummary[]> {
    const safePage = this.sanitizePage(page);
    const payload = await getTopRatedMovies(
      this.tmdbApiKey,
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
    const safePage = this.sanitizePage(page);
    const payload = await getUpcomingMovies(
      this.tmdbApiKey,
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
    const safePage = this.sanitizePage(page);
    const payload = await getNowPlayingMovies(
      this.tmdbApiKey,
      safePage,
      this.toTmdbListOpts(opts),
    );
    return mapToMovieSummaries(payload);
  }

  getNowPlaying(page = 1, opts?: ListOpts) {
    return this.nowPlayingUC.execute(this.sanitizePage(page), opts);
  }

  // --- Videos (trailers/teasers) -------------------------------------------

  /**
   * Fetches and returns videos sorted by quality preference:
   * YouTube > Vimeo, Trailer > Teaser > others, Official > not.
   * Returns an array already sorted best-first for easy FE consumption.
   */
  async fetchVideos(movieId: number, opts?: VideoOpts) {
    // No implicit coercion: require a valid numeric id
    if (!Number.isFinite(movieId) || movieId <= 0) {
      throw new TypeError('movieId must be a positive integer');
    }
    const payload = await getMovieVideos(this.tmdbApiKey, movieId, opts);
    const list = payload?.results ?? [];

    // Pure, typed sorting (no mutation of inputs)
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

  /** Public façade for controller/use cases. */
  getVideos(movieId: number, opts?: VideoOpts) {
    return this.fetchVideos(movieId, opts);
  }
}
