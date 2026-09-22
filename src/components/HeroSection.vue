<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onUnmounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { departments } from '../data/departments'

// 背景光带异步加载，延迟到首屏文字渲染后再拉取，不阻塞首屏绘制
// （2026-09-21：HeroBand 改为裸 WebGL，已无 three.js 依赖）
const HeroBand = defineAsyncComponent(() => import('./HeroBand.vue'))

// 第二行标语词组，与 departments.ts 的 id 对应
const deptWords: Record<string, string[]> = {
  multimedia: ['开发网站', '设计视觉', '玩转创意'],
  software: ['训练模型', '开发游戏', '打磨软件'],
  hardware: ['设计电路', '驱动硬件', '点亮创意'],
  organize: ['策划活动', '凝聚团队', '连接彼此'],
  security: ['攻防演练', '挖掘漏洞', '守护安全'],
}

// 部门专属色：药丸底色 + 第二行词组
const deptColors: Record<string, string> = {
  multimedia: '#22d3ee',
  software: '#a78bfa',
  hardware: '#fb923c',
  organize: '#34d399',
  security: '#f87171',
}

// 药丸内文字色：比各自药丸底色更深的同色系
const deptTextColors: Record<string, string> = {
  multimedia: '#164e63',
  software: '#4c1d95',
  hardware: '#7c2d12',
  organize: '#065f46',
  security: '#7f1d1d',
}

const SWITCH_INTERVAL = 3500

// 堆顶部门索引；切换 = 顶卡沉底、整叠联动上移（参考 React Bits Stack）
const deckIndex = ref(0)

const currentDept = computed(() => departments[deckIndex.value])
const words = computed(() => deptWords[currentDept.value.id] ?? deptWords.multimedia)

// 位置驱动的有机堆叠：不同角度 + 上下交替偏移（em 相对标题字号缩放）
// 退走的卡（pos 0→末位）y 偏移向上 → "先向上"
// 上来的卡（pos 1→0）从下方偏移归位 → "从下侧切换上来"
// 前卡（pos 0）微降补偿视觉偏高；下侧后卡（pos 1/3）左移收拢
const posRotations = [0, -4, 5, -3, 7]
const posYOffsets = [0.06, 0.1, -0.09, 0.12, -0.07]
const posXOffsets = [0, -0.14, 0, -0.16, 0]

// 分层景深：越靠后模糊越强、压得越暗（em 随标题字号缩放）；pos1（下侧近层）模糊收小保证边缘清晰
const posBlurs = [0, 0.03, 0.1, 0.16, 0.22]
const posBrightness = [1, 0.8, 0.6, 0.45, 0.32]

const deckPos = (index: number) =>
  (index - deckIndex.value + departments.length) % departments.length

// 多媒体部药丸 4 字最宽：顶卡自定卡堆宽度无需修正；沉底后相对较窄顶卡右溢，
// 按层次左移收拢——pos1/3 已有内建 x 偏移补一点即可，pos2/4 无偏移补更多，末位补最多
const deptPosNudges: Record<string, string[]> = {
  // [pos0 顶卡, pos1 倒数第四, pos2 倒数第三, pos3 倒数第二, pos4 末位]
  multimedia: ['0em', '-0.1em', '-0.3em', '-0.15em', '-0.5em'],
}

const deckCardStyle = (deptId: string, index: number) => {
  const pos = deckPos(index)
  const nudge = deptPosNudges[deptId]?.[pos] ?? '0em'
  return {
    transform: `rotate(${posRotations[pos] ?? 0}deg) translate(calc(${posXOffsets[pos] ?? 0}em + ${nudge}), ${posYOffsets[pos] ?? 0}em) scale(${1 - pos * 0.05})`,
    zIndex: departments.length - pos,
    filter:
      pos === 0 ? 'none' : `blur(${posBlurs[pos] ?? 0}em) brightness(${posBrightness[pos] ?? 1})`,
    background: deptColors[deptId],
    color: deptTextColors[deptId],
  }
}

// 行重排位移动画（FLIP）：切换使行宽变化 → flex 居中重新对位时文字会瞬移；
// 先记首元素旧位置，重排后对整行施加反向位移、再过渡回 0，实现平滑滑向新居中位
const metaLineRef = ref<HTMLElement>()
const mainLineRef = ref<HTMLElement>()

