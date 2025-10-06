'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/series', label: 'Series' },
  { href: '/movies', label: 'Movies' },
  { href: '/my-list', label: 'My List' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-6 py-3">
          <Link href="/" className="text-[22px] font-black text-[oklch(0.72_0.23_29)]">
            Nextflix
          </Link>
          <ul className="hidden md:flex items-center gap-5 text-sm text-white/80">
            {tabs.map(t => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`hover:text-white ${pathname === t.href ? 'text-white' : ''}`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-4">
            <input
              placeholder="Search"
              className="hidden sm:block bg-white/5 text-sm rounded px-3 py-1.5 outline-none focus:ring-2 ring-white/30"
            />
            <button
              className="rounded px-3 py-1.5 bg-[oklch(0.6_0.22_29)] hover:bg-[oklch(0.65_0.22_29)] text-white text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
