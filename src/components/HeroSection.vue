<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { ArrowRight, ChevronRight } from 'lucide-vue-next'
import HeroBand from './HeroBand.vue'
import { departments } from '../data/departments'

// 第二行标语词组，与 departments.ts 的 id 对应
const deptWords: Record<string, string[]> = {
  multimedia: ['开发页面', '设计UI', '创造美好'],
  software: ['训练模型', '开发游戏', '打磨软件'],
  hardware: ['设计电路', '驱动硬件', '点亮创意'],
  organize: ['策划活动', '凝聚团队', '连接彼此'],
  security: ['攻防演练', '挖掘漏洞', '守护安全'],
}

// 部门专属色：卡片纯色底 + 第二行词组
const deptColors: Record<string, string> = {
  multimedia: '#3b82f6',
  software: '#a78bfa',
  hardware: '#fb923c',
  organize: '#34d399',
  security: '#f87171',
}

const SWITCH_INTERVAL = 3500

// 堆顶部门索引；切换 = 顶卡沉底、整叠联动上移（参考 React Bits Stack）
const deckIndex = ref(0)

const currentDept = computed(() => departments[deckIndex.value])
const words = computed(() => deptWords[currentDept.value.id] ?? deptWords.multimedia)

// 位置驱动的有机堆叠：不同角度 + 上下交替偏移
// 退走的卡（pos 0→末位）y 偏移向上 → "先向上"
// 上来的卡（pos 1→0）从下方偏移归位 → "从下侧切换上来"
const posRotations = [0, -3, 4, -2, 5]
const posYOffsets = [0, 7, -6, 9, -5]

const deckCardStyle = (deptId: string, index: number) => {
  const pos = (index - deckIndex.value + departments.length) % departments.length
  return {
    transform: `rotate(${posRotations[pos] ?? 0}deg) translateY(${posYOffsets[pos] ?? 0}px) scale(${1 - pos * 0.05})`,
    zIndex: departments.length - pos,
    filter: pos === 0 ? 'none' : `blur(${(pos * 1.0).toFixed(1)}px)`,
    background: deptColors[deptId],
  }
}

const timer = setInterval(() => {
  deckIndex.value = (deckIndex.value + 1) % departments.length
}, SWITCH_INTERVAL)

onUnmounted(() => clearInterval(timer))

const buttons = [
  {
    id: 'qq-group',
    label: '加入我们',
    icon: 'qq',
    href: 'https://api.kexie.space/recruitment-qq-group',
  },
  {
    id: 'terminal',
    label: '练习编程',
    icon: 'terminal',
    href: 'https://oj.kexie.space',
  },
  {
    id: 'knowledge',
    label: '知识库',
    icon: 'server',
    href: 'https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb',
  },
  {
    id: 'qq-channel',
    label: 'QQ频道',
    icon: 'hash',
    href: 'https://pd.qq.com/s/5pxzsijx0',
  },
]
</script>

<template>
  <section class="hero-section">
    <HeroBand
      class="hero-band"
      color="#3b82f6"
      :speed="0.2"
      :frequency="1.0"
      :noise="0"
      :band-width="0.22"
      :rotation="89"
      :fade-top="1.0"
      :iterations="1"
      :intensity="1.5"
      :scale="1"
      :warp-strength="1"
      :y-offset="0.3"
      :mouse-influence="0.3"
    />

    <div class="hero-content">
      <h1 class="hero-heading">
        <!-- 第一行：归属路径 -->
        <span class="hero-line hero-line-meta">
          <span class="meta-text">在</span>
          <ChevronRight class="meta-chevron" :stroke-width="3" aria-hidden="true" />
          <span class="meta-org-group">
            <span class="meta-bracket">[</span>
            <span class="meta-org">科协</span>
            <span class="meta-bracket">]</span>
          </span>
          <span class="dept-deck">
            <span
              v-for="(dept, index) in departments"
              :key="dept.id"
              class="deck-card"
              :style="deckCardStyle(dept.id, index)"
            >
              {{ dept.name }}
            </span>
          </span>
        </span>

        <!-- 第二行：主标语（词组随部门滚动切换） -->
        <span
          class="hero-line hero-line-main"
          :style="{ '--dept-color': deptColors[currentDept.id] }"
        >
          <span class="main-lead">一起</span>
          <template v-for="i in 3" :key="`slot-${i}`">
            <span class="word-slot">
              <Transition name="roll">
                <span :key="`w${i}-${words[i - 1]}`" class="word">{{ words[i - 1] }}</span>
              </Transition>
            </span>
          </template>
          <!-- 贴纸图片预留位：替换为 <img> -->
          <span class="hero-sticker" aria-hidden="true"></span>
        </span>
      </h1>

      <!-- 底部：功能按钮 -->
      <div class="hero-buttons">
        <a v-for="button in buttons" :key="button.id" :href="button.href" class="hero-button">
          <!-- hover：左侧展开的矢量箭头 -->
          <ArrowRight class="hero-button-arrow" :size="20" :stroke-width="2.5" />

          <!-- QQ群图标 -->
          <svg
            v-if="button.icon === 'qq'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.21 0 6.287.257 6.287-.43 0-.687-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"
            />
          </svg>

          <!-- 终端图标 -->
          <svg
            v-else-if="button.icon === 'terminal'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>

          <!-- 服务器图标 -->
          <svg
            v-else-if="button.icon === 'server'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>

          <!-- #图标 -->
          <svg
            v-else-if="button.icon === 'hash'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>

          <span>{{ button.label }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* 顶部背景：HeroBand 流动光带（移植自 vue-bits.dev 官网首屏）。
   容器高 150%、锚定首屏底部，顶部溢出部分被裁掉——与官网一致；
   screen 混合让色带对暗底提亮；底部用 mask 渐隐到透明，
   与下一屏纯黑背景平滑过渡 */
:deep(.hero-band) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150%;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 75%, transparent 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

@media (max-width: 640px) {
  .hero-sticker {
    display: none;
  }
}

/* 两行标题：字号等大（clamp 保证任意屏宽单行不溢出）、加粗（900 + 描边），
   切换后各行保持居中且不换行 */
.hero-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  font-size: clamp(15px, calc(5.3vw - 6px), 64px);
  font-weight: 900;
  -webkit-text-stroke: 0.016em;
  line-height: 1;
}