const firstChildLeft = (line?: HTMLElement) =>
  (line?.firstElementChild as HTMLElement | null)?.getBoundingClientRect().left ?? null

const flipLine = (
  line: HTMLElement | undefined,
  oldLeft: number | null,
  duration: number,
  easing: string,
) => {
  const left = firstChildLeft(line)
  if (!line || oldLeft === null || left === null) return
  const dx = oldLeft - left
  if (Math.abs(dx) < 0.5) return
  line.style.transition = 'none'
  line.style.transform = `translateX(${dx}px)`
  void line.offsetWidth
  requestAnimationFrame(() => {
    line.style.transition = `transform ${duration}s ${easing}`
    line.style.transform = ''
  })
}

const timer = setInterval(() => {
  const metaBefore = firstChildLeft(metaLineRef.value)
  const mainBefore = firstChildLeft(mainLineRef.value)
  deckIndex.value = (deckIndex.value + 1) % departments.length
  void nextTick(() => {
    // 滑动节奏分别跟随各行内部动画：卡堆 0.7s 过冲曲线 / 词组滚动 0.45s ease
    flipLine(metaLineRef.value, metaBefore, 0.7, 'cubic-bezier(0.34, 1.4, 0.5, 1)')
    flipLine(mainLineRef.value, mainBefore, 0.45, 'ease')
  })
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
        <span ref="metaLineRef" class="hero-line hero-line-meta">
          <span class="meta-text">在</span>
          <!-- 尖角直角箭头，无圆角，宽而粗 -->
          <svg class="meta-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 4L17 12L7 20"
              stroke="currentColor"
              stroke-width="3.5"
              stroke-linecap="butt"
              stroke-linejoin="miter"
            />
          </svg>
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
              :class="{ 'is-behind': deckPos(index) !== 0 }"
              :style="deckCardStyle(dept.id, index)"
            >
              <span class="deck-card-text">{{ dept.name }}</span>
            </span>
          </span>
        </span>

        <!-- 第二行：词组 + 部门色 -->
        <span
          ref="mainLineRef"
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
        </span>
      </h1>

      <!-- 第三行：slogan -->
      <p class="hero-slogan">把灵感写成代码，把热爱做成作品</p>

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
  /* 异步加载完成后淡入，避免光带突兀弹出 */
  animation: hero-band-in 1.2s ease both;
}

@keyframes hero-band-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  /* 整体略偏上（2026-09-21 由 -12vh 下移：加大距顶部留白，首屏高度不变、不影响下方区块） */
  margin-top: 0;
  transform: translateY(-6vh);
}

/* 两行标题：字号等大（clamp 保证任意屏宽单行不溢出）、加粗（900 + 描边），
   切换后各行保持居中且不换行 */
.hero-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  font-size: clamp(18px, calc(6vw - 6px), 80px);
  font-weight: 900;
  -webkit-text-stroke: 0.016em;
  line-height: 1;
}

/* 第三行 slogan：白色、加大字号，与主标题、按钮区均拉开间距 */
.hero-slogan {
  margin: 20px 0 0;
  font-size: var(--text-h4);
  font-weight: 500;
  color: var(--color-white);
  line-height: var(--leading-normal);
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
  width: 0.85em;
  height: 0.85em;
  color: var(--color-primary);
  /* SVG 图形不吃 text-shadow，用同参数 drop-shadow 补齐同款阴影 */
  filter: drop-shadow(0 0 0.18em rgba(0, 0, 0, 0.55));
  /* CJK 光学中心偏低于几何中心，箭头向下微调对齐 */
  transform: translateY(0.05em);
}

/* 括号 + 科协 分组：inline-flex 确保视觉高度一致 */
.meta-org-group {
  display: inline-flex;
  align-items: center;
  gap: 0.04em;
}

.meta-bracket {
  color: var(--color-primary);
  font-size: 1em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  /* 全角括号墨迹偏下，上提与文字视觉对齐 */
  transform: translateY(-0.02em);
}

