'use client';
import type { MovieSummary } from '@/domain/movies';

export default function MovieCard({ m }: { m: MovieSummary }) {
  return (
    <div className="w-40 shrink-0">
      <div className="aspect-[2/3] bg-neutral-800 rounded overflow-hidden">
        {m.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-neutral-400">No Image</div>
        )}
      </div>
      <div className="mt-2 text-sm line-clamp-2">{m.title}</div>
    </div>
  );
}