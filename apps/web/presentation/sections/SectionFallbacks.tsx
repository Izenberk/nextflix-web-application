'use client'

import { Component, type ReactNode } from 'react'
import { RowSkeleton } from '@/presentation/components/RowSkeleton'

export function SectionSkeleton() {
  // RowSkeleton already renders a title bar + cards shimmer
  return (
    <section className="px-4">
      <RowSkeleton />
    </section>
  )
}

export function SectionError({ title = 'Movies', error }: { title?: string; error: unknown }) {
  const msg = error instanceof Error ? error.message : 'Unknown error'
  return (
    <section className="px-4">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-sm text-red-400">Failed to load: {msg}</p>
    </section>
  )
}

export class SectionErrorBoundary extends Component<
  { title?: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch() { /* optional logging */ }
  render() {
    if (this.state.error) return <SectionError title={this.props.title} error={this.state.error} />
    return this.props.children
  }
}
