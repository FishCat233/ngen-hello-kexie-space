import { ref, onMounted, onUnmounted } from 'vue'

const SCROLL_THRESHOLD = 40

export function useNavbarScroll() {
  const isNavbarHidden = ref(false)
  let lastScrollY = 0
  let lastDirectionScrollY = 0

  function onScroll() {
    const currentScrollY = window.scrollY

    // 页面顶部始终显示
    if (currentScrollY <= SCROLL_THRESHOLD) {
      isNavbarHidden.value = false
      lastScrollY = currentScrollY
      lastDirectionScrollY = currentScrollY
      return
    }

    // 滚动量未达阈值，不切换
    if (Math.abs(currentScrollY - lastDirectionScrollY) < SCROLL_THRESHOLD) {
      lastScrollY = currentScrollY
      return
    }

    isNavbarHidden.value = currentScrollY > lastScrollY
    lastDirectionScrollY = currentScrollY
    lastScrollY = currentScrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isNavbarHidden }
}
