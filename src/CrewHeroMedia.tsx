import { useEffect, useRef, useState } from 'react'

const crew = [
  { id: 'scout', name: 'Scout' },
  { id: 'dash', name: 'Dash' },
  { id: 'orbit', name: 'Orbit' },
  { id: 'ledger', name: 'Ledger' },
  { id: 'bloom', name: 'Bloom' },
] as const

export function CrewHeroMedia() {
  const [motionAllowed, setMotionAllowed] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [posterReady, setPosterReady] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!reduced.matches)
    reduced.addEventListener('change', update)
    return () => reduced.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!motionAllowed || !posterReady || videoFailed || !frame || !video) return

    let cancelled = false
    let intersecting = false
    let playRequest = 0

    const syncPlayback = () => {
      const request = ++playRequest
      if (cancelled) return
      if (!intersecting || document.hidden) {
        video.pause()
        return
      }
      video.play().catch((error: unknown) => {
        if (cancelled || request !== playRequest || (error instanceof DOMException && error.name === 'AbortError')) return
        setVideoVisible(false)
      })
    }

    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      intersecting = entries.some((entry) => entry.isIntersecting)
      syncPlayback()
    }, { threshold: .15 }) : null

    if (observer) observer.observe(frame)
    else {
      intersecting = true
      syncPlayback()
    }
    document.addEventListener('visibilitychange', syncPlayback)

    return () => {
      cancelled = true
      playRequest += 1
      observer?.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      video.pause()
    }
  }, [motionAllowed, posterReady, videoFailed])

  const content = <>
    <div className="crew-cutout-fallback" aria-hidden={posterReady}>
      {crew.map((bot) => <img key={bot.id} className={`crew-cutout crew-cutout-${bot.id}`} src={`/assets/${bot.id}.webp`} alt="" draggable="false" />)}
    </div>
    {!posterFailed ? <img className={posterReady ? 'crew-hero-poster is-ready' : 'crew-hero-poster'} src="/assets/crew-hero.webp" alt="The five Packbot companions gathered together." fetchPriority="high" draggable="false" onLoad={() => setPosterReady(true)} onError={() => { setPosterReady(false); setPosterFailed(true) }} /> : null}
    {motionAllowed && posterReady && !posterFailed && !videoFailed ? <video ref={videoRef} className={videoVisible ? 'crew-hero-video is-visible' : 'crew-hero-video'} src="/assets/crew-hero.mp4" poster="/assets/crew-hero.webp" muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={() => setVideoVisible(true)} onError={() => { setVideoFailed(true); setVideoVisible(false) }} /> : null}
  </>

  return <div ref={frameRef} className="crew-hero-frame crew-hero-static">{content}</div>
}
