<script setup lang="ts">
import { ref } from 'vue'
import { ExternalLink, User } from 'lucide-vue-next'
import type { Project } from '../data/projects'

defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  click: [url: string]
}>()

const avatarError = ref(false)
</script>

<template>
  <div class="project-card" @click="emit('click', project.url)">
    <div class="project-author">
      <div class="author-avatar-wrapper">
        <img
          v-if="!avatarError"
          :src="project.authorAvatar"
          :alt="project.author"
          class="author-avatar"
          @error="avatarError = true"
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
          <span class="language-dot" :style="{ backgroundColor: project.languageColor }"></span>
          <span class="language-name">{{ project.language }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  background: var(--color-gray);
  border: 2px solid var(--color-cyan);
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
  border: 2px solid var(--color-cyan);
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
  border: 2px solid var(--color-cyan);
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
