<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const router = useRouter()

const htmlContent = ref('')
const loading = ref(true)
const error = ref('')

const directionNames: Record<string, string> = {
  web: '前端开发',
  backend: '后端开发',
  game: '游戏开发',
  android: 'APP开发',
  ui: 'UI设计',
  embedded: '硬件开发',
  machinelearning: '深度学习',
  video: '视频剪辑',
  reverse: '逆向工程',
  crypto: '密码学',
  websecurity: 'Web安全',
  pwn: 'PWN',
  editing: '编辑',
}

const fileNames: Record<string, string> = {
  web: 'frontend.md',
  backend: 'backend.md',
  game: 'game.md',
  android: 'app.md',
  ui: 'ui.md',
  embedded: 'hardware.md',
  machinelearning: 'deep-learning.md',
  video: 'media-editing.md',
  reverse: 'reverse.md',
  crypto: 'crypt.md',
  websecurity: 'web-security.md',
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
    const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown)
    htmlContent.value = String(result)
  } catch {
    error.value = '加载内容失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

watch(() => props.id, loadMarkdown, { immediate: true })
</script>

<template>
  <div class="direction-page">
    <div class="direction-container">
      <button class="back-button" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回首页</span>
      </button>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-button" @click="loadMarkdown">重试</button>
      </div>

      <article v-else class="markdown-content">
        <h1 class="direction-title">{{ directionName }}</h1>
        <div class="markdown-body" v-html="htmlContent"></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.direction-page {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  background: transparent;
  padding: 80px 20px 40px;
}

.direction-container {
  max-width: 900px;
  margin: 0 auto;
}

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
}

.back-button:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  transform: translateX(-4px);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-white);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(130, 212, 242, 0.2);
  border-top-color: var(--color-blue);
  border-radius: 50%;
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
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  border: none;
  border-radius: 8px;
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(130, 212, 242, 0.4);
}

.markdown-content {
  position: relative;
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.direction-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 32px 0;
  padding-top: 4px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(130, 212, 242, 0.2);
}

.markdown-body {
  color: var(--color-white);
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
  border-bottom: 1px solid rgba(130, 212, 242, 0.2);
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
  transition: color 0.3s ease;
}

.markdown-body :deep(a:hover) {
  color: var(--color-cyan);
  text-decoration: underline;
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin: 8px 0;
}

.markdown-body :deep(code) {
  background: rgba(130, 212, 242, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  color: var(--color-cyan);
}

.markdown-body :deep(pre) {
  background: rgba(4, 8, 12, 0.8);
  border: 1px solid rgba(130, 212, 242, 0.2);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--color-white);
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-blue);
  margin: 16px 0;
  padding: 8px 16px;
  background: rgba(130, 212, 242, 0.05);
  border-radius: 0 8px 8px 0;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid rgba(130, 212, 242, 0.2);
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
  border: 1px solid rgba(130, 212, 242, 0.2);
  text-align: left;
}

.markdown-body :deep(th) {
  background: rgba(130, 212, 242, 0.1);
  font-weight: 600;
  color: var(--color-blue);
}

.markdown-body :deep(tr:nth-child(even)) {
  background: rgba(130, 212, 242, 0.03);
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
