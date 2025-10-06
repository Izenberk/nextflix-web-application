import axios from 'axios';
import type { TmdbPaged, TmdbMovieRaw } from './tmdb.types';

const BASE_URL = 'https://api.themoviedb.org/3';
export type ListOpts = { language?: string; region?: string };

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
