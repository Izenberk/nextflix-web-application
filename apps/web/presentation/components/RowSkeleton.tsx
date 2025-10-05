export function RowSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-40 bg-neutral-800 rounded" />
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-40 h-60 bg-neutral-800 rounded" />
        ))}
      </div>
    </div>
  );
}