<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { User } from 'lucide-vue-next'
import { getMembersByGrade, members as staticMembers } from '../data/members'
import type { Member } from '../data/members'
import { loadMembers } from '../api/cms'
import BackButton from '../components/BackButton.vue'

const gradeGroups = ref(getMembersByGrade())
const loadError = ref(false)
const avatarErrors = ref<Record<string, boolean>>({})

function handleAvatarError(key: string) {
  avatarErrors.value = { ...avatarErrors.value, [key]: true }
}

function memberKey(member: Member, index: number): string {
  return `${member.grade}-${member.nickname}-${index}`
}

function cardHoverStyle(color: string | undefined) {
  return color ? { '--member-theme': color } : {}
}

onMounted(async () => {
  const result = await loadMembers(staticMembers)
  gradeGroups.value = getMembersByGrade(result.data)
  loadError.value = result.source === 'fallback'
})
</script>

<template>
  <div class="members-page">
    <div class="members-container">
      <BackButton />

      <div class="members-header">
        <h1 class="members-title"><span class="title-accent">#</span> 成员墙</h1>
        <p class="members-subtitle">成员申请上墙，非全员名册</p>
      </div>

      <p v-if="loadError" class="cms-notice">内容服务暂不可用，当前显示内置数据。</p>

      <div v-if="gradeGroups.length === 0" class="empty-state">暂无成员内容</div>

      <div v-for="group in gradeGroups" :key="group.grade" class="members-section">
        <div class="section-header">
          <h2 class="section-title"><span class="section-accent">##</span> {{ group.grade }}</h2>
        </div>

        <div class="members-grid">
          <div
            v-for="(member, index) in group.members"
            :key="memberKey(member, index)"
            class="member-card"
            :style="cardHoverStyle(member.themeColor)"
          >
            <div class="member-avatar-area">
              <div class="member-avatar-wrapper">
                <img
                  v-if="!avatarErrors[memberKey(member, index)]"
                  :src="member.avatar"
                  :alt="member.nickname"
                  class="member-avatar"
                  @error="handleAvatarError(memberKey(member, index))"
                />
                <div v-else class="member-avatar-placeholder">
                  <User :size="24" />
                </div>
              </div>
            </div>

            <div class="member-info">
              <h3 class="member-nickname">{{ member.nickname }}</h3>

              <p v-if="member.direction || member.role" class="member-meta">
                <span v-if="member.direction">{{ member.direction }}</span>
                <span v-if="member.direction && member.role" class="meta-sep">·</span>
                <span v-if="member.role">{{ member.role }}</span>
              </p>

              <p class="member-motto">{{ member.motto || '\xa0' }}</p>

              <div v-if="member.links && member.links.length > 0" class="member-links">
                <a
                  v-for="(link, li) in member.links"
                  :key="li"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="member-link-btn"
                >
                  <span>{{ link.title }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.members-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 20px 40px;
}

.members-container {
  max-width: 1200px;
  margin: 0 auto;
}

.members-header {
  margin-bottom: 40px;
}

.cms-notice,
.empty-state {
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 32px;
  color: var(--color-text);
}

.members-title {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-primary);
}

.members-subtitle {
  font-size: var(--text-body);
  color: var(--color-text);
  margin: 0;
}

.members-section {
  margin-bottom: 60px;
}

.members-section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.section-accent {
  color: var(--color-primary);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.member-card {
  background: var(--color-bg);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  gap: 20px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.member-card:hover {
  background-color: var(--member-theme, var(--color-primary-bright));
  border-color: var(--member-theme, var(--color-primary-bright));
}

.member-card:hover .member-nickname,
.member-card:hover .member-meta,
.member-card:hover .member-motto,
.member-card:hover .member-avatar-placeholder {
  color: var(--color-on-primary);
}

.member-card:hover .member-link-btn {
  border-color: var(--color-white);
  color: var(--color-white);
}

.member-card:hover .member-link-btn:hover {
  background: var(--color-bg);
  border-color: var(--color-bg);
  color: var(--color-white);
}

.member-card:hover .member-link-btn:hover::before {
  display: none;
}

/* 头像区 */
.member-avatar-area {
  flex-shrink: 0;
}

.member-avatar-wrapper {
  width: 64px;
  height: 64px;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
}

.member-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--color-primary);
}

/* 信息区 */
.member-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-nickname {
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.member-card:hover .member-nickname {
  color: var(--color-on-primary);
}

.member-meta {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.meta-sep {
  margin: 0 6px;
  color: var(--color-primary);
}

.member-card:hover .meta-sep {
  color: var(--color-on-primary);
}

.member-motto {
  font-size: var(--text-sm);
  color: var(--color-text);
  margin: 0;
  line-height: var(--leading-normal);
}

/* 外部链接按钮 */
.member-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.member-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-white);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.member-link-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary-bright);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.member-link-btn:hover::before {
  transform: translateX(0);
}

.member-link-btn > * {
  position: relative;
  z-index: 1;
}

/* hover：箭头作为流内元素参与布局，与文字共同居中 */
.member-link-btn::after {
  content: '→';
  order: -1;
  position: relative;
  z-index: 1;
  width: 0;
  margin-left: -8px;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transition:
    width 0.3s ease,
    margin-left 0.3s ease,
    opacity 0.25s ease;
}

.member-link-btn:hover::after {
  width: 1em;
  margin-left: 0;
  opacity: 1;
}

@media (max-width: 768px) {
  .members-page {
    padding: 72px 16px 24px;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .member-card {
    padding: 20px;
    gap: 16px;
  }

  .member-avatar-wrapper {
    width: 52px;
    height: 52px;
  }
}
</style>
