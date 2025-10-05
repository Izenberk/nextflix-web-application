import axios from 'axios';

const TMDB = axios.create({ baseURL: 'https://api.themoviedb.org/3', timeout: 10000 });

export async function getPopularMovies(apiKey: string, page = 1) {
  const res = await TMDB.get('/movie/popular', { params: { api_key: apiKey, page, language: 'en-US' } });
  return res.data;
}
