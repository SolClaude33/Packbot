import { useEffect, useRef, useState } from 'react'

export function OrbitMedia() {
  const [motionAllowed, setMotionAllowed] = useState(() => window.matchMedia('(min-width: 641px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [failed, setFailed] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const frameRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 641px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(desktop.matches && !reduced.matches)
    desktop.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => { desktop.removeEventListener('change', update); reduced.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const video = videoRef.current
    if (!motionAllowed || failed || !frame || !video) return
    let cancelled = false
    let attempted = false
    const play = () => {
      if (attempted || cancelled) return
      attempted = true
      video.play().catch(() => { if (!cancelled) setVideoVisible(false) })
    }
    if (!('IntersectionObserver' in window)) { play(); return () => { cancelled = true; video.pause() } }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { play(); observer.disconnect() }
    }, { threshold: .5 })
    observer.observe(frame)
    return () => { cancelled = true; observer.disconnect(); video.pause() }
  }, [motionAllowed, failed])

  const image = <img src={motionAllowed && !failed ? '/assets/orbit-motion-poster.webp' : '/assets/orbit.webp'} alt="Orbit, the Packbot orchestrator" fetchPriority="high" draggable="false" onError={() => { if (motionAllowed && !failed) setFailed(true) }} />
  if (!motionAllowed || failed) return <div className="orbit-motion-frame orbit-static">{image}</div>

  const replay = () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => setVideoVisible(false))
  }

  return <button ref={frameRef} type="button" className={`orbit-motion-frame orbit-replay${videoVisible ? ' is-playing' : ''}`} onClick={replay} aria-label="Replay Orbit's greeting" title="Replay Orbit's greeting">
    {image}
    <video ref={videoRef} src="/assets/orbit-greeting.mp4" poster="/assets/orbit-motion-poster.webp" muted playsInline preload="metadata" aria-hidden="true" onPlaying={() => setVideoVisible(true)} onError={() => setFailed(true)} />
  </button>
}
