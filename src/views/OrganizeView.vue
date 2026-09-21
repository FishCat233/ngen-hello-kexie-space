<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { departments } from '../data/departments'
import {
  PRESIDIUM_CHAIR,
  PRESIDIUM_MEMBERS,
  presidiumAvatarColors,
  type PresidiumMember,
} from '../data/presidium'
import { showcaseSlides as staticShowcase } from '../data/showcase'
import { loadShowcase } from '../api/cms'
import BackButton from '../components/BackButton.vue'
import SlidingCarousel from '../components/SlidingCarousel.vue'

// 主席团头像：照片缺省时以姓氏色块呈现，配色按分组（主席团蓝 / 各部门专属色）
const avatarStyle = (member: PresidiumMember) => {
  const color = presidiumAvatarColors[member.group]
  return { background: color.bg, color: color.text }
}

const avatarChar = (member: PresidiumMember) => member.name.charAt(0)

// 部门风貌合照：图片由 PocketBase `showcase` 集合托管（管理员后台按 sortOrder 排列）
const showcaseSlides = ref(staticShowcase)
const showcaseError = ref(false)

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

// 轨道左 padding（首卡与标题对齐的缩进）；滚动定位需按此补偿
function trackPad(): number {
  const track = trackRef.value
  if (!track) return 0
  return parseFloat(getComputedStyle(track).paddingLeft) || 0
}

