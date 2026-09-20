<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Department {
  id: string
  name: string
  description: string[]
  iconType: 'monitor' | 'server' | 'hardware' | 'organize' | 'security'
  website?: {
    url: string
    label: string
  }
}

const departments: Department[] = [
  {
    id: 'multimedia',
    name: '多媒体部',
    description: [
      '多媒体部主要方向的网站开发、UI设计、视频剪辑、小程序开发和编辑方向均依托多媒体技术，以极强的浸透力进入学校日常生活的方方面面。',
      '五个方向相互联系紧密，网站与小程序需要界面优美的UI设计，界面优美的UI设计需要网站或小程序去实现，它们也可以通过视频剪辑技术以易展现的形式与周围人分享，编辑方向则负责内容创作与文案策划，为技术展示提供优质的文字支撑。',
    ],
    iconType: 'monitor',
  },
  {
    id: 'software',
    name: '软件部',
    description: [
      '软件部是科协专攻软件开发的部门其主要方向包括深度学习、APP开发和游戏开发。',
      '软件部注重培养成员在遵循软件工程开发体系的要求，去设计并开发一款或多款具备创新、实用等特点的软件的实践能力，旨在让成员能够承接校内信息化项目的同时，也能够参加校外高水平的竞赛。',
    ],
    iconType: 'server',
  },
  {
    id: 'hardware',
    name: '硬件部',
    description: [
      '硬件部致力于将传统的嵌入式软硬件设计与互联网资源结合，充分体现"互联网+"精神，真正将我们在计算机专业中学习到的知识应用与生活，设计制作真正服务与生活的嵌入式智能硬件。',
      '引导同学们进行科技研发，从而提高同学们的创新意识，加强同学们的动手能力以及理论与实际相结合的能力，培养创新型人才。',
    ],
    iconType: 'hardware',
  },
  {
    id: 'organize',
    name: '组织部',
    description: [
      '组织部是一个协调科协主席团和其他三大技术部门的综合性管理兼学术部门，主管组织、人事工作、素质拓展和团队建设。',
      '负责协调科协的组织建设，管理科协的日常事务，策划和组织科协的各类活动，管理科协成员和内部的各种设施，同时，协调和处理学校、学院领导的指示要求，代表三院科协与学校、学院的各个社团进行沟通交流。',
    ],
    iconType: 'organize',
  },
  {
    id: 'security',
    name: '安全部',
    description: [
      '安全部聚焦网络安全技术，以 CTF 竞赛为实践入口，将竞赛里的解题思路、攻防技巧，转化为真实场景中漏洞挖掘的能力。',
      '从代码逻辑排查到程序底层分析，覆盖 WEB（代码审计、漏洞攻防 ）与二进制（漏洞利用、逆向分析 ）方向，通过 "以赛促战"，让成员掌握从发现风险到实战防御的全流程技能，筑牢安全防线。',
    ],
    iconType: 'security',
    website: {
      url: 'https://hjsec.github.io',
      label: '安全部主页',
    },
  },
]

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

function scrollToIndex(index: number) {
  const track = trackRef.value
  if (!track) return
  const clamped = Math.max(0, Math.min(index, departments.length - 1))
  const card = track.children[clamped] as HTMLElement
  if (!card) return
  track.scrollTo({
    left: card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2,
    behavior: 'smooth',
  })
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
  const center = track.scrollLeft + track.offsetWidth / 2
  let nearest = 0
  let nearestDist = Infinity
  Array.from(track.children).forEach((child, i) => {
    const el = child as HTMLElement
    const childCenter = el.offsetLeft + el.offsetWidth / 2
    const dist = Math.abs(center - childCenter)
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
  <section class="departments-section">
    <div class="departments-container">
      <h2 class="departments-title"><span class="title-accent">#</span> 部门介绍</h2>

      <div class="carousel">
        <!-- 左箭头 -->
        <button
          class="nav-btn nav-prev"
          :disabled="activeIndex === 0"
          aria-label="上一张"
          @click="prev"
        >
          <ChevronLeft :size="24" :stroke-width="2.5" />
        </button>

        <!-- 横向滑动轨道 -->
        <div ref="trackRef" class="track" tabindex="0">
          <div
            v-for="(dept, i) in departments"
            :key="dept.id"
            class="dept-card"
            :data-active="i === activeIndex"
          >
            <!-- 左侧：图片预留位（灰色占位，替换为 <img> 即可） -->
            <div class="dept-image">
              <!-- <img src="..." alt="" /> -->
            </div>

            <!-- 右侧：深色内容区 -->
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

        <!-- 右箭头 -->
        <button
          class="nav-btn nav-next"
          :disabled="activeIndex === departments.length - 1"
          aria-label="下一张"
          @click="next"
        >
          <ChevronRight :size="24" :stroke-width="2.5" />
        </button>
      </div>

      <!-- 分页指示器 -->
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
  </section>
</template>

<style scoped>
.departments-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10vh 0;
  background: var(--color-bg);
}

.departments-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.departments-title {
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-align: center;
}

.title-accent {
  color: var(--color-primary);
}

/* 轮播容器：箭头 + 轨道 + 箭头 */
.carousel {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* 横向滑动轨道 */
.track {
  flex: 1;
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 max(24px, calc((100vw - 680px) / 2));
  outline: none;
}

.track::-webkit-scrollbar {
  display: none;
}

/* 部门卡片：左图右文色块分区（参考用户排版图） */
.dept-card {
  flex-shrink: 0;
  width: min(680px, 88vw);
  display: flex;
  border-radius: var(--radius-lg);
  overflow: hidden;
  scroll-snap-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  transition: opacity 0.4s ease;
}

.dept-card[data-active='false'] {
  opacity: 0.4;
}

.dept-card[data-active='false']:hover {
  opacity: 0.7;
}

/* 左侧：图片预留位 — 暗蓝底与主题呼应，不刺眼 */
.dept-image {
  flex: 2;
  min-width: 0;
  background: var(--color-primary-dim);
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.dept-name {
  font-size: var(--text-h4);
  font-weight: 700;
  color: var(--color-white);
  margin: 0;
}

.dept-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dept-paragraph {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  margin: 0;
  text-align: justify;
}

.dept-link {
  align-self: flex-start;
  padding: 8px 20px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-white);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: background 0.2s ease;
}

.dept-link:hover {
  background: var(--color-primary-bright);
  color: var(--color-on-primary);
}

/* 操作控件：左右箭头 */
.nav-btn {
  position: absolute;
  z-index: 10;
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

.nav-prev {
  left: max(12px, calc((100vw - 680px) / 2 - 60px));
}

.nav-next {
  right: max(12px, calc((100vw - 680px) / 2 - 60px));
}

/* 分页圆点指示器 */
.dots {
  display: flex;
  gap: 10px;
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
  .departments-section {
    padding: 8vh 0;
  }

  .departments-container {
    gap: 28px;
  }

  .track {
    padding: 0 16px;
    gap: 16px;
  }

  .dept-card {
    width: 88vw;
  }

  .dept-content {
    padding: 28px 24px;
    gap: 16px;
  }

  .dept-name {
    font-size: var(--text-h3);
  }

  .nav-btn {
    display: none;
  }
}
</style>
