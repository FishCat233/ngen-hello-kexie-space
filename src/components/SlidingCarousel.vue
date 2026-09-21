<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

export interface CarouselSlide {
  /** 图片地址；缺省时渲染占位态（照片待补充） */
  src?: string
  label: string
  /** 占位态配色（6 位 hex），用于无图片时的底色渲染 */
  color?: string
}

const props = withDefaults(
  defineProps<{
    slides: CarouselSlide[]
    /** 自动轮播间隔（ms） */
    interval?: number
  }>(),
  {
    interval: 4500,
  },
)

const currentSlide = ref(0)
let timer: number | null = null

// 车道持久定位：每张幻灯片持有整数车道 lane，transform = (lane - 当前张 lane) * 100%。
// 换向前先把进入侧幻灯片的车道对齐到与当前张相邻（换位前后均在屏外，瞬移不可见），
// 再切换 current——进入张从行进方向一侧滑入、退出张反向滑出、其余张整体平移一个车位。
// 修复最短路径归一化在环绕切换（末张→首张等）时远端幻灯片横穿整个视口的 bug
const lanes = ref<number[]>(props.slides.map((_, i) => i))
// 环绕换位瞬移帧中禁用过渡的幻灯片下标
const snapIndex = ref(-1)
const rootRef = ref<HTMLElement | null>(null)

const slideStyle = (index: number) => {
  const pos = (lanes.value[index] - lanes.value[currentSlide.value]) * 100
  return snapIndex.value === index
    ? { transform: `translateX(${pos}%)`, transition: 'none' }
    : { transform: `translateX(${pos}%)` }
}

const placeholderStyle = (color?: string) => ({
  background: color ? `radial-gradient(120% 100% at 50% 100%, ${color}26, #0d1117 72%)` : '#0d1117',
})

const switchTo = async (target: number, dir: 1 | -1) => {
  const n = props.slides.length
  const next = ((target % n) + n) % n
  if (next === currentSlide.value) return
  const targetLane = lanes.value[currentSlide.value] + dir
  if (lanes.value[next] !== targetLane) {
    snapIndex.value = next
    lanes.value[next] = targetLane
    await nextTick()
    // 读取布局提交瞬移帧（该幻灯片过渡已禁用），随后恢复过渡执行滑动
    void rootRef.value?.offsetWidth
    snapIndex.value = -1
  }
  currentSlide.value = next
}

const advance = (dir: 1 | -1) => {
  void switchTo(currentSlide.value + dir, dir)
}

// 手动切换后重置自动轮播节奏（hover 暂停中则不重启，交给 mouseleave）
const switchBy = (dir: 1 | -1) => {
  advance(dir)
  if (timer) {
    stopTimer()
    startTimer()
  }
}

const goToSlide = (index: number) => {
  if (index === currentSlide.value) return
  const n = props.slides.length
  // 最短环距决定进入方向
  const dist = (((index - currentSlide.value) % n) + n) % n
  void switchTo(index, dist > n / 2 ? -1 : 1)
  if (timer) {
    stopTimer()
    startTimer()
  }
}

const startTimer = () => {
  if (timer || props.slides.length < 2) return
  timer = window.setInterval(() => advance(1), props.interval)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <div ref="rootRef" class="sliding-carousel" @mouseenter="stopTimer" @mouseleave="startTimer">
    <div
      v-for="(slide, index) in slides"
      :key="slide.label"
      class="carousel-slide"
      :style="slideStyle(index)"
    >
      <img
        v-if="slide.src"
        :src="slide.src"
        :alt="slide.label"
        class="slide-img"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="slide-placeholder" :style="placeholderStyle(slide.color)">
        <span class="placeholder-label" :style="slide.color ? { color: slide.color } : undefined">
          {{ slide.label }}
        </span>
        <span class="placeholder-hint">照片待补充</span>
      </div>

      <!-- 底部黑色渐变 + 标注（仅实图幻灯片；随幻灯片一起滑动） -->
      <div v-if="slide.src" class="slide-caption">
        <span class="caption-text">{{ slide.label }}</span>
      </div>
    </div>

    <!-- 左右切换控件：毛玻璃圆形按钮 -->
    <button class="carousel-control carousel-prev" aria-label="上一张" @click="switchBy(-1)">
      <ChevronLeft :size="20" />
    </button>
    <button class="carousel-control carousel-next" aria-label="下一张" @click="switchBy(1)">
      <ChevronRight :size="20" />
    </button>

    <!-- 右下角指示点 -->
    <div class="carousel-dots">
      <button
        v-for="(slide, index) in slides"
        :key="slide.label"
        class="carousel-dot"
        :class="{ active: index === currentSlide }"
        :aria-label="'查看 ' + slide.label"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.sliding-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 滑动切换期间避免露出页面底色 */
  background: #0b0f16;
}

/* 幻灯片层：绝对铺满，按环形归一化位置左右平移 */
.carousel-slide {
  position: absolute;
  inset: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 占位态：部门色渐变底 + 大字标注 */
.slide-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.placeholder-label {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-white);
  line-height: var(--leading-tight);
}

.placeholder-hint {
  font-size: var(--text-ui);
  color: #9ca3af;
}

/* 底部黑色渐变：保证标注文字在任意照片上的可读性（随幻灯片滑动） */
.slide-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  /* 右侧给指示点留位 */
  padding: 44px 64px 14px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
  color: var(--color-white);
  font-size: var(--text-ui);
  font-weight: 500;
}

.caption-text {
  line-height: 1;
}

/* 左右切换控件：毛玻璃圆形按钮（同首屏按钮质感） */
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(10, 14, 20, 0.5);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.carousel-control:hover {
  background: rgba(10, 14, 20, 0.75);
}

.carousel-prev {
  left: 12px;
}

.carousel-next {
  right: 12px;
}

/* 右下角指示点 */
.carousel-dots {
  position: absolute;
  right: 16px;
  bottom: 13px;
  display: flex;
  gap: 6px;
  z-index: 3;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.carousel-dot.active {
  background: var(--color-primary-bright);
}
</style>
