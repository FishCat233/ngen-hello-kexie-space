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

const avatarError = ref(false)

const firstAvatar = computed(() => props.project.authorAvatars[0])

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
      <!-- 一张主头像 + 右侧两张仅描边的堆叠圆，表达团队多人 -->
      <div class="avatar-stack">
        <div class="avatar-wrapper avatar-main">
          <img
            v-if="firstAvatar && !avatarError"
            :src="firstAvatar"
            :alt="project.authors[0] ?? project.teamName"
            class="avatar-img"
            @error="avatarError = true"
          />
          <div v-else class="avatar-fallback">
            <User :size="16" />
          </div>
        </div>
        <div class="avatar-wrapper avatar-ghost"></div>
        <div class="avatar-wrapper avatar-ghost"></div>
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
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: background-color 0.2s ease;
}

.competition-card.clickable {
  cursor: pointer;
}

/* hover：卡片变深，文字层级不变 */
.competition-card:hover {
  background: #10141b;
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
  border-radius: 50%;
  position: relative;
}

/* 主头像：主题蓝描边 */
.avatar-main {
  z-index: 3;
  border: 2px solid var(--color-primary);
}

/* 右侧堆叠的两张幽灵圆：透明底 + 细描边，暗示团队其他成员 */
.avatar-ghost {
  margin-left: -8px;
  border: 1px solid rgba(59, 130, 246, 0.45);
}

.avatar-ghost:nth-of-type(2) {
  z-index: 2;
}

.avatar-ghost:nth-of-type(3) {
  z-index: 1;
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
  color: var(--color-primary);
  transition: color 0.2s ease;
}

.author-name {
  font-size: var(--text-ui);
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
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 8px 0;
}

.project-link-icon {
  flex-shrink: 0;
}

.project-description {
  font-size: var(--text-ui);
  color: var(--color-text);
  line-height: var(--leading-normal);
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
  display: inline-flex;
  align-items: center;
  height: 22px; /* 与左侧项目名行高一致 */
  padding: 0 10px;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
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