.hero-line {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-shadow: 0 0 0.18em rgba(0, 0, 0, 0.55);
}

/* 第一行：在 > [ 科协 ] 部门卡堆 */
.hero-line-meta {
  gap: 0.22em;
  color: var(--color-text);
}

.meta-chevron {
  width: 0.6em;
  height: 0.6em;
  color: var(--color-primary);
}

/* 括号 + 科协 分组：inline-flex 确保视觉高度一致 */
.meta-org-group {
  display: inline-flex;
  align-items: center;
  gap: 0.06em;
}

.meta-bracket {
  color: var(--color-primary);
  font-size: 1.12em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.meta-org {
  color: var(--color-primary);
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

/* 部门卡堆（参考 React Bits Stack）：全部卡片常驻同一 grid 单元，
   位置由堆内序号驱动（rotate/translateY/scale/z-index/blur），切换时整叠联动 */
.dept-deck {
  display: inline-grid;
  margin-left: 0.18em;
}

.deck-card {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1em 0.32em;
  border-radius: var(--radius-pill);
  color: var(--color-white);
  text-shadow: none;
  transform-origin: 90% 90%;
  /* spring 近似：轻微过冲曲线，0.7s 让切换更从容 */
  transition:
    transform 0.7s cubic-bezier(0.34, 1.4, 0.5, 1),
    filter 0.6s ease;
}

/* 第二行：一起 + 滚动词组 + 贴纸位 */
.hero-line-main {
  gap: 0.3em;
  color: var(--color-text);
}

.main-lead {
  color: var(--color-text);
}

/* 词组滚动窗口：旧词上滚出、新词下滚入，切换后行宽即时更新并重新居中 */
.word-slot {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.word {
  display: inline-block;
  color: var(--dept-color, var(--color-primary));
}

.roll-enter-active,
.roll-leave-active {
  transition:
    transform 0.45s ease,
    opacity 0.45s ease;
}

.roll-enter-from {
  transform: translateY(110%);
  opacity: 0;
}

.roll-leave-to {
  transform: translateY(-110%);
  opacity: 0;
}

.roll-leave-active {
  position: absolute;
}

/* 贴纸图片预留位（虚线框为占位标记，替换为 <img> 后删除边框） */
.hero-sticker {
  flex-shrink: 0;
  width: 1.1em;
  height: 1.1em;
  border: 2px dashed rgba(59, 130, 246, 0.35);
  border-radius: var(--radius-md);
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .hero-buttons {
    gap: 10px;
    margin-top: 12px;
  }
}

.hero-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 140px;
  padding: 12px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: rgba(10, 14, 20, 0.45);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  color: var(--color-white);
  font-size: var(--text-ui);
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

/* 色块滑切 hover */
.hero-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary-bright);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.hero-button:hover::before {
  transform: translateX(0);
}

.hero-button > * {
  position: relative;
  z-index: 1;
}

/* hover：矢量箭头作为流内元素参与布局，宽度从 0 展开 */
.hero-button-arrow {
  order: -1;
  flex-shrink: 0;
  width: 0;
  height: 20px;
  margin-left: -8px;
  opacity: 0;
  transition:
    width 0.3s ease,
    margin-left 0.3s ease,
    opacity 0.25s ease;
}

.hero-button:hover .hero-button-arrow {
  width: 20px;
  margin-left: 0;
  opacity: 1;
}

.hero-button-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .hero-button {
    width: 130px;
    padding: 10px 12px;
  }
}
</style>
