import axios from 'axios';
import type { TmdbPaged, TmdbMovieRaw } from './tmdb.types';

const BASE_URL = 'https://api.themoviedb.org/3';
export type ListOpts = { language?: string; region?: string };

export type TmdbVideo = {
  id: string;
  iso_639_1?: string | null;
  iso_3166_1?: string | null;
  name: string;
  key: string;
  site: 'YouTube' | 'Vimeo';
  size?: number;
  type: 'Trailer' | 'Teaser' | 'Clip' | string;
  official?: boolean;
  published_at?: string;
};

export async function getPopularMovies(
  apiKey: string,
  page = 1,
  opts?: ListOpts,
) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/popular`,
    {
      params: {
        api_key: apiKey,
        page,
        language,
        ...(region ? { region } : {}),
      },
    },
  );
  return res.data;
}

export async function getTopRatedMovies(
  apiKey: string,
  page = 1,
  opts?: ListOpts,
) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/top_rated`,
    {
      params: {
        api_key: apiKey,
        page,
        language,
        ...(region ? { region } : {}),
      },
    },
  );
  return res.data;
}

export async function getUpcomingMovies(
  apiKey: string,
  page = 1,
  opts?: ListOpts,
) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/upcoming`,
    {
      params: {
        api_key: apiKey,
        page,
        language,
        ...(region ? { region } : {}),
      },
    },
  );
  return res.data;
}

export async function getNowPlayingMovies(
  apiKey: string,
  page = 1,
  opts?: ListOpts,
) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/now_playing`,
    {
      params: {
        api_key: apiKey,
        page,
        language,
        ...(region ? { region } : {}),
      },
    },
  );
  return res.data;
}

export async function getMovieVideos(
  apiKey: string,
  movieId: number,
  opts?: { language?: string; includeVideoLanguage?: string }, // e.g. 'en,null'
) {
  const { language = 'en-US', includeVideoLanguage = 'en,null' } = opts ?? {};
  const res = await axios.get<{ id: number; results: TmdbVideo[] }>(
    `${BASE_URL}/movie/${movieId}/videos`,
    {
      params: {
        api_key: apiKey,
        language,
        include_video_language: includeVideoLanguage,
      },
    },
  );
  return res.data;
}
