// apps/api/src/data/tmdb/tmdb.client.ts
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

function authHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN_V4;
  if (!token) throw new Error('TMDB_ACCESS_TOKEN_V4 is not set');
  return {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getPopularMovies(page = 1, opts?: ListOpts) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/popular`,
    {
      headers: authHeaders(),
      params: { page, language, ...(region ? { region } : {}) },
    },
  );
  return res.data;
}

export async function getTopRatedMovies(page = 1, opts?: ListOpts) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/top_rated`,
    {
      headers: authHeaders(),
      params: { page, language, ...(region ? { region } : {}) },
    },
  );
  return res.data;
}

export async function getUpcomingMovies(page = 1, opts?: ListOpts) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/upcoming`,
    {
      headers: authHeaders(),
      params: { page, language, ...(region ? { region } : {}) },
    },
  );
  return res.data;
}

export async function getNowPlayingMovies(page = 1, opts?: ListOpts) {
  const { language = 'en-US', region } = opts ?? {};
  const res = await axios.get<TmdbPaged<TmdbMovieRaw>>(
    `${BASE_URL}/movie/now_playing`,
    {
      headers: authHeaders(),
      params: { page, language, ...(region ? { region } : {}) },
    },
  );
  return res.data;
}

export async function getMovieVideos(
  movieId: number,
  opts?: { language?: string; includeVideoLanguage?: string },
) {
  const { language = 'en-US', includeVideoLanguage = 'en,null' } = opts ?? {};
  const res = await axios.get<{ id: number; results: TmdbVideo[] }>(
    `${BASE_URL}/movie/${movieId}/videos`,
    {
      headers: authHeaders(),
      params: { language, include_video_language: includeVideoLanguage },
    },
  );
  return res.data;
}
