<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchComments, formatDate } from "../data/comments";
import type { Comment } from "../types/comment";

const comments = ref<Comment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const avatarErrors = ref<Record<number, boolean>>({});

const openGitHubProfile = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const openComment = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const handleAvatarError = (index: number) => {
  avatarErrors.value[index] = true;
};

const loadComments = async () => {
  loading.value = true;
  error.value = null;
  const result = await fetchComments();
  comments.value = result.comments;
  error.value = result.error;
  loading.value = false;
};

onMounted(() => {
  loadComments();
});
</script>

<template>
  <div class="comments-section">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载评论中...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ error }}</span>
      <button class="retry-button" @click="loadComments">重试</button>
    </div>

    <div v-else-if="comments.length === 0" class="empty-state">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        ></path>
      </svg>
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
            <div
              class="comment-author"
              @click.stop="openGitHubProfile(comment.user.html_url)"
            >
              <div class="author-avatar-wrapper">
                <img
                  v-if="!avatarErrors[index]"
                  :src="comment.user.avatar_url"
                  :alt="comment.user.login"
                  class="author-avatar"
                  @error="handleAvatarError(index)"
                />
                <div v-else class="author-avatar-placeholder">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <div class="author-info">
                <span class="author-name">{{ comment.user.login }}</span>
                <span class="comment-time">{{
                  formatDate(comment.created_at)
                }}</span>
              </div>
            </div>
          </div>

          <div class="comment-body" v-html="comment.body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  width: 100%;
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
  background: linear-gradient(
    135deg,
    var(--color-blue) 0%,
    var(--color-cyan) 100%
  );
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
  background: radial-gradient(
    circle at center,
    rgba(130, 212, 242, 0.15) 0%,
    transparent 70%
  );
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
  white-space: pre-wrap;
  word-break: break-word;
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
