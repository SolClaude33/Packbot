import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!elements.length) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | null = null

    const revealAll = () => elements.forEach((element) => { element.classList.remove('reveal-pending'); element.classList.add('is-revealed') })
    const start = () => {
      observer?.disconnect()
      observer = null
      if (motion.matches || !('IntersectionObserver' in window)) { revealAll(); return }
      elements.forEach((element) => { element.classList.remove('is-revealed'); element.classList.add('reveal-pending') })
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).classList.remove('reveal-pending')
          ;(entry.target as HTMLElement).classList.add('is-revealed')
          observer?.unobserve(entry.target)
        })
      }, { rootMargin: '0px 0px -8% 0px', threshold: .12 })
      elements.forEach((element) => observer?.observe(element))
    }

    start()
    motion.addEventListener('change', start)
    return () => { motion.removeEventListener('change', start); observer?.disconnect(); elements.forEach((element) => element.classList.remove('is-revealed', 'reveal-pending')) }
  }, [])
}
