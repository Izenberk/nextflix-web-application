// apps/web/presentation/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/tv-shows', label: 'TV Shows' },
  { href: '/movies', label: 'Movies' },
  { href: '/new-popular', label: 'New & Popular' },
  { href: '/my-list', label: 'My List' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50',
        'h-[68px]',
        'antialiased cursor-default select-none',
        'transition-[background-color] duration-[400ms] ease-linear',
        scrolled
          ? 'bg-[#000000]'
          : 'bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_10%,rgba(0,0,0,0)_100%)]',
      ].join(' ')}
      style={{
        fontFamily:
          'GraphikTH, "Netflix Sans", "Helvetica Neue", "Segoe UI", Roboto, Ubuntu, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <nav
        className={[
          'mx-auto w-full max-w-[1400px]',
          'h-full flex items-center',
          'px-[22px] sm:px-[32px] md:px-[41px]',
        ].join(' ')}
      >
        {/* Left: Logo + Tabs */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[25px] font-black leading-none text-[#e50914]" // Netflix red
          >
            Nextflix
          </Link>

          {/* Desktop tabs */}
          <ul className="hidden md:flex items-center gap-5 text-[11px] leading-[15px] text-[#e5e5e5]/80">
            {tabs.map(t => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`hover:text-[#ffffff] transition ${
                    pathname === t.href ? 'text-[#ffffff]' : ''
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile primary links */}
          <ul className="md:hidden flex items-center gap-5 text-[13px] text-[#ffffff]">
            <li><Link href="/tv-shows">TV Shows</Link></li>
            <li><Link href="/movies">Movies</Link></li>
            <li className="flex items-center">
              <button
                aria-label="Categories"
                className="flex items-center gap-1 text-[#ffffff]"
              >
                Categories <ChevronDown size={16} />
              </button>
            </li>
          </ul>
        </div>

        {/* Right Controls */}
        <div className="ml-auto flex items-center gap-4">
          <Search
            size={18}
            className="hidden sm:block text-[#b3b3b3] hover:text-[#ffffff] cursor-pointer"
          />
          <Bell
            size={18}
            className="hidden sm:block text-[#b3b3b3] hover:text-[#ffffff] cursor-pointer"
          />
          <button
            className="text-[11px] font-semibold rounded px-3 py-1.5 text-[#ffffff] bg-[#e50914] hover:bg-[#f40612]"
          >
            Sign In
          </button>
        </div>
      </nav>
    </header>
  )
}
