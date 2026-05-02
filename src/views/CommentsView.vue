<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, MessageCircle, User, AlertCircle } from 'lucide-vue-next'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import DOMPurify from 'dompurify'
import { fetchComments, formatDate } from '../data/comments'
import type { Comment } from '../types/comment'
import TracerBullet from '../components/TracerBullet.vue'

const router = useRouter()
const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const avatarErrors = ref<Record<number, boolean>>({})
const renderedComments = ref<Record<number, string>>({})

const goBack = () => {
  router.push('/')
}

const openGitHubProfile = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const openComment = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const handleAvatarError = (index: number) => {
  avatarErrors.value[index] = true
}

const renderMarkdown = async (markdown: string): Promise<string> => {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown)
  const html = String(result)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'code',
      'pre',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'del',
      'ins',
      'sup',
      'sub',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

const loadComments = async () => {
  loading.value = true
  error.value = null
  const result = await fetchComments()
  comments.value = result.comments
  error.value = result.error

  // 渲染所有评论的 Markdown
  const rendered: Record<number, string> = {}
  for (const comment of result.comments) {
    rendered[comment.id] = await renderMarkdown(comment.body)
  }
  renderedComments.value = rendered

  loading.value = false
}

onMounted(() => {
  loadComments()
})
</script>

<template>
  <div class="comments-page">
    <TracerBullet :active="true" class="comments-tracer" />

    <div class="comments-container">
      <button class="back-button" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回首页</span>
      </button>

      <div class="comments-header">
        <div class="header-icon">
          <MessageCircle :size="32" />
        </div>
        <h1 class="comments-title">畅心所言</h1>
        <p class="comments-subtitle">在此留下您的心声吧~</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>加载评论中...</span>
      </div>

      <div v-else-if="error" class="error-state">
        <AlertCircle :size="24" />
        <span>{{ error }}</span>
        <button class="retry-button" @click="loadComments">重试</button>
      </div>

      <div v-else-if="comments.length === 0" class="empty-state">
        <MessageCircle :size="48" />
        <span>暂无评论，来发表第一条评论吧！</span>
        <a
          href="https://github.com/sanyuankexie/hello.kexie.space/issues/6"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          前往 GitHub 发表评论
        </a>
      </div>

      <div v-else class="comments-list">
        <div
          v-for="(comment, index) in comments"
          :key="comment.id"
          class="comment-card"
          @click="openComment(comment.html_url)"
        >
          <div class="comment-glow"></div>
          <div class="comment-content-wrapper">
            <div class="comment-header">
              <div class="comment-author" @click.stop="openGitHubProfile(comment.user.html_url)">
                <div class="author-avatar-wrapper">
                  <img
                    v-if="!avatarErrors[index]"
                    :src="comment.user.avatar_url"
                    :alt="comment.user.login"
                    class="author-avatar"
                    @error="handleAvatarError(index)"
                  />
                  <div v-else class="author-avatar-placeholder">
                    <User :size="20" />
                  </div>
                </div>
                <div class="author-info">
                  <span class="author-name">{{ comment.user.login }}</span>
                  <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="comment-body" v-html="renderedComments[comment.id]"></div>
          </div>
        </div>
      </div>

      <div class="comments-footer-fixed">
        <a
          href="https://github.com/sanyuankexie/hello.kexie.space/issues/6"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link-button"
        >
          <MessageCircle :size="16" />
          <span>在 GitHub 上发表评论</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-page {
  position: relative;
  min-height: 100vh;
  background: #04080c;
  padding: 80px 20px 100px;
  overflow-x: hidden;
}

.comments-tracer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.6;
}

.comments-container {
  position: relative;
  z-index: 10;
  max-width: 1400px;
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
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  transform: translateX(-4px);
}

.comments-header {
  text-align: center;
  margin-bottom: 48px;
}

.header-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(130, 212, 242, 0.2) 0%, rgba(111, 208, 206, 0.2) 100%);
  border-radius: 16px;
  color: var(--color-blue);
  margin: 0 auto 20px;
}

.comments-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  padding: 4px 0;
}

.comments-subtitle {
  font-size: 16px;
  color: var(--color-white);
  opacity: 0.7;
  margin: 0;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--color-white);
  opacity: 0.7;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(130, 212, 242, 0.2);
  border-top-color: var(--color-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  color: #ff6b6b;
}

