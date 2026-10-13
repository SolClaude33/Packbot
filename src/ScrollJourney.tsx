import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const steps = [
  { number: '1', title: 'Choose the right bot', copy: 'Start with research, sniping, trading, or a launch. Give Orbit the objective when a job needs the whole crew.', link: '#pack', label: 'Meet your bot' },
  { number: '2', title: 'Make the setup yours', copy: 'Give it a name and brief. Open the controls built for that bot and add your inputs.', link: '#builder', label: 'Create a setup' },
  { number: '3', title: 'Keep your work together', copy: 'Save each setup, revisit the details, and switch between bots as your next job changes.', link: '/workspace', label: 'Open the workspace' },
]

export function ScrollJourney() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fallingRef = useRef<HTMLImageElement>(null)
  const landedRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const falling = fallingRef.current
    const landed = landedRef.current
    if (!section || !track || !falling || !landed) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let active = true

    const render = () => {
      frame = 0
      const travel = Math.max(0, track.clientHeight - falling.offsetHeight)
      falling.style.setProperty('--journey-travel', `${travel}px`)
      if (reduced.matches) {
        falling.style.opacity = '0'
        landed.style.opacity = '1'
        return
      }
      const rect = track.getBoundingClientRect()
      const viewport = window.innerHeight
      const progress = Math.min(1, Math.max(0, (viewport * .62 - rect.top - falling.offsetHeight * .5) / Math.max(1, rect.height - viewport * .25)))
      const landing = Math.min(1, Math.max(0, (progress - .86) / .14))
      falling.style.transform = `translate3d(0, ${travel * progress}px, 0) rotate(${-10 + progress * 20}deg)`
      falling.style.opacity = String(1 - landing)
      landed.style.opacity = String(landing)
    }

    const requestRender = () => {
      if (!active || frame) return
      frame = window.requestAnimationFrame(render)
    }
    const resize = new ResizeObserver(requestRender)
    resize.observe(section)
    resize.observe(track)
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender, { passive: true })
    reduced.addEventListener('change', requestRender)
    falling.addEventListener('load', requestRender)
    landed.addEventListener('load', requestRender)
    requestRender()

    return () => {
      active = false
      if (frame) window.cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      reduced.removeEventListener('change', requestRender)
      falling.removeEventListener('load', requestRender)
      landed.removeEventListener('load', requestRender)
    }
  }, [])

  return <section ref={sectionRef} className="how-section journey-section" id="how-it-works" data-reveal>
    <div className="section-heading"><p className="eyebrow">A good place to begin</p><h2>Your next job,<br /><span>in three simple steps.</span></h2></div>
    <div className="journey-layout">
      <div ref={trackRef} className="bloom-track" aria-hidden="true"><img ref={fallingRef} className="bloom-falling" src="/assets/bloom-falling.webp" alt="" loading="lazy" /><img ref={landedRef} className="bloom-landed" src="/assets/bloom.webp" alt="" loading="lazy" /></div>
      <div className="journey-steps" data-reveal-group>{steps.map((step) => <article key={step.number} data-reveal-item><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p><a href={step.link}>{step.label} <ArrowRight size={16} /></a></div></article>)}</div>
    </div>
  </section>
}
