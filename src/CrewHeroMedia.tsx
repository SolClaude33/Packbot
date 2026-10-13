import { useEffect, useRef, useState } from 'react'

const crew = [
  { id: 'scout', name: 'Scout' },
  { id: 'dash', name: 'Dash' },
  { id: 'orbit', name: 'Orbit' },
  { id: 'ledger', name: 'Ledger' },
  { id: 'bloom', name: 'Bloom' },
] as const

export function CrewHeroMedia() {
  const [motionAllowed, setMotionAllowed] = useState(() => window.matchMedia('(min-width: 641px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [posterReady, setPosterReady] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const frameRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 641px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(desktop.matches && !reduced.matches)
    desktop.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      desktop.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!motionAllowed || !posterReady || videoFailed || !frame || !video) return

    let cancelled = false
    let attempted = false
    const playOnce = () => {
      if (cancelled || attempted) return
      attempted = true
      video.currentTime = 0
      video.play().catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return
        setVideoVisible(false)
      })
    }

    if (!('IntersectionObserver' in window)) {
      playOnce()
      return () => {
        cancelled = true
        video.pause()
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      playOnce()
      observer.disconnect()
    }, { threshold: .42 })
    observer.observe(frame)

    return () => {
      cancelled = true
      observer.disconnect()
      video.pause()
    }
  }, [motionAllowed, posterReady, videoFailed])

  const replay = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setVideoVisible(false)
    })
  }

  const content = <>
    <div className="crew-cutout-fallback" aria-hidden={posterReady}>
      {crew.map((bot) => <img key={bot.id} className={`crew-cutout crew-cutout-${bot.id}`} src={`/assets/${bot.id}.webp`} alt="" draggable="false" />)}
    </div>
    {!posterFailed ? <img className={posterReady ? 'crew-hero-poster is-ready' : 'crew-hero-poster'} src="/assets/crew-hero.webp" alt="The five Packbot companions gathered together." fetchPriority="high" draggable="false" onLoad={() => setPosterReady(true)} onError={() => { setPosterReady(false); setPosterFailed(true) }} /> : null}
    {motionAllowed && posterReady && !posterFailed && !videoFailed ? <video ref={videoRef} className={videoVisible ? 'crew-hero-video is-visible' : 'crew-hero-video'} src="/assets/crew-hero.mp4" poster="/assets/crew-hero.webp" muted playsInline preload="metadata" aria-hidden="true" onPlaying={() => setVideoVisible(true)} onEnded={() => setVideoVisible(false)} onError={() => { setVideoFailed(true); setVideoVisible(false) }} /> : null}
  </>

  if (!motionAllowed || !posterReady || videoFailed) return <div className="crew-hero-frame crew-hero-static">{content}</div>

  return <button ref={frameRef} type="button" className="crew-hero-frame crew-hero-replay" onClick={replay} aria-label="Replay the Packbot crew greeting">
    {content}
  </button>
}
