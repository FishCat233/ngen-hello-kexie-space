<script setup lang="ts">
import { ref } from 'vue'
import { ExternalLink, User } from 'lucide-vue-next'
import { projects, demoProjects } from '../data/projects'
import BackButton from '../components/BackButton.vue'

const avatarErrors = ref<Record<number, boolean>>({})
const demoAvatarErrors = ref<Record<number, boolean>>({})

const openProject = (url: string) => {
  window.open(url, '_blank')
}

const handleAvatarError = (index: number) => {
  avatarErrors.value[index] = true
}

const handleDemoAvatarError = (index: number) => {
  demoAvatarErrors.value[index] = true
}
</script>

<template>
  <div class="projects-page">
    <div class="projects-container">
      <BackButton />

      <div class="projects-header">
        <h1 class="projects-title"><span class="title-accent">#</span> 科协项目活动</h1>
        <p class="projects-subtitle">科协成员的部分项目活动</p>
      </div>

      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">科协优秀项目</h2>
          <p class="section-subtitle">科协成员开发的优秀项目</p>
        </div>

        <div class="projects-grid">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="project-card"
            @click="openProject(project.url)"
          >
            <div class="project-author">
              <div class="author-avatar-wrapper">
                <img
                  v-if="!avatarErrors[index]"
                  :src="project.authorAvatar"
                  :alt="project.author"
                  class="author-avatar"
                  @error="handleAvatarError(index)"
                />
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
                <p class="project-description" :title="project.description">
                  {{ project.description }}
                </p>
              </div>

              <div class="project-meta">
                <div class="project-language">
                  <span
                    class="language-dot"
                    :style="{ backgroundColor: project.languageColor }"
                  ></span>
                  <span class="language-name">{{ project.language }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">学习演示项目</h2>
          <p class="section-subtitle">近年科协成员在学习中开发的部分演示项目</p>
        </div>

        <div class="projects-grid">
          <div
            v-for="(project, index) in demoProjects"
            :key="'demo-' + index"
            class="project-card"
            @click="openProject(project.url)"
          >
            <div class="project-author">
              <div class="author-avatar-wrapper">
                <img
                  v-if="!demoAvatarErrors[index]"
                  :src="project.authorAvatar"
                  :alt="project.author"
                  class="author-avatar"
                  @error="handleDemoAvatarError(index)"
                />
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
                <p class="project-description" :title="project.description">
                  {{ project.description }}
                </p>
              </div>

              <div class="project-meta">
                <div class="project-language">
                  <span
                    class="language-dot"
                    :style="{ backgroundColor: project.languageColor }"
                  ></span>
                  <span class="language-name">{{ project.language }}</span>
                </div>
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
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-header {
  margin-bottom: 40px;
}

.projects-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.projects-subtitle {
  font-size: 16px;
  color: var(--color-text);
  margin: 0;
}

.projects-section {
  margin-bottom: 60px;
}

.projects-section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.section-subtitle {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.project-card {
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  padding: 24px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.project-card:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.project-card:hover .project-name,
.project-card:hover .project-description,
.project-card:hover .author-name,
.project-card:hover .language-name {
  color: var(--color-white);
}

.project-card:hover .author-avatar-wrapper {
  background: var(--color-cyan);
  border-color: var(--color-white);
}

.project-card:hover .author-avatar-placeholder {
  color: var(--color-white);
}

.project-card:hover .project-language {
  background: var(--color-cyan);
  border-color: var(--color-white);
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
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-cyan);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
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
  transition: color 0.2s ease;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
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
}

.project-link-icon {
  flex-shrink: 0;
}

.project-description {
  font-size: 14px;
  color: var(--color-text);
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
  background: transparent;
  border: 1px solid var(--color-cyan);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.language-dot {
  width: 10px;
  height: 10px;
}

.language-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
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
