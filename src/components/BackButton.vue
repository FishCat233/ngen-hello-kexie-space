<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <button class="back-button" @click="router.back()">
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
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 8px;
  color: var(--color-blue);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(130, 212, 242, 0.15);
  border-color: var(--color-blue);
}
</style>
