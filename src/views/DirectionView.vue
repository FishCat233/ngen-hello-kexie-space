<script setup lang="ts">
import { ref, watch, computed, nextTick, type Component } from 'vue'
import {
  Globe,
  Coffee,
  Gamepad2,
  Smartphone,
  Palette,
  Cpu,
  Brain,
  Clapperboard,
  Binary,
  Lock,
  Shield,
  Terminal,
  FileText,
} from 'lucide-vue-next'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import type { HLJSApi } from 'highlight.js'
import { preprocessBilibili } from '../utils/remark-bilibili'
import BackButton from '../components/BackButton.vue'

// highlight.js 体积大且仅个别方向文档含代码块：只在页面真的出现 <pre><code>
// 时才动态拉取 core + 实际用到的语言与样式，避免拖累 markdown chunk
let hljsPromise: Promise<HLJSApi> | null = null
function loadHljs(): Promise<HLJSApi> {
  if (!hljsPromise) {
    hljsPromise = (async () => {
      const [core, c, bash] = await Promise.all([
        import('highlight.js/lib/core'),
        import('highlight.js/lib/languages/c'),
        import('highlight.js/lib/languages/bash'),
        import('highlight.js/styles/github-dark.css'),
      ])
      const hljs = core.default
      hljs.registerLanguage('c', c.default)
      hljs.registerLanguage('cpp', c.default)
      hljs.registerLanguage('bash', bash.default)
      hljs.registerLanguage('shell', bash.default)
      return hljs
    })()
  }
  return hljsPromise
}

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

const directionIcons: Record<string, Component> = {
  frontend: Globe,
  backend: Coffee,
  game: Gamepad2,
  app: Smartphone,
  ui: Palette,
  hardware: Cpu,
  'deep-learning': Brain,
  video: Clapperboard,
  reverse: Binary,
  crypto: Lock,
  'web-security': Shield,
  pwn: Terminal,
  editing: FileText,
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

const directionIcon = computed(() => directionIcons[props.id] || FileText)

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
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(processed)
    htmlContent.value = String(result).replace(/<img /g, '<img loading="lazy" decoding="async" ')
  } catch {
    error.value = '加载内容失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

watch(htmlContent, async () => {
  await nextTick()
  const blocks = document.querySelectorAll('.markdown-body pre code')
  if (blocks.length === 0) return
  const hljs = await loadHljs()
  blocks.forEach((block) => {
    hljs.highlightElement(block as HTMLElement)
  })
})

watch(() => props.id, loadMarkdown, { immediate: true })
</script>

<template>
  <div class="direction-page">
    <div class="direction-container">
      <BackButton />

      <!-- 内容就绪前显示文档骨架屏 -->
      <div v-if="loading" class="markdown-content" aria-hidden="true">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line" style="width: 100%"></div>
        <div class="skeleton skeleton-line" style="width: 92%"></div>
        <div class="skeleton skeleton-line" style="width: 78%"></div>
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-line" style="width: 86%"></div>
        <div class="skeleton skeleton-line" style="width: 64%"></div>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-button" @click="loadMarkdown">重试</button>
      </div>

      <article v-else class="markdown-content">
        <h1 class="direction-title">
          <span class="title-icon"><component :is="directionIcon" :size="20" /></span>
          {{ directionName }}
        </h1>
        <div class="markdown-body" v-html="htmlContent"></div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.direction-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 20px 40px;
}

.direction-container {
  max-width: 900px;
  margin: 0 auto;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-text);
}

/* 文档骨架屏：模拟标题 + 段落 + 插图布局 */
.skeleton-title {
  width: 38%;
  height: 32px;
  margin-bottom: 32px;
}

.skeleton-line {
  height: 14px;
  margin: 12px 0;
}

.skeleton-image {
  height: 220px;
  margin: 24px 0;
  border-radius: var(--radius-md);
}

.retry-button {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-pill);
  font-size: var(--text-ui);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: var(--color-primary-bright);
}

.markdown-content {
  position: relative;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 40px;
}

.direction-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 32px 0;
  padding-top: 4px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-line);
}

/* 方向专属图标框 */
.title-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
}

.markdown-body {
  color: var(--color-text);
  line-height: var(--leading-relaxed);
  font-size: var(--text-body);
}

.markdown-body :deep(h1) {
  display: none;
}

.markdown-body :deep(h2) {
  font-size: var(--text-h4);
  font-weight: 600;
  color: var(--color-primary);
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-line);
}

.markdown-body :deep(h3) {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-primary-bright);
  margin: 24px 0 12px 0;
}

.markdown-body :deep(p) {
  margin: 16px 0;
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  color: var(--color-primary-bright);
  text-decoration: underline;
}

/* 文档插图：限高防止长截图撑爆版面，等比缩放不裁切 */
.markdown-body :deep(img) {
  display: block;
  max-width: 100%;
  max-height: 420px;
  width: auto;
  height: auto;
  margin: 16px auto;
  border-radius: var(--radius-sm);
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

.markdown-body :deep(em) {
  font-style: italic;
}

.markdown-body :deep(strong) {
  font-weight: 700;
}

.markdown-body :deep(code) {
  background: var(--color-primary-dim);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-ui);
  color: var(--color-primary-bright);
}

.markdown-body :deep(pre) {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  margin: 16px 0;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-dim);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-line);
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
  border: 1px solid var(--color-line);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--color-surface);
  font-weight: 600;
  color: var(--color-primary);
}

/* ---- Bilibili 视频卡片 ---- */
.markdown-body :deep(.bilibili-card) {
  margin: 24px 0;
  border-radius: var(--radius-md);
  background: var(--color-surface);
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
  font-size: var(--text-sm);
  color: var(--color-primary-bright);
  text-decoration: none;
  border-top: 1px solid var(--color-line);
  transition: background-color 0.2s ease;
}

.markdown-body :deep(.bilibili-link:hover) {
  background: var(--color-primary);
  color: var(--color-white);
}

@media (max-width: 768px) {
  .direction-page {
    padding: 72px 16px 24px;
  }

  .markdown-content {
    padding: 24px;
  }
}
</style>
