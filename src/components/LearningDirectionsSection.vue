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
    <div class="ghost-char" v-parallax="0.05" aria-hidden="true">学</div>
    <div class="learning-container">
      <header class="learning-header" v-reveal>
        <p class="section-eyebrow">LEARNING DIRECTIONS</p>
        <h2 class="learning-title"><span class="title-accent">#</span> 学习方向</h2>
        <p class="section-note">十三个方向，四个部门 —— 找到你的起点</p>
      </header>

      <div v-for="group in groupedDirections" :key="group.department" class="direction-group">
        <h3 class="direction-group-title" v-reveal>
          <span class="group-dash">—</span>{{ group.department }}
        </h3>
        <div class="learning-grid">
          <div
            v-for="(dir, index) in group.directions"
            :key="dir.id"
            class="learning-card"
            v-reveal
            :style="{ '--reveal-delay': `${index * 45}ms` }"
            @click="navigateToDirection(dir.id)"
          >
            <div class="learning-icon">
              <component :is="dir.icon" :size="28" stroke-width="1.5" />
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
          <span>安全部主页<span class="direction-link-arrow">›</span></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12vh 24px;
  background: var(--color-gray);
  overflow: hidden;
}

/* 淡墨汉字 - 背景纹理 */
.ghost-char {
  position: absolute;
  right: -2vw;
  top: 50%;
  transform: translateY(calc(-50% + var(--parallax-y, 0px)));
  font-family: var(--heading);
  font-weight: 800;
  font-size: 60vh;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px #d9d5cb;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  will-change: transform;
}

.learning-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.learning-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.section-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.4em;
  color: var(--color-muted);
  margin: 0;
  text-transform: uppercase;
}

.learning-title {
  font-family: var(--heading);
  font-size: 56px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.title-accent {
  color: var(--color-blue);
}

.section-note {
  font-family: var(--sans);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-muted);
  margin: 0;
  letter-spacing: 0.04em;
}

.direction-group {
  width: 100%;
}

.direction-group + .direction-group {
  margin-top: 44px;
}

.direction-group-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 20px;
  text-align: left;
}

.group-dash {
  color: var(--color-blue);
  font-weight: 800;
}

.direction-link {
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  color: var(--color-blue);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.direction-link-arrow {
  font-size: 16px;
  line-height: 1;
  display: inline-block;
  transition: transform 0.2s ease;
}

.direction-link:hover {
  color: var(--color-cyan);
}

.direction-link:hover .direction-link-arrow {
  transform: translateX(3px);
}

.learning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 20px;
  width: 100%;
}

.learning-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  background: var(--color-white);
  border: 1px solid var(--color-hairline);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.learning-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-blue);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.learning-card:hover::before {
  transform: translateX(0);
}

.learning-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue);
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.learning-card:hover .learning-icon {
  color: var(--color-white);
}

.learning-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.learning-card:hover .learning-name {
  color: var(--color-white);
}

@media (max-width: 1024px) {
  .learning-section {
    padding: 10vh 16px;
  }

  .ghost-char {
    font-size: 34vh;
    right: -8vw;
  }

  .learning-container {
    gap: 40px;
  }

  .learning-title {
    font-size: 32px;
  }

  .learning-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .learning-card {
    padding: 28px 12px;
    gap: 12px;
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
    padding: 20px 8px;
    gap: 10px;
  }

  .learning-name {
    font-size: 13px;
  }
}
</style>
