'use client';
import type { MovieSummary } from '@/domain/movies';
import MovieCard from './MovieCard';

export default function Row({ title, items }: { title: string; items: MovieSummary[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((m) => <MovieCard key={m.id} m={m} />)}
      </div>
    </section>
  );
}