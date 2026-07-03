<script setup lang="ts">
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
}

const directions: LearningDirection[] = [
  { id: 'web', name: '前端开发', icon: Globe },
  { id: 'backend', name: '后端开发', icon: Coffee },
  { id: 'game', name: '游戏开发', icon: Gamepad2 },
  { id: 'android', name: 'APP开发', icon: Smartphone },
  { id: 'ui', name: 'UI设计', icon: PencilRuler },
  { id: 'embedded', name: '硬件开发', icon: Cpu },
  { id: 'machinelearning', name: '深度学习', icon: BrainCircuit },
  { id: 'video', name: '视频剪辑', icon: Clapperboard },
  { id: 'reverse', name: '逆向工程', icon: Binary },
  { id: 'crypto', name: '密码学', icon: LockKeyhole },
  { id: 'websecurity', name: 'Web安全', icon: ShieldAlert },
  { id: 'pwn', name: 'PWN', icon: Bug },
  { id: 'editing', name: '编辑', icon: BookOpen },
]

const navigateToDirection = (id: string) => {
  router.push(`/direction/${id}`)
}
</script>

<template>
  <section class="learning-section">
    <div class="learning-container">
      <h2 class="learning-title"><span class="title-accent">#</span> 学习方向</h2>

      <div class="learning-grid">
        <div
          v-for="dir in directions"
          :key="dir.id"
          class="learning-card"
          @click="navigateToDirection(dir.id)"
        >
          <div class="learning-icon">
            <component :is="dir.icon" :size="48" stroke-width="1.5" />
          </div>

          <h3 class="learning-name">{{ dir.name }}</h3>
        </div>
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

.learning-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.learning-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
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
