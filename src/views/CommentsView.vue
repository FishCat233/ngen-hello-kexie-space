<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessageCircle, User, AlertCircle } from 'lucide-vue-next'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import DOMPurify from 'dompurify'
import { fetchComments, formatDate } from '../data/comments'
import type { Comment } from '../types/comment'
import BackButton from '../components/BackButton.vue'

const comments = ref<Comment[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const avatarErrors = ref<Record<number, boolean>>({})
const renderedComments = ref<Record<number, string>>({})

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
    <div class="comments-container">
      <BackButton />

      <div class="comments-header">
        <div class="header-icon">
          <MessageCircle :size="32" />
        </div>
        <h1 class="comments-title"><span class="title-accent">#</span> 畅心所言</h1>
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
        <div class="comment-card comment-cta-card">
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

        <div
          v-for="(comment, index) in comments"
          :key="comment.id"
          class="comment-card"
          @click="openComment(comment.html_url)"
        >
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
    </div>
  </div>
</template>

<style scoped>
.comments-page {
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.comments-container {
  max-width: 1400px;
  margin: 0 auto;
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
  background: transparent;
  border: 2px solid var(--color-cyan);
  color: var(--color-cyan);
  margin: 0 auto 20px;
}

.comments-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.comments-subtitle {
  font-size: 16px;
  color: var(--color-text);
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
  color: var(--color-text);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-black);
  border-top-color: var(--color-blue);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-button {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid var(--color-cyan);
  color: var(--color-cyan);
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.retry-button:hover {
  background: var(--color-cyan);
  color: var(--color-white);
}

.github-link {
  padding: 10px 20px;
  background: var(--color-blue);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.github-link:hover {
  background: var(--color-cyan);
}

.comments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  align-items: start;
}

.comment-card {
  background: var(--color-gray);
  border: 2px solid var(--color-cyan);
  padding: 20px;
  cursor: pointer;
  break-inside: avoid;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.comment-card:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.comment-card:hover,
.comment-card:hover .author-name,
.comment-card:hover .comment-time,
.comment-card:hover .comment-body,
.comment-card:hover .comment-body :deep(*),
.comment-card:hover .comment-body :deep(a) {
  color: var(--color-white);
}

.comment-card:hover .comment-body :deep(code),
.comment-card:hover .comment-body :deep(pre) {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
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
}

.author-avatar-wrapper {
  width: 44px;
  height: 44px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--color-cyan);
}

.author-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--color-cyan);
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
  color: var(--color-text);
}

.comment-body {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.8;
}

.comment-body :deep(p) {
  margin: 0 0 12px 0;
}

.comment-body :deep(p:last-child) {
  margin-bottom: 0;
}

.comment-body :deep(code) {
  background: var(--color-light-cyan);
  padding: 2px 6px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--color-cyan);
}

.comment-body :deep(pre) {
  background: var(--color-gray);
  padding: 12px;
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
  border-left: 4px solid var(--color-cyan);
  margin: 12px 0;
  padding: 8px 12px;
  background: var(--color-light-cyan);
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
}

.comment-body :deep(ins) {
  text-decoration: underline;
}

.comment-body :deep(sup),
.comment-body :deep(sub) {
  font-size: 12px;
}

.comment-cta-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: default;
}

.comment-cta-card:hover {
  background: transparent;
  border-color: transparent;
}

.comment-cta-card .github-link-button {
  width: 100%;
  padding: 32px 24px;
  justify-content: center;
  font-size: 16px;
}

.github-link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-blue);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.github-link-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-white);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.github-link-button:hover {
  color: var(--color-black);
}

.github-link-button:hover::before {
  transform: translateX(0);
}

.github-link-button > * {
  position: relative;
  z-index: 1;
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
    padding: 72px 16px 40px;
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
