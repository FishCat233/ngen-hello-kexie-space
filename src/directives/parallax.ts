import type { Directive } from 'vue'

const cleanups = new WeakMap<HTMLElement, () => void>()

export const parallax: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const factor = binding.value ?? 0.08
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * factor
      el.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    cleanups.set(el, () => window.removeEventListener('scroll', onScroll))
  },
  unmounted(el) {
    cleanups.get(el)?.()
  },
}
