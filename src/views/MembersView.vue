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
  background: var(--color-gray);
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
  border: 2px solid var(--color-cyan);
  padding: 16px;
  margin-bottom: 32px;
  color: var(--color-text);
}

.members-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.members-subtitle {
  font-size: 16px;
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
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.section-accent {
  color: var(--color-blue);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.member-card {
  background: var(--color-gray);
  border: 2px solid var(--color-cyan);
  padding: 24px;
  display: flex;
  gap: 20px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.member-card:hover {
  background-color: var(--member-theme, var(--color-cyan));
  border-color: var(--member-theme, var(--color-cyan));
}

.member-card:hover .member-nickname,
.member-card:hover .member-meta,
.member-card:hover .member-motto,
.member-card:hover .member-avatar-placeholder {
  color: var(--color-white);
}

.member-card:hover .member-link-btn {
  border-color: var(--color-white);
  color: var(--color-white);
}

.member-card:hover .member-link-btn:hover {
  background: var(--color-black);
  border-color: var(--color-black);
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
  border: 2px solid var(--color-cyan);
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
  color: var(--color-cyan);
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
  font-size: 18px;
  font-weight: 600;
  color: var(--color-blue);
  margin: 0;
}

.member-card:hover .member-nickname {
  color: var(--color-white);
}

.member-meta {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.meta-sep {
  margin: 0 6px;
  color: var(--color-cyan);
}

.member-card:hover .meta-sep {
  color: var(--color-white);
}

.member-motto {
  font-size: 13px;
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
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
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  border: 2px solid var(--color-cyan);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.member-link-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-cyan);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.member-link-btn:hover::before {
  transform: translateX(0);
}

.member-link-btn:hover {
  color: var(--color-white);
}

.member-link-btn > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .members-page {
    padding: 72px 16px 24px;
  }

  .members-title {
    font-size: 28px;
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

  .member-nickname {
    font-size: 16px;
  }
}
</style>
