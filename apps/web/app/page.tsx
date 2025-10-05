'use client';

import Row from '@/presentation/components/Row';
import { RowSkeleton } from '@/presentation/components/RowSkeleton';
import { usePopularMovies } from '@/presentation/hooks/useMovies';

export default function HomePage() {
  const { isLoading, isError, error, isEmpty, isSuccess, data } = usePopularMovies(1);

  return (
    <main className="px-6 py-6 space-y-8">
      <header className="text-2xl font-bold">Nextflix</header>

      {isLoading && <RowSkeleton />}

      {isError && (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-4">
          <p className="font-medium">Failed to load popular movies.</p>
          <p className="text-sm opacity-80">{error?.message}</p>
        </div>
      )}

      {isSuccess && isEmpty && (
        <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="font-medium">No movies available.</p>
          <p className="text-sm opacity-80">Try again later.</p>
        </div>
      )}

      {isSuccess && !isEmpty && <Row title="Popular on Nextflix" items={data!.items} />}
    </main>
  );
}
