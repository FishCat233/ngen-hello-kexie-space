import { ref, onMounted, onUnmounted } from 'vue'

const PILL_THRESHOLD = 24

export function useNavbarScroll() {
  const isScrolled = ref(false)

  function onScroll() {
    isScrolled.value = window.scrollY > PILL_THRESHOLD
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isScrolled }
}
