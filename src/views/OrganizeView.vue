<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { departments } from '../data/departments'
import BackButton from '../components/BackButton.vue'

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

function scrollToIndex(index: number) {
  const track = trackRef.value
  if (!track) return
  const clamped = Math.max(0, Math.min(index, departments.length - 1))
  const card = track.children[clamped] as HTMLElement
  if (!card) return
  track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
  activeIndex.value = clamped
}

function prev() {
  scrollToIndex(activeIndex.value - 1)
}

function next() {
  scrollToIndex(activeIndex.value + 1)
}

function onScroll() {
  const track = trackRef.value
  if (!track) return
  let nearest = 0
  let nearestDist = Infinity
  Array.from(track.children).forEach((child, i) => {
    const el = child as HTMLElement
    const dist = Math.abs(track.scrollLeft - el.offsetLeft)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = i
    }
  })
  activeIndex.value = nearest
}

function onKeydown(e: KeyboardEvent) {
  const track = trackRef.value
  if (!track || document.activeElement !== track) return
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  trackRef.value?.addEventListener('scroll', onScroll, { passive: true })
  trackRef.value?.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  trackRef.value?.removeEventListener('scroll', onScroll)
  trackRef.value?.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="organize-page">
    <div class="organize-container">
      <BackButton />

      <!-- 标题行：标题居左，切换控件在外侧（卡片区域之外） -->
      <div class="organize-header">
        <h1 class="organize-title"><span class="title-accent">#</span> 组织架构</h1>
        <div class="header-controls">
          <button class="nav-btn" :disabled="activeIndex === 0" aria-label="上一张" @click="prev">
            <ChevronLeft :size="22" :stroke-width="2.5" />
          </button>
          <button
            class="nav-btn"
            :disabled="activeIndex === departments.length - 1"
            aria-label="下一张"
            @click="next"
          >
            <ChevronRight :size="22" :stroke-width="2.5" />
          </button>
        </div>
      </div>

      <!-- 轨道占满容器宽度：首卡与标题左对齐 -->
      <div ref="trackRef" class="track" tabindex="0">
        <div
          v-for="(dept, i) in departments"
          :key="dept.id"
          class="dept-card"
          :data-active="i === activeIndex"
        >
          <div class="dept-image" />
          <div class="dept-content">
            <h3 class="dept-name">{{ dept.name }}</h3>
            <div class="dept-body">
              <p v-for="(para, pi) in dept.description" :key="pi" class="dept-paragraph">
                {{ para }}
              </p>
            </div>
            <a
              v-if="dept.website"
              :href="dept.website.url"
              target="_blank"
              rel="noopener noreferrer"
              class="dept-link"
            >
              {{ dept.website.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="dots">
        <button
          v-for="(dept, i) in departments"
          :key="dept.id"
          class="dot"
          :class="{ active: i === activeIndex }"
          :aria-label="`第 ${i + 1} 张`"
          @click="scrollToIndex(i)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.organize-page {
  width: 100%;
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 0 40px;
}

/* 普通 block 容器：BackButton 保持自然宽度不被拉伸 */
.organize-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 标题行：标题居左 + 切换按钮居右（控件在卡片区域外侧） */
.organize-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.organize-title {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.title-accent {
  color: var(--color-primary);
}

.header-controls {
  display: flex;
  gap: 12px;
}

/* 横向滑动轨道：占满容器宽度，首卡与标题左对齐；
   position: relative 让卡片 offsetLeft 相对轨道计算 */
.track {
  position: relative;
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* 上下留出卡片阴影的空间，避免被 overflow 裁切 */
  padding: 12px 0 48px;
  outline: none;
}

.track::-webkit-scrollbar {
  display: none;
}

/* 部门卡片：更宽更扁平，高度由内容决定（不裁切文字） */
.dept-card {
  flex-shrink: 0;
  width: min(1080px, 100%);
  min-height: 320px;
  display: flex;
  border-radius: var(--radius-lg);
  overflow: hidden;
  scroll-snap-align: start;
  background: var(--color-surface);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  transition: opacity 0.4s ease;
}

.dept-card[data-active='false'] {
  opacity: 0.4;
}

.dept-card[data-active='false']:hover {
  opacity: 0.7;
}

/* 左侧：灰色图片预留位 */
.dept-image {
  flex: 2;
  min-width: 0;
  background: #d4d4d4;
}

.dept-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧：深色内容区 */
.dept-content {
  flex: 3;
  min-width: 0;
  padding: 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.dept-name {
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--color-white);
  margin: 0;
  line-height: var(--leading-tight);
}

.dept-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dept-paragraph {
  font-size: var(--text-body-lg);
  line-height: var(--leading-normal);
  color: #b0b0b0;
  margin: 0;
  text-align: justify;
}

.dept-link {
  align-self: flex-start;
  padding: 10px 24px;
  font-size: var(--text-ui);
  font-weight: 500;
  color: var(--color-white);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: background 0.2s ease;
}

.dept-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-on-primary);
}

/* 切换控件：位于标题行右侧，卡片区域之外 */
.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-line);
  background: rgba(10, 14, 20, 0.72);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  color: var(--color-white);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    opacity 0.2s ease,
    background 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* 分页圆点指示器：轨道下方，卡片区域之外 */
.dots {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--color-line);
  cursor: pointer;
  padding: 0;
  transition:
    width 0.3s ease,
    background 0.3s ease;
}

.dot.active {
  width: 24px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .organize-page {
    padding: 24px 0 10vh;
  }

  .organize-container {
    padding: 0 16px;
  }

  .track {
    gap: 16px;
    padding: 8px 0 40px;
  }

  .dept-card {
    width: 100%;
    min-height: auto;
    flex-direction: column;
  }

  .dept-image {
    flex: none;
    height: 150px;
  }

  .dept-content {
    padding: 24px 20px;
    gap: 16px;
  }

  .dept-name {
    font-size: var(--text-h3);
  }

  .dept-paragraph {
    font-size: var(--text-body);
  }
}
</style>
