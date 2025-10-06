export function RowSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-5 w-40 rounded bg-white/10" />
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-60 w-40 rounded bg-white/5" />
        ))}
      </div>
    </div>
  )
}
