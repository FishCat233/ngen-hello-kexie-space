<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Globe,
  Coffee,
  Gamepad2,
  Smartphone,
  PencilRuler,
  Cpu,
  BrainCircuit,
  Clapperboard,
  Binary,
  LockKeyhole,
  ShieldAlert,
  Bug,
  BookOpen,
} from 'lucide-vue-next'

const router = useRouter()

interface LearningDirection {
  id: string
  name: string
  icon: typeof Globe
  department: string
}

const directions: LearningDirection[] = [
  // 多媒体部
  { id: 'frontend', name: '前端开发', icon: Globe, department: '多媒体部' },
  { id: 'backend', name: '后端开发', icon: Coffee, department: '多媒体部' },
  { id: 'ui', name: 'UI设计', icon: PencilRuler, department: '多媒体部' },
  { id: 'video', name: '视频剪辑', icon: Clapperboard, department: '多媒体部' },
  { id: 'editing', name: '编辑', icon: BookOpen, department: '多媒体部' },
  // 软件部
  { id: 'deep-learning', name: '深度学习', icon: BrainCircuit, department: '软件部' },
  { id: 'app', name: 'APP开发', icon: Smartphone, department: '软件部' },
  { id: 'game', name: '游戏开发', icon: Gamepad2, department: '软件部' },
  // 硬件部
  { id: 'hardware', name: '硬件开发', icon: Cpu, department: '硬件部' },
  // 安全部
  { id: 'reverse', name: '逆向工程', icon: Binary, department: '安全部' },
  { id: 'crypto', name: '密码学', icon: LockKeyhole, department: '安全部' },
  { id: 'web-security', name: 'Web安全', icon: ShieldAlert, department: '安全部' },
  { id: 'pwn', name: 'PWN', icon: Bug, department: '安全部' },
]

const departmentOrder = ['多媒体部', '软件部', '硬件部', '安全部']

const groupedDirections = computed(() => {
  const groups: Record<string, LearningDirection[]> = {}
  for (const dir of directions) {
    if (!groups[dir.department]) {
      groups[dir.department] = []
    }
    groups[dir.department].push(dir)
  }
  return departmentOrder.map((dept) => ({
    department: dept,
    directions: groups[dept] || [],
  }))
})

const navigateToDirection = (id: string) => {
  router.push(`/direction/${id}`)
}

const securityWebsite = 'https://hjsec.github.io'
</script>

<template>
  <section class="learning-section">
    <div class="learning-container">
      <h2 class="learning-title"><span class="title-accent">#</span> 学习方向</h2>

      <div v-for="group in groupedDirections" :key="group.department" class="direction-group">
        <h3 class="direction-group-title">{{ group.department }}</h3>
        <div class="learning-grid">
          <div
            v-for="dir in group.directions"
            :key="dir.id"
            class="learning-card"
            @click="navigateToDirection(dir.id)"
          >
            <div class="learning-icon">
              <component :is="dir.icon" :size="48" stroke-width="1.5" />
            </div>

            <h4 class="learning-name">{{ dir.name }}</h4>
          </div>
        </div>
        <a
          v-if="group.department === '安全部'"
          :href="securityWebsite"
          target="_blank"
          rel="noopener noreferrer"
          class="direction-link"
        >
          <span>→ 安全部主页</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10vh 20px;
  background: var(--color-gray);
}

.learning-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

.learning-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-align: center;
}

.title-accent {
  color: var(--color-blue);
}

.direction-group {
  width: 100%;
}

.direction-group + .direction-group {
  margin-top: 40px;
}

.direction-group-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px;
  text-align: left;
}

.direction-link {
  display: inline-flex;
  align-items: center;
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  border: 2px solid var(--color-cyan);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.direction-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-cyan);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.direction-link:hover::before {
  transform: translateX(0);
}

.direction-link:hover {
  color: var(--color-white);
}

.direction-link > * {
  position: relative;
  z-index: 1;
}

.learning-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  width: 100%;
}

.learning-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  background: var(--color-gray);
  border: 2px solid var(--color-cyan);
  cursor: pointer;
  flex: 0 1 calc(25% - 18px);
  max-width: 280px;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.learning-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-cyan);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.learning-card:hover::before {
  transform: translateX(0);
}

.learning-card:hover {
  border-color: var(--color-cyan);
}

.learning-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--color-cyan);
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.learning-card:hover .learning-icon {
  color: var(--color-white);
}

.learning-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.learning-card:hover .learning-name {
  color: var(--color-white);
}

@media (max-width: 1024px) {
  .learning-section {
    padding: 10vh 16px;
  }

  .learning-title {
    font-size: 32px;
  }

  .learning-grid {
    gap: 16px;
  }

  .learning-card {
    padding: 24px 16px;
    flex: 0 1 calc(33.333% - 11px);
    max-width: 240px;
  }

  .learning-icon {
    width: 48px;
    height: 48px;
  }

  .learning-icon > * {
    width: 40px !important;
    height: 40px !important;
  }

  .learning-name {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .learning-grid {
    gap: 12px;
  }

  .learning-card {
    flex: 0 1 calc(50% - 6px);
    padding: 20px 12px;
  }
}

@media (max-width: 480px) {
  .learning-title {
    font-size: 28px;
  }

  .learning-grid {
    gap: 8px;
  }

  .learning-card {
    padding: 16px 8px;
  }

  .learning-icon {
    width: 44px;
    height: 44px;
    margin-bottom: 12px;
  }

  .learning-icon > * {
    width: 36px !important;
    height: 36px !important;
  }

  .learning-name {
    font-size: 13px;
  }
}
</style>
