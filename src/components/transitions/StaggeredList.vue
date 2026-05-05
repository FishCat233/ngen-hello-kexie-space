<script setup lang="ts" generic="T">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    staggerDelay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    distance?: number
    scale?: boolean
  }>(),
  {
    staggerDelay: 80,
    duration: 500,
    direction: 'up',
    distance: 20,
    scale: true,
  },
)

const visibleItems = ref<Set<number>>(new Set())

onMounted(() => {
  props.items.forEach((_, index) => {
    const timer = setTimeout(() => {
      visibleItems.value.add(index)
    }, index * props.staggerDelay)

    return () => clearTimeout(timer)
  })
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

const getItemStyle = (index: number) => {
  const isVisible = visibleItems.value.has(index)
  return {
    '--stagger-delay': `${index * props.staggerDelay}ms`,
    '--stagger-duration': `${props.duration}ms`,
    '--stagger-transform': getTransform(),
    '--stagger-scale': props.scale ? '0.95' : '1',
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translateY(0) translateX(0) scale(1)'
      : `${getTransform()} scale(${props.scale ? 0.95 : 1})`,
    transition: `opacity ${props.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * props.staggerDelay}ms, transform ${props.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * props.staggerDelay}ms`,
  }
}
</script>

<template>
  <div class="staggered-list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="staggered-item"
      :class="{ 'is-visible': visibleItems.has(index) }"
      :style="getItemStyle(index)"
    >
      <slot :item="item" :index="index" />
    </div>
  </div>
</template>

<style scoped>
.staggered-list {
  display: contents;
}

.staggered-item {
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .staggered-item {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
