'use client'
import { Suspense } from 'react'
import Row from '@/presentation/components/Row'
import { RowSkeleton } from '@/presentation/components/RowSkeleton'
import { usePopularMovies, useTopRatedMovies, useNowPlayingMovies, useTrendingMovies } from '@/data/movies.hooks'

function PopularInner()    { const { data } = usePopularMovies();    return <Row title="Popular"         items={data?.items ?? []} /> }
function TopRatedInner()   { const { data } = useTopRatedMovies();   return <Row title="Top Rated"       items={data?.items ?? []} /> }
function NowPlayingInner() { const { data } = useNowPlayingMovies(); return <Row title="Now Playing"     items={data?.items ?? []} /> }
function TrendingInner()   { const { data } = useTrendingMovies();   return <Row title="Trending Now"    items={data?.items ?? []} /> }

const F = ({ title, children }: { title: string; children: React.ReactNode }) =>
  <Suspense fallback={<div className="px-4"><RowSkeleton /></div>}>{children}</Suspense>

export const PopularRow    = () => <F title="Popular"><PopularInner /></F>
export const TopRatedRow   = () => <F title="Top Rated"><TopRatedInner /></F>
export const NowPlayingRow = () => <F title="Now Playing"><NowPlayingInner /></F>
export const TrendingRow   = () => <F title="Trending Now"><TrendingInner /></F>
