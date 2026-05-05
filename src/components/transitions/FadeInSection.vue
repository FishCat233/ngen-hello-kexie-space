<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    duration?: number
    distance?: number
  }>(),
  {
    delay: 0,
    direction: 'up',
    duration: 400,
    distance: 20,
  },
)

const isVisible = ref(false)

onMounted(() => {
  const timer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)

  return () => clearTimeout(timer)
})

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
</script>

<template>
  <Transition name="fade-section">
    <div v-show="isVisible" class="fade-section" :style="{
      '--fade-delay': `${delay}ms`,
      '--fade-duration': `${duration}ms`,
      '--fade-transform': getTransform(),
    }">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.fade-section {
  will-change: opacity, transform;
}

.fade-section-enter-active {
  transition:
    opacity var(--fade-duration, 400ms) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--fade-delay, 0ms),
    transform var(--fade-duration, 400ms) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--fade-delay, 0ms);
}

.fade-section-enter-from {
  opacity: 0;
  transform: var(--fade-transform, translateY(20px));
}

.fade-section-enter-to {
  opacity: 1;
  transform: translateY(0) translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-section-enter-active {
    transition: none;
  }

  .fade-section-enter-from {
    opacity: 1;
    transform: none;
  }
}
</style>
