import type { Directive } from 'vue'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer: IntersectionObserver | null = null

const getObserver = () => {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 },
    )
  }
  return observer
}

export const reveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('is-revealed')
      return
    }
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
