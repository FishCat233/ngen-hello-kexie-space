<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ExternalLink, User } from 'lucide-vue-next'
import { projects } from '../data/projects'

const router = useRouter()
const avatarRefs = useTemplateRef<HTMLImageElement[]>('avatarRefs')
const avatarErrors = ref<Record<number, boolean>>({})

const goBack = () => {
  router.push('/')
}

const openProject = (url: string) => {
  window.open(url, '_blank')
}

const handleAvatarError = (index: number) => {
  avatarErrors.value[index] = true
}
</script>

<template>
  <div class="projects-page">
    <div class="projects-container">
      <button class="back-button" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回首页</span>
      </button>

      <div class="projects-header">
        <h1 class="projects-title">科协优秀项目</h1>
        <p class="projects-subtitle">科协成员开发的优秀项目</p>
      </div>

      <div class="projects-grid">
        <div v-for="(project, index) in projects" :key="project.name" class="project-card"
          @click="openProject(project.url)">
          <div class="project-author">
            <div class="author-avatar-wrapper">
              <img v-if="!avatarErrors[index]" ref="avatarRefs" :src="project.authorAvatar" :alt="project.author"
                class="author-avatar" @error="handleAvatarError(index)" />
              <div v-else class="author-avatar-placeholder">
                <User :size="20" />
              </div>
            </div>
            <span class="author-name">{{ project.author }}</span>
          </div>

          <div class="project-content">
            <div class="project-main">
              <h3 class="project-name">
                {{ project.name }}
                <ExternalLink :size="16" class="project-link-icon" />
              </h3>
              <p class="project-description">{{ project.description }}</p>
            </div>

            <div class="project-meta">
              <div class="project-language">
                <span class="language-dot" :style="{ backgroundColor: project.languageColor }"></span>
                <span class="language-name">{{ project.language }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  background: #04080c;
  padding: 80px 20px 40px;
}

.projects-container {
  max-width: 1200px;
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

.projects-header {
  margin-bottom: 40px;
}

.projects-title {
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

.projects-subtitle {
  font-size: 16px;
  color: var(--color-white);
  opacity: 0.7;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.project-card {
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  background: rgba(130, 212, 242, 0.06);
  border-color: rgba(130, 212, 242, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(130, 212, 242, 0.1);
}

.project-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.author-avatar-wrapper {
  width: 40px;
  height: 40px;
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

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-white);
}

.project-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.project-main {
  flex: 1;
  min-width: 0;
}

.project-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-blue);
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.project-card:hover .project-name {
  color: var(--color-cyan);
}

.project-link-icon {
  opacity: 0.6;
  flex-shrink: 0;
}

.project-description {
  font-size: 14px;
  color: var(--color-white);
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  flex-shrink: 0;
}

.project-language {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(130, 212, 242, 0.08);
  border-radius: 20px;
}

.language-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.language-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-white);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .projects-page {
    padding: 72px 16px 24px;
  }

  .projects-title {
    font-size: 28px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    padding: 20px;
  }

  .project-content {
    flex-direction: column;
    gap: 12px;
  }

  .project-meta {
    align-self: flex-start;
  }
}
</style>
