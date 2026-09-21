<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <button class="back-button" @click="router.push('/')">
    <ArrowLeft :size="20" />
    <span>返回首页</span>
  </button>
</template>

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-white);
  font-size: var(--text-ui);
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 32px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background: var(--color-primary-bright);
}
</style>
