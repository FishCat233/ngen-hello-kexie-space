<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { preprocessBilibili } from '../utils/remark-bilibili'
import BackButton from '../components/BackButton.vue'

const props = defineProps<{
  id: string
}>()

const htmlContent = ref('')
const loading = ref(true)
const error = ref('')

const directionNames: Record<string, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  game: '游戏开发',
  app: 'APP开发',
  ui: 'UI设计',
  hardware: '硬件开发',
  'deep-learning': '深度学习',
  video: '视频剪辑',
  reverse: '逆向工程',
  crypto: '密码学',
  'web-security': 'Web安全',
  pwn: 'PWN',
  editing: '编辑',
}

const fileNames: Record<string, string> = {
  frontend: 'frontend.md',
  backend: 'backend.md',
  game: 'game.md',
  app: 'app.md',
  ui: 'ui.md',
  hardware: 'hardware.md',
  'deep-learning': 'deep-learning.md',
  video: 'video.md',
  reverse: 'reverse.md',
  crypto: 'crypto.md',
  'web-security': 'web-security.md',
  pwn: 'pwn.md',
  editing: 'editing.md',
}

const directionName = computed(() => directionNames[props.id] || '未知方向')

const loadMarkdown = async () => {
  loading.value = true
  error.value = ''
  htmlContent.value = ''

  const fileName = fileNames[props.id]
  if (!fileName) {
    error.value = '未找到对应的方向内容'
    loading.value = false
    return
  }

  try {
    const response = await fetch(`/docs/introduction/${fileName}`)
    if (!response.ok) {
      throw new Error('Failed to load content')
    }
    const markdown = await response.text()
    const processed = preprocessBilibili(markdown)
    const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(processed)
    htmlContent.value = String(result)
  } catch {
    error.value = '加载内容失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

watch(() => props.id, loadMarkdown, { immediate: true })
</script>

<template>
  <div class="direction-page">
    <div class="direction-container">
      <BackButton />

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-button" @click="loadMarkdown">重试</button>
      </div>

      <article v-else class="markdown-content">
        <h1 class="direction-title"><span class="title-accent">#</span> {{ directionName }}</h1>
        <div class="markdown-body" v-html="htmlContent"></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.direction-page {
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.direction-container {
  max-width: 900px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-text);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-black);
  border-top-color: var(--color-blue);
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-button {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: var(--color-cyan);
}

.markdown-content {
  position: relative;
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  padding: 40px;
}

.direction-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 32px 0;
  padding-top: 4px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-cyan);
}

.title-accent {
  color: var(--color-blue);
}

.markdown-body {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 16px;
}

.markdown-body :deep(h1) {
  display: none;
}

.markdown-body :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-blue);
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-cyan);
}

.markdown-body :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-cyan);
  margin: 24px 0 12px 0;
}

.markdown-body :deep(p) {
  margin: 16px 0;
}

.markdown-body :deep(a) {
  color: var(--color-blue);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  color: var(--color-cyan);
  text-decoration: underline;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 16px 0;
}

.markdown-body :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
  list-style-type: disc;
}

.markdown-body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
  list-style-type: decimal;
}

.markdown-body :deep(li) {
  margin: 8px 0;
}

.markdown-body :deep(code) {
  background: var(--color-gray);
  padding: 2px 6px;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--color-cyan);
}

.markdown-body :deep(pre) {
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--color-text);
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-cyan);
  margin: 16px 0;
  padding: 8px 16px;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-cyan);
  margin: 32px 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 12px 16px;
  border: 1px solid var(--color-cyan);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--color-gray);
  font-weight: 600;
  color: var(--color-blue);
}

/* ---- Bilibili 视频卡片 ---- */
.markdown-body :deep(.bilibili-card) {
  margin: 24px 0;
  border: 1px solid var(--color-cyan);
  background: var(--color-black);
  overflow: hidden;
}

.markdown-body :deep(.bilibili-card-inner) {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
}

.markdown-body :deep(.bilibili-iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.markdown-body :deep(.bilibili-link) {
  display: block;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-cyan);
  text-decoration: none;
  border-top: 1px solid var(--color-cyan);
  transition: background-color 0.2s ease;
}

.markdown-body :deep(.bilibili-link:hover) {
  background: var(--color-gray);
  color: var(--color-blue);
}

@media (max-width: 768px) {
  .direction-page {
    padding: 72px 16px 24px;
  }

  .markdown-content {
    padding: 24px;
  }

  .direction-title {
    font-size: 28px;
  }

  .markdown-body :deep(h2) {
    font-size: 20px;
  }

  .markdown-body :deep(h3) {
    font-size: 18px;
  }

  .markdown-body {
    font-size: 15px;
  }
}
</style>
