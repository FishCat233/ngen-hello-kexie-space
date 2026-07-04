<script setup lang="ts">
import { computed, ref } from 'vue'
import { ExternalLink, User } from 'lucide-vue-next'
import type { CompetitionProject } from '../data/projects'

const props = defineProps<{
  project: CompetitionProject
}>()

const emit = defineEmits<{
  click: [url: string]
}>()

const avatarErrors = ref<Record<number, boolean>>({})

const maxVisible = computed(() => (window.innerWidth <= 768 ? 3 : 4))
const visibleAvatars = computed(() => props.project.authorAvatars.slice(0, maxVisible.value))
const overflowCount = computed(() => Math.max(0, props.project.authors.length - maxVisible.value))

const displayName = computed(() => {
  if (props.project.teamName) return props.project.teamName
  return props.project.authors.join('、')
})

const handleClick = () => {
  if (props.project.url) {
    emit('click', props.project.url)
  }
}

const competitionLabel = computed(() => {
  if (props.project.year) {
    return `${props.project.competition} · ${props.project.year}`
  }
  return props.project.competition
})
</script>

<template>
  <div class="competition-card" :class="{ clickable: !!project.url }" @click="handleClick">
    <div class="card-author">
      <div class="avatar-stack">
        <div
          v-for="(avatar, i) in visibleAvatars"
          :key="i"
          class="avatar-wrapper"
          :style="{ zIndex: visibleAvatars.length - i, marginLeft: i > 0 ? '-8px' : '0' }"
        >
          <img
            v-if="!avatarErrors[i]"
            :src="avatar"
            :alt="project.authors[i]"
            class="avatar-img"
            @error="avatarErrors[i] = true"
          />
          <div v-else class="avatar-fallback">
            <User :size="16" />
          </div>
        </div>
        <div
          v-if="overflowCount > 0"
          class="avatar-wrapper avatar-overflow"
          :style="{ zIndex: 0, marginLeft: '-8px' }"
        >
          <span class="overflow-text">+{{ overflowCount }}</span>
        </div>
      </div>
      <span class="author-name">{{ displayName }}</span>
    </div>

    <div class="card-content">
      <div class="card-main">
        <h3 class="project-name">
          {{ project.name }}
          <ExternalLink v-if="project.url" :size="16" class="project-link-icon" />
        </h3>
        <p class="project-description" :title="project.description">
          {{ project.description }}
        </p>
      </div>

      <div class="card-meta">
        <div class="competition-tag">
          {{ competitionLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.competition-card {
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  padding: 24px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.competition-card.clickable {
  cursor: pointer;
}

.competition-card:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.competition-card:hover .project-name,
.competition-card:hover .project-description,
.competition-card:hover .author-name {
  color: var(--color-white);
}

.competition-card:hover .avatar-wrapper {
  border-color: var(--color-white);
}

.competition-card:hover .avatar-fallback {
  color: var(--color-white);
}

.competition-card:hover .competition-tag {
  background: var(--color-cyan);
  border-color: var(--color-white);
  color: var(--color-white);
}

.card-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-stack {
  display: flex;
  flex-shrink: 0;
}

.avatar-wrapper {
  width: 36px;
  height: 36px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-cyan);
  position: relative;
  transition: border-color 0.2s ease;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--color-cyan);
  transition: color 0.2s ease;
}

.avatar-overflow {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray);
}

.overflow-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.competition-card:hover .overflow-text {
  color: var(--color-white);
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.card-main {
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

.card-meta {
  flex-shrink: 0;
}

.competition-tag {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--color-cyan);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

@media (max-width: 768px) {
  .competition-card {
    padding: 20px;
  }

  .avatar-wrapper {
    width: 32px;
    height: 32px;
  }

  .card-content {
    flex-direction: column;
    gap: 12px;
  }

  .card-meta {
    align-self: flex-start;
  }
}
</style>