function scrollToIndex(index: number) {
  const track = trackRef.value
  if (!track) return
  const clamped = Math.max(0, Math.min(index, departments.length - 1))
  const card = track.children[clamped] as HTMLElement
  if (!card) return
  track.scrollTo({ left: card.offsetLeft - trackPad(), behavior: 'smooth' })
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
  const pad = trackPad()
  let nearest = 0
  let nearestDist = Infinity
  Array.from(track.children).forEach((child, i) => {
    const el = child as HTMLElement
    const dist = Math.abs(track.scrollLeft + pad - el.offsetLeft)
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
  void loadShowcase(staticShowcase).then((result) => {
    showcaseSlides.value = result.data
    showcaseError.value = result.source === 'fallback'
  })
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

      <!-- 标题行：标题居左，切换控件在卡片区域之外 -->
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
    </div>

    <!-- 全宽横向卡片流：轨道撑满视口，首卡与标题对齐 -->
    <div ref="trackRef" class="track" tabindex="0">
      <div v-for="dept in departments" :key="dept.id" class="dept-card">
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

    <div class="organize-container">
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

    <!-- 主席团 -->
    <div class="organize-container presidium-section">
      <h1 class="organize-title">
        <span class="title-accent">#</span> 主席团<span class="title-note">24级</span>
      </h1>

      <!-- 主席：单独强调位 -->
      <div class="chair-card">
        <span class="member-avatar avatar-chair" :style="avatarStyle(PRESIDIUM_CHAIR)">
          <img
            v-if="PRESIDIUM_CHAIR.avatar"
            :src="PRESIDIUM_CHAIR.avatar"
            :alt="PRESIDIUM_CHAIR.name"
            loading="lazy"
            decoding="async"
          />
          <template v-else>{{ avatarChar(PRESIDIUM_CHAIR) }}</template>
        </span>
        <span class="member-name name-chair">{{ PRESIDIUM_CHAIR.name }}</span>
        <span class="member-title">{{ PRESIDIUM_CHAIR.title }}</span>
      </div>

      <!-- 副主席 + 各部长/副部长 -->
      <div class="member-grid">
        <div v-for="member in PRESIDIUM_MEMBERS" :key="member.name" class="member-card">
          <span class="member-avatar" :style="avatarStyle(member)">
            <img
              v-if="member.avatar"
              :src="member.avatar"
              :alt="member.name"
              loading="lazy"
              decoding="async"
            />
            <template v-else>{{ avatarChar(member) }}</template>
          </span>
          <span class="member-name">{{ member.name }}</span>
          <span class="member-title">{{ member.title }}</span>
        </div>
      </div>
    </div>

    <!-- 部门风貌：全宽合照轮播 -->
    <div class="showcase-section">
      <div class="organize-container">
        <h1 class="organize-title"><span class="title-accent">#</span> 部门风貌</h1>
        <p v-if="showcaseError" class="cms-notice">内容服务暂不可用，合照暂无法显示</p>
      </div>
      <div class="showcase-carousel">
        <SlidingCarousel :slides="showcaseSlides" />
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

/* 全宽卡片流：撑满视口宽，多张竖版卡片同时可见；
   padding-left 让首卡与容器内标题对齐，scroll-padding-left 让吸附点同样对齐 */
.track {
  position: relative;
  display: flex;
  gap: 48px;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 12px max(20px, calc((100vw - 1200px) / 2 + 20px)) 48px;
  scroll-padding-left: max(20px, calc((100vw - 1200px) / 2 + 20px));
  outline: none;
}

.track::-webkit-scrollbar {
  display: none;
}

/* 部门卡片：竖版比例，上图片下文字，浅黑卡片底表达层级 */
.dept-card {
  flex-shrink: 0;
  width: min(460px, 88vw);
  min-height: 480px;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  scroll-snap-align: start;
  background: var(--color-card);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

/* 上部：灰色图片预留位 */
.dept-image {
  flex-shrink: 0;
  height: 200px;
  background: #d4d4d4;
}

.dept-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 下部：内容区 */
.dept-content {
  flex: 1;
  min-height: 0;
  padding: 28px 30px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dept-name {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-white);
  margin: 0;
  line-height: var(--leading-tight);
}

.dept-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  margin-top: auto;
  padding: 10px 24px;
  font-size: var(--text-ui);
  font-weight: 500;
  color: var(--color-white);
  border: 2px solid var(--color-white);
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

/* 分页圆点指示器 */
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

/* ---------- 主席团 ---------- */
.presidium-section {
  margin-top: 88px;
}

.title-note {
  margin-left: 10px;
  font-size: var(--text-ui);
  font-weight: 500;
  color: #9ca3af;
}

/* 主席强调位：居中独卡 */
.chair-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 264px;
  padding: 36px 24px 30px;
  margin: 44px auto 28px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  transition: background 0.2s ease;
}

.chair-card:hover {
  background: #141414;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 26px 12px 22px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  transition: background 0.2s ease;
}

.member-card:hover {
  background: #141414;
}

/* 头像：照片缺省时姓氏色块（分组配色），圆角由全局头像 token 决定 */
.member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: var(--text-h5);
  font-weight: 700;
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-chair {
  width: 84px;
  height: 84px;
  font-size: var(--text-h3);
}

.member-name {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-white);
}

.name-chair {
  font-size: var(--text-h3);
}

.member-title {
  font-size: var(--text-ui);
  color: #9ca3af;
}

/* ---------- 部门风貌：全宽合照轮播 ---------- */
.showcase-section {
  margin-top: 88px;
}

.cms-notice {
  margin-top: 20px;
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--color-text);
}

.showcase-carousel {
  width: 100%;
  height: clamp(320px, 46vh, 560px);
  margin-top: 28px;
}

@media (max-width: 1024px) {
  .member-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .organize-page {
    padding: 24px 0 10vh;
  }

  .organize-container {
    padding: 0 16px;
  }

  .track {
    gap: 24px;
    padding: 8px 16px 40px;
    scroll-padding-left: 16px;
  }

  .dept-card {
    width: 85vw;
    min-height: auto;
  }

  .dept-image {
    height: 170px;
  }

  .dept-content {
    padding: 24px 22px 26px;
    gap: 16px;
  }

  .dept-name {
    font-size: var(--text-h3);
  }

  .dept-paragraph {
    font-size: var(--text-body);
  }

  .member-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .member-card {
    padding: 18px 8px 16px;
  }

  .member-avatar {
    width: 48px;
    height: 48px;
    font-size: var(--text-body-lg);
  }

  .chair-card {
    margin: 32px auto 24px;
    padding: 28px 20px 24px;
  }

  .avatar-chair {
    width: 72px;
    height: 72px;
  }

  .showcase-carousel {
    height: clamp(240px, 38vh, 420px);
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .member-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
