<script setup lang="ts">
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
} from "lucide-vue-next";

interface LearningDirection {
  id: string;
  name: string;
  icon: typeof Globe;
}

const directions: LearningDirection[] = [
  { id: "web", name: "前端开发", icon: Globe },
  { id: "backend", name: "后端开发", icon: Coffee },
  { id: "game", name: "游戏开发", icon: Gamepad2 },
  { id: "android", name: "APP开发", icon: Smartphone },
  { id: "ui", name: "UI设计", icon: PencilRuler },
  { id: "embedded", name: "硬件开发", icon: Cpu },
  { id: "machinelearning", name: "深度学习", icon: BrainCircuit },
  { id: "video", name: "视频剪辑", icon: Clapperboard },
  { id: "reverse", name: "逆向工程", icon: Binary },
  { id: "crypto", name: "密码学", icon: LockKeyhole },
  { id: "websecurity", name: "Web安全", icon: ShieldAlert },
  { id: "pwn", name: "PWN", icon: Bug },
  { id: "editing", name: "编辑", icon: BookOpen },
];
</script>

<template>
  <section class="learning-section">
    <div class="learning-container">
      <h2 class="learning-title">学习方向</h2>

      <div class="learning-grid">
        <a
          v-for="dir in directions"
          :key="dir.id"
          :href="`/direction/${dir.id}`"
          class="learning-card"
        >
          <div class="learning-icon">
            <component :is="dir.icon" :size="48" stroke-width="1.5" />
          </div>

          <h3 class="learning-name">{{ dir.name }}</h3>
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
  padding: 60px 20px;
  background: transparent;
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
  background: linear-gradient(
    135deg,
    var(--color-blue) 0%,
    var(--color-cyan) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
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
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid rgba(130, 212, 242, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;
  flex: 0 1 calc(25% - 18px);
  max-width: 280px;
  text-decoration: none;
}

.learning-card:hover {
  background: rgba(130, 212, 242, 0.1);
  border-color: rgba(130, 212, 242, 0.4);
  box-shadow:
    0 8px 32px rgba(130, 212, 242, 0.15),
    0 0 60px rgba(111, 208, 206, 0.1);
  transform: translateY(-4px);
}

.learning-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--color-blue);
}

.learning-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-white);
  margin: 0;
  text-align: center;
}

@media (max-width: 1024px) {
  .learning-section {
    padding: 40px 16px;
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
