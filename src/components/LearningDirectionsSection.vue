<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  ExternalLink,
  Globe,
  Coffee,
  Gamepad2,
  Smartphone,
  Palette,
  Cpu,
  Brain,
  Clapperboard,
  Binary,
  Lock,
  Shield,
  Terminal,
  FileText,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import SectionMark from './SectionMark.vue'

const router = useRouter()

interface LearningDirection {
  id: string
  name: string
  department: string
  icon: Component
}

const directions: LearningDirection[] = [
  // 多媒体部
  { id: 'frontend', name: '前端开发', department: '多媒体部', icon: Globe },
  { id: 'backend', name: '后端开发', department: '多媒体部', icon: Coffee },
  { id: 'ui', name: 'UI设计', department: '多媒体部', icon: Palette },
  { id: 'video', name: '视频剪辑', department: '多媒体部', icon: Clapperboard },
  { id: 'editing', name: '编辑', department: '多媒体部', icon: FileText },
  // 软件部
  { id: 'deep-learning', name: '深度学习', department: '软件部', icon: Brain },
  { id: 'app', name: 'APP开发', department: '软件部', icon: Smartphone },
  { id: 'game', name: '游戏开发', department: '软件部', icon: Gamepad2 },
  // 硬件部
  { id: 'hardware', name: '硬件开发', department: '硬件部', icon: Cpu },
  // 安全部
  { id: 'reverse', name: '逆向工程', department: '安全部', icon: Binary },
  { id: 'crypto', name: '密码学', department: '安全部', icon: Lock },
  { id: 'web-security', name: 'Web安全', department: '安全部', icon: Shield },
  { id: 'pwn', name: 'PWN', department: '安全部', icon: Terminal },
]

const departmentOrder = ['多媒体部', '软件部', '硬件部', '安全部']

const groupedDirections = departmentOrder.map((department) => ({
  department,
  directions: directions.filter((dir) => dir.department === department),
}))

const navigateToDirection = (id: string) => {
  router.push(`/direction/${id}`)
}

const securityWebsite = 'https://hjsec.github.io'
</script>

<template>
  <section class="learning-section">
    <div class="learning-container">
      <h2 class="learning-title"><SectionMark class="title-mark" /> 学习方向</h2>

      <!-- 编辑部风格索引列表：部门为组，方向为行 -->
      <div v-for="group in groupedDirections" :key="group.department" class="direction-group">
        <div class="group-header">
          <h3 class="group-name">{{ group.department }}</h3>
          <a
            v-if="group.department === '安全部'"
            :href="securityWebsite"
            target="_blank"
            rel="noopener noreferrer"
            class="group-home-btn"
          >
            <ExternalLink :size="12" />
            <span>主页</span>
          </a>
          <span class="group-count">{{ group.directions.length }} 个方向</span>
          <span class="group-rule"></span>
        </div>

        <div class="group-list">
          <div
            v-for="(dir, index) in group.directions"
            :key="dir.id"
            class="direction-row"
            @click="navigateToDirection(dir.id)"
          >
            <span class="row-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <component :is="dir.icon" :size="22" class="row-icon" />
            <span class="row-name">{{ dir.name }}</span>
            <ArrowRight class="row-arrow" :size="22" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 20px 6vh;
  background: var(--color-bg);
}

.learning-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 56px;
}

.learning-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  line-height: 1;
}

.title-mark {
  color: var(--color-primary);
}

.direction-group {
  width: 100%;
}

/* 组头：部门名 + 数量 + 延伸细线 */
.group-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.group-name {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.group-count {
  font-size: var(--text-sm);
  color: #6b7280;
}

.group-rule {
  flex: 1;
  height: 1px;
  background: var(--color-line);
}

/* 安全部主页：组头名称右侧的小按钮 */
.group-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.group-home-btn:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.group-list {
  display: flex;
  flex-direction: column;
}

.direction-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.direction-row:hover {
  background: var(--color-card);
}

.row-index {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: #6b7280;
  min-width: 24px;
  display: inline-flex;
  align-items: center;
}

/* 方向专属图标：与详情页同一套映射 */
.row-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.row-name {
  font-size: var(--text-h3);
  font-weight: 500;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.direction-row:hover .row-name {
  color: var(--color-primary-bright);
}

.row-arrow {
  margin-left: auto;
  color: var(--color-primary);
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.direction-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 1024px) {
  .learning-section {
    padding: 4vh 16px 6vh;
  }
}

@media (max-width: 640px) {
  .learning-container {
    gap: 40px;
  }

  .direction-row {
    padding: 14px 12px;
    gap: 16px;
  }

  .row-index {
    display: none;
  }

  .row-name {
    font-size: var(--text-h5);
  }
}
</style>
