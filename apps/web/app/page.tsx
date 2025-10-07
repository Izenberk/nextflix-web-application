import { MoviesRow } from '@/presentation/sections/Rows'
import Providers from './providers'

export default function Page() {
  return (
    <Providers>
      <main className="space-y-12 pb-12">
        <section className="px-6 pt-20">
          <h1 className="text-4xl md:text-5xl font-bold">Nextflix Originals</h1>
          <p className="text-neutral-300 mt-3 max-w-xl text-sm md:text-base">
            Dive into a world of movies and series inspired by Netflix design, powered by TMDB API.
          </p>
        </section>

        <MoviesRow />
      </main>

      <footer className="py-10 text-center text-xs text-neutral-500">
        © Nextflix — a portfolio project by Korn
      </footer>
    </Providers>
  )
}
