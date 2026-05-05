<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    threshold?: number
    rootMargin?: string
    duration?: number
    distance?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    once?: boolean
  }>(),
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    duration: 500,
    distance: 30,
    direction: 'up',
    once: true,
  },
)

const elementRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

const getTransform = () => {
  switch (props.direction) {
    case 'up':
      return `translateY(${props.distance}px)`
    case 'down':
      return `translateY(-${props.distance}px)`
    case 'left':
      return `translateX(${props.distance}px)`
    case 'right':
      return `translateX(-${props.distance}px)`
    default:
      return `translateY(${props.distance}px)`
  }
}

onMounted(() => {
  if (!elementRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (props.once && observer) {
            observer.disconnect()
          }
        } else if (!props.once) {
          isVisible.value = false
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin,
    },
  )

  observer.observe(elementRef.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div
    ref="elementRef"
    class="scroll-fade-in"
    :class="{ 'is-visible': isVisible }"
    :style="{
      '--scroll-duration': `${duration}ms`,
      '--scroll-distance': getTransform(),
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-fade-in {
  opacity: 0;
  transform: var(--scroll-distance, translateY(30px));
  transition:
    opacity var(--scroll-duration, 500ms) cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform var(--scroll-duration, 500ms) cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;
}

.scroll-fade-in.is-visible {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-fade-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
