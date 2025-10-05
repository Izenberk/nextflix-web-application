import type { MovieSummary } from '@/domain/movies';
import { apiGet } from './api';

export async function fetchPopular(page = 1): Promise<{ page: number; items: MovieSummary[] }> {
  return apiGet(`/movies/popular?page=${page}`);
}