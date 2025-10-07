// apps/web/state/movieModal.store.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MovieSummary } from '@/domain/movies'

type State = {
  open: boolean
  movie: MovieSummary | null
  muted: boolean
  myList: Record<number, true> // set-like map of movie IDs
}

type Actions = {
  openModal: (m: MovieSummary) => void
  closeModal: () => void
  toggleMuted: () => void
  toggleList: (id: number) => void
  inList: (id?: number) => boolean
}

export const useMovieModal = create<State & Actions>()(
  persist(
    (set, get) => ({
      open: false,
      movie: null,
      muted: true,
      myList: {},

      openModal: (m) => set({ open: true, movie: m }),
      closeModal: () => set({ open: false }),
      toggleMuted: () => set(s => ({ muted: !s.muted })),
      toggleList: (id) =>
        set(s => {
          const next = { ...s.myList }
          if (next[id]) delete next[id]
          else next[id] = true
          return { myList: next }
        }),
      inList: (id) => (id ? !!get().myList[id] : false),
    }),
    {
      name: 'nextflix-ui', // persists muted + myList
      partialize: (s) => ({ muted: s.muted, myList: s.myList }),
    }
  )
)
