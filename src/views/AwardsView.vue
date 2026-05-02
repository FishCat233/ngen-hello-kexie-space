<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Users } from 'lucide-vue-next'
import { awards, getAwardLevelColor } from '../data/awards'
import TracerBullet from '../components/TracerBullet.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="awards-page">
    <TracerBullet :active="true" class="awards-tracer" />

    <div class="awards-container">
      <button class="back-button" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回首页</span>
      </button>

      <div class="awards-header">
        <h1 class="awards-title">近年获奖情况</h1>
        <p class="awards-subtitle">很多还在整理当中，下面展示是近几年国家级、省部级获奖的一部分</p>
      </div>

      <div class="awards-grid">
        <div v-for="award in awards" :key="award.name" class="award-card">
          <div class="award-glow"></div>
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
  position: relative;
  min-height: 100vh;
  background: #04080c;
  padding: 80px 20px 40px;
  overflow-x: hidden;
}

.awards-tracer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.6;
}

.awards-container {
  position: relative;
  z-index: 10;
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
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  transform: translateX(-4px);
}

.awards-header {
  margin-bottom: 40px;
}

.awards-title {
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

.awards-subtitle {
  font-size: 16px;
  color: var(--color-white);
  opacity: 0.7;
  margin: 0;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.award-card {
  position: relative;
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.award-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(130, 212, 242, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.award-card:hover {
  background: rgba(130, 212, 242, 0.06);
  border-color: rgba(130, 212, 242, 0.3);
  transform: translateY(-4px);
  box-shadow:
    0 8px 32px rgba(130, 212, 242, 0.15),
    0 0 20px rgba(130, 212, 242, 0.1);
}

.award-card:hover .award-glow {
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
  background: linear-gradient(135deg, rgba(130, 212, 242, 0.2) 0%, rgba(111, 208, 206, 0.2) 100%);
  border-radius: 10px;
  color: var(--color-blue);
  flex-shrink: 0;
}

.award-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-white);
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
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid;
  border-radius: 8px;
  min-width: 48px;
}

.level-count {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 1px;
}

.level-name {
  font-size: 11px;
  color: var(--color-white);
  opacity: 0.8;
}

.award-people {
  border-top: 1px solid rgba(130, 212, 242, 0.1);
  padding-top: 12px;
}

.people-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-white);
  opacity: 0.6;
  margin-bottom: 8px;
}

.people-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.person-tag {
  padding: 3px 8px;
  background: rgba(130, 212, 242, 0.1);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-white);
  opacity: 0.9;
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
