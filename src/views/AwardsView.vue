<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Users } from 'lucide-vue-next'
import { awards, getAwardLevelColor } from '../data/awards'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="awards-page">
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
          <div class="award-header">
            <div class="award-icon">
              <Trophy :size="24" />
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
                <Users :size="16" />
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
</template>

<style scoped>
.awards-page {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  background: transparent;
  padding: 80px 20px 40px;
}

.awards-container {
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.award-card {
  position: relative;
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.award-card:hover {
  background: rgba(130, 212, 242, 0.06);
  border-color: rgba(130, 212, 242, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(130, 212, 242, 0.1);
}

.award-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.award-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(130, 212, 242, 0.2) 0%, rgba(111, 208, 206, 0.2) 100%);
  border-radius: 12px;
  color: var(--color-blue);
  flex-shrink: 0;
}

.award-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
  line-height: 1.4;
}

.award-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.award-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.award-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 16px;
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid;
  border-radius: 10px;
  min-width: 60px;
}

.level-count {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.level-name {
  font-size: 12px;
  color: var(--color-white);
  opacity: 0.8;
}

.award-people {
  border-top: 1px solid rgba(130, 212, 242, 0.1);
  padding-top: 16px;
}

.people-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-white);
  opacity: 0.6;
  margin-bottom: 12px;
}

.people-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.person-tag {
  padding: 4px 10px;
  background: rgba(130, 212, 242, 0.1);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-white);
  opacity: 0.9;
}

@media (max-width: 768px) {
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
    padding: 20px;
  }

  .award-name {
    font-size: 16px;
  }

  .award-level {
    padding: 8px 12px;
    min-width: 50px;
  }

  .level-count {
    font-size: 14px;
  }
}
</style>
