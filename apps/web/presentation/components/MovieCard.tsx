// apps/web/presentation/components/MovieCard.tsx
'use client'
import Image from 'next/image'
import type { MovieSummary } from '@/domain/movies'
import { useMovieModal } from '@/state/movieModal.store'

type Props = { m: MovieSummary; horizontal?: boolean; onOpen?: (m: MovieSummary) => void }

export default function MovieCard({ m, horizontal = false, onOpen }: Props) {
  const img = m.backdropUrl ?? m.posterUrl
  const openModal = useMovieModal(s => s.openModal)

  const Wrapper: React.ElementType = 'button'
  const handleOpen = () => (onOpen ? onOpen(m) : openModal(m))

  const cardBase =
    'group relative shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'

  if (horizontal) {
    return (
      <Wrapper onClick={handleOpen} aria-label={`Open details for ${m.title}`} className={`${cardBase} w-64 md:w-80`}>
        <div className="group/card relative aspect-video rounded-md overflow-hidden bg-neutral-800">
          {img ? (
            <Image
              src={img}
              alt={m.title}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover transition-transform duration-300 transform-gpu will-change-transform group-hover/card:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-neutral-400">No Image</div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" style={{ borderRadius: 'inherit' }} />
          <div className="pointer-events-none absolute bottom-2 left-3 right-3 text-sm md:text-base font-semibold text-white drop-shadow-md line-clamp-1">
            {m.title}
          </div>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper onClick={handleOpen} aria-label={`Open details for ${m.title}`} className={`${cardBase} w-40 sm:w-48 md:w-56`}>
      <div className="group/card relative aspect-[2/3] rounded-lg overflow-hidden bg-neutral-800">
        {img ? (
          <Image
            src={img}
            alt={m.title}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
            className="object-cover transition-transform duration-300 transform-gpu will-change-transform group-hover/card:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-neutral-400">No Image</div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" style={{ borderBottomLeftRadius: 'inherit', borderBottomRightRadius: 'inherit' }} />
        <div className="pointer-events-none absolute bottom-2 left-3 right-3 text-sm md:text-base font-semibold text-white drop-shadow-md line-clamp-1">
          {m.title}
        </div>
      </div>
    </Wrapper>
  )
}
