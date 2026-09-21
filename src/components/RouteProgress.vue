<script setup lang="ts">
import { useRouteProgress } from '../composables/useRouteProgress'

const { active } = useRouteProgress()
</script>

<template>
  <Transition name="route-progress">
    <div v-if="active" class="route-progress" aria-hidden="true">
      <div class="route-progress-bar"></div>
    </div>
  </Transition>
</template>

<style scoped>
/* 顶部细进度条：路由 chunk 加载期间的即时视觉反馈（不定态滑块，无需精确进度） */
.route-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 200;
  pointer-events: none;
  overflow: hidden;
}

.route-progress-bar {
  width: 40%;
  height: 100%;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-primary),
    var(--color-primary-bright)
  );
  animation: route-progress-slide 1s ease-in-out infinite;
}

@keyframes route-progress-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(350%);
  }
}

.route-progress-enter-active,
.route-progress-leave-active {
  transition: opacity 0.25s ease;
}

.route-progress-enter-from,
.route-progress-leave-to {
  opacity: 0;
}
</style>