.retry-button {
  padding: 8px 16px;
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 6px;
  color: var(--color-blue);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(130, 212, 242, 0.2);
}

.github-link {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.github-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(130, 212, 242, 0.4);
}

.comments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  align-items: start;
}

.comment-card {
  position: relative;
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: hidden;
  break-inside: avoid;
}

.comment-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(130, 212, 242, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.comment-card:hover {
  background: rgba(130, 212, 242, 0.06);
  border-color: rgba(130, 212, 242, 0.3);
  transform: translateY(-4px);
  box-shadow:
    0 8px 32px rgba(130, 212, 242, 0.15),
    0 0 20px rgba(130, 212, 242, 0.1);
}

.comment-card:hover .comment-glow {
  opacity: 1;
  animation: glowRotate 3s linear infinite;
}

@keyframes glowRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.comment-content-wrapper {
  position: relative;
  z-index: 1;
}

.comment-header {
  margin-bottom: 16px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.comment-author:hover {
  opacity: 0.8;
}

.author-avatar-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid rgba(130, 212, 242, 0.3);
  border-radius: 50%;
}

.author-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(130, 212, 242, 0.1);
  border: 2px solid rgba(130, 212, 242, 0.3);
  border-radius: 50%;
  color: var(--color-blue);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-blue);
}

.comment-time {
  font-size: 12px;
  color: var(--color-white);
  opacity: 0.6;
}

.comment-body {
  font-size: 14px;
  color: var(--color-white);
  line-height: 1.8;
  opacity: 0.9;
}

.comment-body :deep(p) {
  margin: 0 0 12px 0;
}

.comment-body :deep(p:last-child) {
  margin-bottom: 0;
}

.comment-body :deep(code) {
  background: rgba(130, 212, 242, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.comment-body :deep(pre) {
  background: rgba(130, 212, 242, 0.05);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.comment-body :deep(pre code) {
  background: none;
  padding: 0;
}

.comment-body :deep(a) {
  color: var(--color-blue);
  text-decoration: none;
}

.comment-body :deep(a:hover) {
  text-decoration: underline;
}

.comment-body :deep(ul),
.comment-body :deep(ol) {
  margin: 12px 0;
  padding-left: 20px;
}

.comment-body :deep(li) {
  margin: 4px 0;
}

.comment-body :deep(blockquote) {
  border-left: 3px solid var(--color-blue);
  margin: 12px 0;
  padding: 8px 12px;
  background: rgba(130, 212, 242, 0.05);
  border-radius: 0 8px 8px 0;
  opacity: 0.9;
}

.comment-body :deep(h1),
.comment-body :deep(h2),
.comment-body :deep(h3),
.comment-body :deep(h4),
.comment-body :deep(h5),
.comment-body :deep(h6) {
  font-weight: 600;
  color: var(--color-blue);
  margin: 16px 0 8px 0;
}

.comment-body :deep(h1) {
  font-size: 20px;
}

.comment-body :deep(h2) {
  font-size: 18px;
}

.comment-body :deep(h3) {
  font-size: 16px;
}

.comment-body :deep(h4),
.comment-body :deep(h5),
.comment-body :deep(h6) {
  font-size: 14px;
}

.comment-body :deep(del) {
  text-decoration: line-through;
  opacity: 0.6;
}

.comment-body :deep(ins) {
  text-decoration: underline;
}

.comment-body :deep(sup),
.comment-body :deep(sub) {
  font-size: 12px;
}

.comments-footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 20px;
  background: linear-gradient(
    to top,
    rgba(4, 8, 12, 1) 0%,
    rgba(4, 8, 12, 0.95) 60%,
    transparent 100%
  );
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.comments-footer-fixed .github-link-button {
  pointer-events: auto;
}

.github-link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(130, 212, 242, 0.3);
}

.github-link-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(130, 212, 242, 0.5);
}

@media (max-width: 1024px) {
  .comments-list {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .comments-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .comments-page {
    padding: 72px 16px 100px;
  }

  .comments-title {
    font-size: 28px;
  }

  .comment-card {
    padding: 16px;
  }

  .author-avatar-wrapper {
    width: 40px;
    height: 40px;
  }

  .author-name {
    font-size: 14px;
  }
}
</style>
