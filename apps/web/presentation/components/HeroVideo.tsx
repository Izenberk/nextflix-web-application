'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

type Props = {
  youTubeKey?: string | null
  poster: string
  className?: string
  showVolumeToggle?: boolean
  respectReducedMotion?: boolean // set true if you want to honor OS setting
}

const VIDEO_ASPECT = 16 / 9
const YT_ORIGIN = 'https://www.youtube.com'

export default function HeroVideo({
  youTubeKey,
  poster,
  className = '',
  showVolumeToggle = true,
  respectReducedMotion = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const [muted, setMuted] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const cmdQueueRef = useRef<Array<{ func: string; args?: unknown[] }>>([])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Respect reduced motion only if asked
  useEffect(() => {
    if (!respectReducedMotion) { setReduceMotion(false); return }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [respectReducedMotion])

  // Build the embed src (after mount to avoid hydration mismatch)
  const src = useMemo(() => {
    if (!mounted || !youTubeKey || reduceMotion) return null
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const q = new URLSearchParams({
      enablejsapi: '1',
      autoplay: '1',
      mute: '1',
      controls: '0',
      playsinline: '1',
      loop: '1',
      playlist: youTubeKey, // required to loop a single video
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      ...(origin ? { origin } : {}),
    })
    return `https://www.youtube.com/embed/${youTubeKey}?${q.toString()}`
  }, [mounted, youTubeKey, reduceMotion])

  // Size/cover the hero
  const [iframeStyle, setIframeStyle] = useState<React.CSSProperties>({})
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const layout = () => {
      const r = el.getBoundingClientRect()
      const W = r.width, H = r.height
      if (!W || !H) return
      const containerAspect = W / H
      if (containerAspect > VIDEO_ASPECT) {
        const height = W / VIDEO_ASPECT
        setIframeStyle({ width: `${W}px`, height: `${height}px`, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' })
      } else {
        const width = H * VIDEO_ASPECT
        setIframeStyle({ width: `${width}px`, height: `${H}px`, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'absolute' })
      }
    }

    const ro = new ResizeObserver(() => layout())
    ro.observe(el)
    layout()
    return () => ro.disconnect()
  }, [])

  // Listen for YT messages (ready/state/info)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== YT_ORIGIN || typeof e.data !== 'string') return
      try {
        const data = JSON.parse(e.data)
        if (data?.event === 'onReady') {
          setPlayerReady(true)
        }
        // Some embeds never fire onReady, but they do send infoDelivery
        if (data?.event === 'infoDelivery' && data?.info) {
          setPlayerReady(true)
        }
      } catch { /* ignore */ }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Low-level postMessage
  function sendCommand(func: 'mute' | 'unMute' | 'playVideo' | 'pauseVideo' | 'setVolume', args: unknown[] = []) {
    const w = iframeRef.current?.contentWindow
    if (!w) return
    if (!playerReady) {
      cmdQueueRef.current.push({ func, args })
      return
    }
    w.postMessage(JSON.stringify({ event: 'command', func, args }), YT_ORIGIN)
  }

  // Handshake: tell the widget we are listening (fires on iframe load + a few retries)
  useEffect(() => {
    if (!src) return
    setPlayerReady(false)
    const iframe = iframeRef.current
    let tries = 0
    const maxTries = 8

    const ping = () => {
      tries++
      const w = iframe?.contentWindow
      if (w) {
        // 'channel: widget' works with the internal www-widgetapi
        w.postMessage(JSON.stringify({ event: 'listening', id: 'hero-yt', channel: 'widget' }), YT_ORIGIN)
      }
      if (!playerReady && tries < maxTries) {
        setTimeout(ping, 200)
      }
    }

    // attempt on load and also schedule retries
    const onload = () => ping()
    iframe?.addEventListener('load', onload)
    // kick an initial attempt in case load already happened
    setTimeout(ping, 200)

    return () => iframe?.removeEventListener('load', onload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // Flush queued commands once ready
  useEffect(() => {
    if (!playerReady || !iframeRef.current) return
    for (const c of cmdQueueRef.current) sendCommand(c.func as any, c.args)
    cmdQueueRef.current = []
    // Ensure it plays and matches current mute state
    sendCommand('playVideo')
    sendCommand(muted ? 'mute' : 'unMute')
    if (!muted) sendCommand('setVolume', [100])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady])

  // React to mute toggles (user gesture)
  useEffect(() => {
    if (!src) return
    sendCommand(muted ? 'mute' : 'unMute')
    if (!muted) sendCommand('setVolume', [100])
    sendCommand('playVideo')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, src])

  // Poster fallback if no src
  if (!src) {
    return (
      <div ref={rootRef} className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${poster})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`absolute inset-0 ${className}`}>
      <iframe
        ref={iframeRef}
        style={iframeStyle}
        className="pointer-events-none"
        src={src}
        title="Hero trailer"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={false}
        frameBorder="0"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        suppressHydrationWarning
      />
      {/* Scrim for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      {/* Mute toggle */}
      {showVolumeToggle && (
        <div
          className="
            absolute bottom-4 right-4 z-10
            md:bottom-16 md:right-8
            lg:bottom-20 lg:right-10
            hidden md:block
          "
        >
          <button
            type="button"
            aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
            aria-pressed={!muted}
            onClick={() => setMuted(m => !m)}
            className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-full bg-black/60 backdrop-blur-sm
              ring-1 ring-white/20 hover:bg-black/70
              focus:outline-none focus:ring-2 focus:ring-white/60
            "
          >
            {muted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
