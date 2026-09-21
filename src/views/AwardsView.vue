<script setup lang="ts">
import { awards, getAwardLevelColor } from '../data/awards'
import BackButton from '../components/BackButton.vue'
import SectionMark from '../components/SectionMark.vue'

/* 等级高低序（用于取卡片的最高等级色） */
const levelRank = ['省三', '省二', '省一', '国三', '国二', '国一']

function bestLevelColor(levels: Record<string, number>): string {
  let best = ''
  for (const level of Object.keys(levels)) {
    if (levelRank.indexOf(level) > levelRank.indexOf(best)) {
      best = level
    }
  }
  return getAwardLevelColor(best)
}

function chipStyle(level: string) {
  const color = getAwardLevelColor(level)
  return { color, background: `color-mix(in srgb, ${color} 13%, transparent)` }
}
</script>

<template>
  <div class="awards-page">
    <div class="awards-container">
      <BackButton />

      <div class="awards-header">
        <h1 class="awards-title"><SectionMark class="title-mark" /> 近年获奖情况</h1>
        <p class="awards-subtitle">很多还在整理当中，下面展示是近几年国家级、省部级获奖的一部分</p>
      </div>

      <div class="awards-grid">
        <div
          v-for="award in awards"
          :key="award.name"
          class="award-card"
          :style="{ '--stripe-color': bestLevelColor(award.award) }"
        >
          <!-- 左侧最高等级色条 -->
          <span class="award-stripe"></span>

          <h3 class="award-name">{{ award.name }}</h3>

          <div class="award-levels">
            <span
              v-for="(count, level) in award.award"
              :key="level"
              class="level-chip"
              :style="chipStyle(level)"
            >
              {{ level }} ×{{ count }}
            </span>
          </div>

          <div class="award-people">
            <span class="people-label">获奖成员 {{ award.people.length }} 人</span>
            <p class="people-names">{{ award.people.join('、') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.awards-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 20px 40px;
}

.awards-container {
  max-width: 1200px;
  margin: 0 auto;
}

.awards-header {
  margin-bottom: 48px;
}

.awards-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 14px;
  line-height: 1;
}

.title-mark {
  color: var(--color-primary);
}

.awards-subtitle {
  font-size: var(--text-body);
  color: #9ca3af;
  margin: 0;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.award-card {
  position: relative;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 28px 28px 24px 32px;
  overflow: hidden;
  transition: background-color 0.2s ease;
}

/* hover：卡片变深，文字层级不变 */
.award-card:hover {
  background: #10141b;
}

/* 左侧内缩色条：取该赛事最高等级的颜色 */
.award-stripe {
  position: absolute;
  left: 0;
  top: 20px;
  bottom: 20px;
  width: 3px;
  border-radius: 2px;
  background: var(--stripe-color, var(--color-primary));
}

.award-name {
  font-size: var(--text-h4);
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 16px;
  line-height: var(--leading-snug);
}

.award-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.level-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
}

.award-people {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-line);
}

.people-label {
  display: block;
  font-size: var(--text-xs);
  color: #6b7280;
  margin-bottom: 6px;
}

.people-names {
  font-size: var(--text-ui);
  color: #9ca3af;
  line-height: var(--leading-normal);
  margin: 0;
}

@media (max-width: 1024px) {
  .awards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .awards-page {
    padding: 72px 16px 24px;
  }

  .awards-grid {
    gap: 16px;
  }

  .award-card {
    padding: 20px 20px 18px 24px;
  }

  .award-name {
    font-size: var(--text-h5);
  }
}
</style>
