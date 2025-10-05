'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPopular } from '@/data/movies.repo';

export function usePopularMovies(page = 1) {
  const q = useQuery({
    queryKey: ['popular', page],
    queryFn: () => fetchPopular(page),
    staleTime: 60_000
  });

  return {
    isLoading: q.isLoading,
    isError: q.isError,
    error: (q.error as Error) || null,
    isSuccess: q.isSuccess,
    data: q.data,
    isEmpty: q.isSuccess && (q.data?.items?.length ?? 0) === 0
  };
}