.meta-org {
  color: var(--color-primary);
  font-size: 1em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

/* 部门卡堆（参考 React Bits Stack）：全部卡片常驻同一 grid 单元，
   位置由堆内序号驱动（rotate/translateY/scale/z-index/blur），切换时整叠联动 */
/* 卡堆容器：relative 使绝对定位的背景卡以本容器为包含块 */
.dept-deck {
  position: relative;
  display: inline-grid;
  margin-left: 0.18em;
}

.deck-card {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 大药丸：外框略高于周围文字墨迹（900 字重 + 描边出血后视觉高度 > 1em） */
  height: 1.08em;
  padding: 0 0.3em;
  border-radius: var(--radius-pill);
  text-shadow: none;
  transform-origin: 90% 90%;
  /* spring 近似：轻微过冲曲线，0.7s 让切换更从容 */
  transition:
    transform 0.7s cubic-bezier(0.34, 1.4, 0.5, 1),
    filter 0.6s ease;
}

/* 非顶卡绝对定位：不参与 grid 列宽计算 → 卡堆宽度始终贴合当前顶卡内容，
   药丸与左侧文字间距恒定；绝对项锚定同一 cell 左上角，切换仍由 transform 驱动 */
.deck-card.is-behind {
  position: absolute;
  top: 0;
  left: 0;
}

.deck-card-text {
  font-size: 0.78em;
  font-weight: 700;
  line-height: 1;
  /* 中文字体基线偏下导致墨迹视觉偏低，上提补偿实现光学居中 */
  transform: translateY(-0.03em);
}

/* 第二行：一起 + 滚动词组 + 贴纸位 */
.hero-line-main {
  gap: 0.3em;
  color: var(--color-text);
}

.main-lead {
  color: var(--color-text);
}

/* 词组滚动窗口：旧词上滚出、新词下滚入，切换后行宽即时更新并重新居中。
   padding 扩出文字阴影与粗字重的出血范围，负 margin 抵消占位，
   使裁切线落在墨迹+阴影之外 */
.word-slot {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: 0.25em 0.32em;
  margin: -0.25em -0.32em;
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

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 72px;
}

/* 四按钮移动端 2×2 网格：flex 换行在中宽平板会挤成一行四个、手机才 2+2，
   统一为两列网格；容器限宽 360px 防止宽屏下按钮被拉成超宽药丸 */
@media (max-width: 1024px) {
  .hero-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    width: min(100%, 360px);
    margin-top: 56px;
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
  background: var(--color-primary);
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
    /* 网格单元格内拉伸填满，去掉固定宽度 */
    width: auto;
    padding: 10px 12px;
  }
}

/* ≤1024px（导航栏中间链接收起、只剩两端内容时）：标题改纵向堆叠布局。
   字号不再跟随桌面 vw 公式（其在窄屏跌到 18px 下限导致整体过小），
   改用独立 px 基准放大；卡堆/词组等 em 偏移随新字号等比缩放，观感与桌面一致 */
@media (max-width: 1024px) {
  /* 堆叠后标题整体变高，桌面 -6vh 上移会把首行顶进固定导航栏（2026-09-22 修复）：
     改为首屏顶部留出导航栏净空（64px 栏高 + 20px 呼吸），内容在净空以下居中；
     safe center 保证矮视口放不下时退化为顶部对齐——起点仍在导航栏之下，
     首行任何情况下不被遮挡（不支持 safe 的旧浏览器回退 center，真实手机同样安全） */
  .hero-section {
    align-items: safe center;
    padding-top: 84px;
  }

  .hero-content {
    padding: 0 20px;
    transform: none;
  }

  .hero-heading {
    font-size: clamp(30px, 10vw, 56px);
  }

  /* 第一行拆两行：在 > [科协] 独占一行，药丸卡堆换行后整行居中 */
  .hero-line-meta {
    flex-wrap: wrap;
    row-gap: 0.45em;
  }

  .dept-deck {
    flex-basis: 100%;
    margin-left: 0;
    /* 容器被拉满整行宽后，网格 track 需居中，否则顶卡药丸贴左 */
    justify-content: center;
  }

  /* 第二行拆两行：一起独占一行，词组按剩余宽度换行（窄屏两词 + 一词） */
  .hero-line-main {
    flex-wrap: wrap;
    row-gap: 0.35em;
  }

  .main-lead {
    flex-basis: 100%;
  }
}
</style>
