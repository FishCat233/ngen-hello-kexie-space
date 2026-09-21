<script setup lang="ts">
defineProps<{
  value: string | number
}>()
</script>

<template>
  <Transition name="blur" mode="out-in">
    <span :key="String(value)" class="blur-number">{{ value }}</span>
  </Transition>
</template>

<style scoped>
.blur-number {
  font-family: var(--font-mono);
  font-size: var(--text-h5);
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

/* 高斯模糊切换：旧值模糊淡出，新值从模糊聚焦 */
.blur-enter-active,
.blur-leave-active {
  transition:
    filter 0.3s ease,
    opacity 0.3s ease;
}

.blur-enter-from,
.blur-leave-to {
  filter: blur(6px);
  opacity: 0;
}
</style>
