<script setup lang="ts">
import { Trophy, Users } from 'lucide-vue-next'
import { awards, getAwardLevelColor } from '../data/awards'
import BackButton from '../components/BackButton.vue'
</script>

<template>
  <div class="awards-page">
    <div class="awards-container">
      <BackButton />

      <div class="awards-header">
        <h1 class="awards-title"><span class="title-accent">#</span> 近年获奖情况</h1>
        <p class="awards-subtitle">很多还在整理当中，下面展示是近几年国家级、省部级获奖的一部分</p>
      </div>

      <div class="awards-grid">
        <div v-for="award in awards" :key="award.name" class="award-card">
          <div class="award-content-wrapper">
            <div class="award-header">
              <div class="award-icon">
                <Trophy :size="20" />
              </div>
              <h3 class="award-name">{{ award.name }}</h3>
            </div>

            <div class="award-content">
              <div class="award-levels">
                <div
                  v-for="(count, level) in award.award"
                  :key="level"
                  class="award-level"
                  :style="{ borderColor: getAwardLevelColor(level) }"
                >
                  <span class="level-count" :style="{ color: getAwardLevelColor(level) }">
                    {{ count }}人
                  </span>
                  <span class="level-name">{{ level }}</span>
                </div>
              </div>

              <div class="award-people">
                <div class="people-header">
                  <Users :size="14" />
                  <span>获奖成员</span>
                </div>
                <div class="people-list">
                  <span v-for="person in award.people" :key="person" class="person-tag">
                    {{ person }}
                  </span>
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
.awards-page {
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.awards-container {
  max-width: 1200px;
  margin: 0 auto;
}

.awards-header {
  margin-bottom: 40px;
}

.awards-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.awards-subtitle {
  font-size: 16px;
  color: var(--color-text);
  margin: 0;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.award-card {
  position: relative;
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  padding: 16px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.award-card:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.award-card:hover .award-name,
.award-card:hover .level-name,
.award-card:hover .people-header,
.award-card:hover .person-tag {
  color: var(--color-white);
}

.award-card:hover .level-count {
  color: var(--color-white) !important;
}

.award-content-wrapper {
  position: relative;
  z-index: 1;
}

.award-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.award-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);
  flex-shrink: 0;
}

.award-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.award-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.award-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.award-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid;
  min-width: 48px;
}

.level-count {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 1px;
}

.level-name {
  font-size: 11px;
  color: var(--color-text);
}

.award-people {
  border-top: 1px solid var(--color-cyan);
  padding-top: 12px;
}

.people-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.people-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.person-tag {
  padding: 3px 8px;
  background: transparent;
  border: 1px solid var(--color-cyan);
  font-size: 12px;
  color: var(--color-text);
}

@media (max-width: 1024px) {
  .awards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .awards-page {
    padding: 72px 16px 24px;
  }

  .awards-title {
    font-size: 28px;
  }

  .awards-grid {
    grid-template-columns: 1fr;
  }

  .award-card {
    padding: 14px;
  }

  .award-name {
    font-size: 14px;
  }

  .award-level {
    padding: 5px 8px;
    min-width: 44px;
  }

  .level-count {
    font-size: 13px;
  }
}
</style>
