<script setup lang="ts">
defineProps<{
  mode?: 'out-in' | 'in-out' | 'default'
}>()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" :mode="mode || 'out-in'">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
