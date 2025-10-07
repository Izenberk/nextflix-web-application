// apps/web/presentation/components/MovieDetailModal.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from '@/components/ui/dialog'
import { Play, Plus, Check, Download, X, Volume2, VolumeX, ThumbsUp } from 'lucide-react'
import type { MovieSummary } from '@/domain/movies'
import { getMovieById } from '@/data/movies.repo'
import { useMovieModal } from '@/state/movieModal.store'

type FullMovie = MovieSummary & {
  overview?: string | null
  genres?: { id: number; name: string }[]
  runtime?: number | null
  releaseDate?: string | null
  voteAverage?: number | null
  originalTitle?: string | null
  originalLanguage?: string | null
  popularity?: number | null
}

type Props = { open: boolean; onOpenChange: (next: boolean) => void; movie: MovieSummary | null }

export default function MovieDetailModal({ open, onOpenChange, movie }: Props) {
  const [loading, setLoading] = useState(false)
  const [full, setFull] = useState<FullMovie | null>(null)
  const [inListLocal, setInListLocal] = useState(false)
  const [mutedLocal, setMutedLocal] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!open || !movie) return
      setLoading(true)
      try {
        const data = await getMovieById(String(movie.id))
        if (mounted) setFull({ ...movie, ...data })
      } catch {
        if (mounted) setFull(movie as FullMovie)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [open, movie])

  const img = full?.backdropUrl ?? full?.posterUrl ?? movie?.backdropUrl ?? movie?.posterUrl
  const title = full?.title ?? movie?.title ?? '—'
  const year = useMemo(() => (full?.releaseDate ? String(full.releaseDate).slice(0, 4) : '—'), [full?.releaseDate])
  const runtimeText = useMemo(() => {
    const r = full?.runtime; if (!r || r <= 0) return '—'
    const h = Math.floor(r / 60); const m = r % 60; return h ? `${h}h ${m}m` : `${m}m`
  }, [full?.runtime])

  const vote = typeof full?.voteAverage === 'number' ? full.voteAverage.toFixed(1) : null
  const showReadMore = (full?.overview?.length ?? 0) > 300

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose
        className="
          w-[min(92vw,900px)] max-w-none p-0
          overflow-hidden overflow-y-auto md:max-h-[85vh]
          rounded-xl md:rounded-2xl
          bg-neutral-950 text-white border border-white/10 shadow-2xl
        "
      >
        {/* Close */}
        <DialogClose
          aria-label="Close"
          className="
            group absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center
            rounded-full bg-black/60 ring-1 ring-white/20
            transition-colors motion-safe:transition-transform duration-200
            hover:bg-black/70 hover:ring-white/40 hover:backdrop-blur-sm
            active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
          "
        >
          <X className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        </DialogClose>

        {/* Billboard */}
        <div className="relative h-[clamp(180px,36vw,360px)] w-full">
          {img ? (
            <Image src={img} alt={title} fill className="object-cover transition-opacity" priority />
          ) : (
            <div className="grid h-full w-full place-items-center bg-neutral-900 text-neutral-400">No Image</div>
          )}
          {/* gradients inherit rounding so corners stay perfect */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            style={{ borderRadius: 'inherit' }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            style={{ borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' }}
          />

          {/* Title + primary actions */}
          <div className="absolute bottom-4 left-5 right-5">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-semibold text-black ring-1 ring-white/20 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Play className="h-5 w-5" />
                  <span>Play</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInListLocal(v => !v)}
                  aria-label={inListLocal ? 'Remove from My List' : 'Add to My List'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {inListLocal ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  aria-label="Download"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Mute */}
          <button
            type="button"
            onClick={() => setMutedLocal(v => !v)}
            aria-label={mutedLocal ? 'Unmute' : 'Mute'}
            className="absolute bottom-4 right-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 ring-1 ring-white/20 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {mutedLocal ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>

        {/* Details */}
        <div className="grid gap-5 p-5 md:grid-cols-[3fr,2fr] md:p-6">
          {/* LEFT: facts → genres → overview */}
          <div className="space-y-4">
            {/* Quick facts as compact chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5">{year}</span>
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5">{runtimeText}</span>
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5">HD</span>
              {vote && (
                <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5">★ {vote}</span>
              )}
            </div>

            {/* Genres as badges */}
            {full?.genres?.length ? (
              <div className="flex flex-wrap gap-2 text-xs text-white/90">
                {full.genres.map(g => (
                  <span key={g.id} className="rounded border border-white/15 bg-white/5 px-2 py-0.5">
                    {g.name}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Overview with Read more/less */}
            <div className="space-y-2">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-3/6 animate-pulse rounded bg-white/10" />
                </div>
              ) : full?.overview ? (
                <>
                  <p className={`${expanded ? '' : 'line-clamp-5'} leading-relaxed text-neutral-200`}>
                    {full.overview}
                  </p>
                  {showReadMore && (
                    <button
                      type="button"
                      onClick={() => setExpanded(v => !v)}
                      className="text-sm text-white/80 underline-offset-4 hover:underline"
                    >
                      {expanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-neutral-400">No overview available.</p>
              )}
            </div>

            {/* Secondary actions (de-emphasized) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70"
                aria-label="Like"
                type="button"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70"
                aria-label={inListLocal ? 'Remove from My List' : 'Add to My List'}
                type="button"
                onClick={() => setInListLocal(v => !v)}
              >
                {inListLocal ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/20 hover:bg-black/70"
                aria-label="Download"
                type="button"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: compact info card */}
          <aside className="text-sm text-neutral-300">
            <div className="rounded-lg border border-white/10 p-4">
              <div className="mb-2 font-semibold">Info</div>
              <div className="grid gap-1.5">
                <div>
                  <span className="text-neutral-400">Original Title:</span>{' '}
                  {full?.originalTitle ?? title}
                </div>
                <div>
                  <span className="text-neutral-400">Language:</span>{' '}
                  {full?.originalLanguage ?? '—'}
                </div>
                <div>
                  <span className="text-neutral-400">Popularity:</span>{' '}
                  {typeof full?.popularity === 'number' ? Math.round(full.popularity) : '—'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}


/** Named wrapper that connects the same UI to the global store. Mount once under <Providers>. */
export function MovieDetailModalGlobal() {
  const { open, movie, closeModal } = useMovieModal()
  return (
    <MovieDetailModal
      open={open}
      onOpenChange={(next) => { if (!next) closeModal() }}
      movie={movie}
    />
  )
}
