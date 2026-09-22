<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDevice } from '@/composables/useDevice'
import { useNavbarScroll } from '@/composables/useNavbarScroll'
import { useScrollStore } from '@/stores/scroll'

const router = useRouter()
const scrollStore = useScrollStore()
const route = useRoute()
const { isMobile } = useDevice()
const { isScrolled } = useNavbarScroll()

// 导航菜单项类型定义
interface NavItem {
  id: string
  label: string
  href: string
}

// 导航菜单配置：原「更多」下拉项全部平铺为一级链接
const navMenu: NavItem[] = [
  {
    id: 'home',
    label: '首页',
    href: '#home',
  },
  { id: 'organization', label: '组织架构', href: '/organization' },
  { id: 'members', label: '成员墙', href: '/members' },
  { id: 'awards', label: '获奖情况', href: '/awards' },
  { id: 'projects', label: '项目活动', href: '/projects' },
  { id: 'gallery', label: '项目展廊', href: '/gallery' },
  { id: 'comments', label: '畅心所言', href: '/comments' },
]

const isMobileMenuOpen = ref(false)

// 导航处理
const handleNavigation = (href: string) => {
  if (href.startsWith('http')) {
    window.open(href, '_blank')
  } else if (href.startsWith('/')) {
    router.push(href)
  } else if (href.startsWith('#')) {
    if (route.path !== '/') {
      scrollStore.pendingAnchor = href
      isMobileMenuOpen.value = false
      router.push('/')
      return
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  isMobileMenuOpen.value = false
}

// 移动菜单打开时锁定 body 滚动
watch(isMobileMenuOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <nav class="navbar" :class="{ 'is-mobile': isMobile, 'is-scrolled': isScrolled }">
    <div class="navbar-glass"></div>
    <div class="navbar-container">
      <!-- Logo -->
      <a href="#home" class="navbar-logo" @click.prevent="handleNavigation('#home')">
        <picture>
          <source srcset="/logo.webp" type="image/webp" />
          <img src="/logo.png" alt="科协LOGO" class="navbar-logo-img" />
        </picture>
        <span class="navbar-logo-text">桂电三院科协</span>
      </a>

      <!-- 桌面端导航链接 -->
      <div v-if="!isMobile" class="navbar-links">
        <div v-for="item in navMenu" :key="item.id" class="navbar-item">
          <a :href="item.href" class="navbar-link" @click.prevent="handleNavigation(item.href)">
            {{ item.label }}
          </a>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <a
          v-if="!isMobile"
          href="https://api.kexie.space/recruitment-qq-group"
          class="navbar-cta"
          @click.prevent="handleNavigation('https://api.kexie.space/recruitment-qq-group')"
          ><span>加入我们</span></a
        >

        <!-- 移动端菜单按钮 -->
        <button
          v-if="isMobile"
          class="navbar-menu-btn"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="切换菜单"
        >
          <svg
            v-if="!isMobileMenuOpen"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <Transition name="mobile-menu">
      <div v-if="isMobile && isMobileMenuOpen" class="navbar-mobile-menu">
        <div v-for="item in navMenu" :key="item.id" class="mobile-nav-item">
          <a :href="item.href" class="mobile-nav-link" @click.prevent="handleNavigation(item.href)">
            {{ item.label }}
          </a>
        </div>
        <a
          href="https://api.kexie.space/recruitment-qq-group"
          class="navbar-mobile-cta"
          @click.prevent="handleNavigation('https://api.kexie.space/recruitment-qq-group')"
          ><span>加入我们</span></a
        >
      </div>
    </Transition>
  </nav>

  <!-- 移动端菜单全屏遮罩：压暗背景，点击空白处关闭。
       必须作为 <nav> 的兄弟节点渲染——nav 带 transform，fixed 后代会以它为包含块；
       z-index 99 压住页面内容、低于 nav(100)，X 按钮与菜单仍可点击 -->
  <Transition name="menu-overlay">
    <div
      v-if="isMobile && isMobileMenuOpen"
      class="navbar-overlay"
      @click="isMobileMenuOpen = false"
    ></div>
  </Transition>
</template>

<style scoped>
/* 导航栏两态：
   初始 —— 吸附顶部、通栏长方形
   下滑 —— 脱离顶部、收窄居中、药丸形态
   玻璃（背景 + 高斯模糊 + 边框）由兄弟层 .navbar-glass 单独承载，
   使下拉菜单（.navbar-container 的后代）不受祖先 backdrop-filter 的
   backdrop root 限制，模糊能正常作用于页面内容 */
.navbar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  box-sizing: border-box;
  padding: 16px 24px;
  z-index: 100;
  transition:
    width 0.4s ease,
    top 0.4s ease,
    padding 0.4s ease;
}

.navbar-glass {
  position: absolute;
  inset: 0;
  background: rgba(10, 14, 20, 0.72);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid transparent;
  border-bottom-color: var(--color-line);
  border-radius: 0;
  transition:
    border-radius 0.4s ease,
    border-color 0.4s ease,
    background-color 0.4s ease;
}

.navbar.is-scrolled {
  top: 16px;
  width: min(calc(100% - 32px), 1080px);
  padding: 10px;
}

.navbar.is-scrolled .navbar-glass {
  border-radius: var(--radius-pill);
  border-color: var(--color-line);
  background: rgba(10, 14, 20, 0.66);
}

/* 内容层浮于玻璃之上 */
.navbar-container {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

/* Logo */
.navbar-logo {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.navbar-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.navbar-logo-text {
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--color-white);
}

/* 导航链接：7 个一级链接平铺，紧凑间距保证 1080px 药丸内不溢出 */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  color: var(--color-white);
  text-decoration: none;
  font-size: var(--text-ui);
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navbar-link:hover {
  background: var(--color-primary);
}

/* 操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-self: end;
}

.navbar-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 32px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-ui);
  font-weight: 600;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.navbar-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #2563eb; /* hover 色块比底色更深 */
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.navbar-cta:hover::before {
  transform: translateX(0);
}

.navbar-cta > * {
  position: relative;
  z-index: 1;
}

/* hover：箭头作为流内元素参与布局，与文字共同居中 */
.navbar-cta::after {
  content: '→';
  order: -1;
  position: relative;
  z-index: 1;
  width: 0;
  margin-left: -8px;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transition:
    width 0.3s ease,
    margin-left 0.3s ease,
    opacity 0.25s ease;
}

.navbar-cta:hover::after {
  width: 1em;
  margin-left: 0;
  opacity: 1;
}

/* 移动端菜单按钮 */
.navbar-menu-btn {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  color: var(--color-white);
  cursor: pointer;
  display: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.is-mobile .navbar-menu-btn {
  display: block;
}

.navbar-menu-btn:hover {
  background: var(--color-primary);
}

.navbar-menu-btn svg {
  width: 100%;
  height: 100%;
}

/* 移动端菜单：悬浮玻璃面板（2026-09-22 调优）
   - 宽度恒等于药丸态导航栏 min(100vw - 32px, 1080px)：通栏状态（页面顶部）打开时
     菜单不再全宽，两侧各留 16px；药丸状态打开时与导航栏严格同宽
   - 圆角 32px：取导航栏药丸态的「有效圆角」（999px 被半高钳制后的视觉值），
     与加入我们 CTA 视觉协调；不用字面 --radius-pill——多行面板会变体育场形，
     首尾条目会被圆角曲线裁切
   - 磨砂玻璃：半透明底 + 高斯模糊 + 提亮，与导航栏玻璃同族
   - 展开动画（2026-09-22 三修）：纯「底边推进」生长——仅 clip-path 揭示，
     无位移、无渐隐渐现；easeOutQuint 曲线（起步快、收尾绵长丝滑、无过冲），
     出场反向收起 */
.navbar-mobile-menu {
  display: none;
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  /* 宽度恒等于药丸态导航栏（与通栏/当前形态无关）：100vw 锚定视口而非包含块——
     100% 会随 navbar 当前宽度漂移（通栏=视口、药丸=收窄后），导致两态宽度不一致；
     居中用 left/right: 0 + width + margin auto（over-constrained 吸收余量），
     不用 left: 50% + translateX(-50%)——会与展开动画的 transform 关键帧冲突 */
  width: min(calc(100vw - 32px), 1080px);
  margin: 0 auto;
  z-index: 2;
  background: rgba(10, 14, 20, 0.6);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 32px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  padding: 12px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  flex-direction: column;
  gap: 2px;
  max-height: calc(100vh - 120px);
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
  transform-origin: top center;
  /* 终态必须显式 inset(0)：clip-path 的默认值 none 与形状之间不做连续插值
     （离散跳变，动画中段会瞬间切换），两个 inset() 之间才能平滑推进底边 */
  clip-path: inset(0);
}

.mobile-menu-enter-active {
  /* 展开动画 = 面板从导航栏下缘向下生长（底边推进）：clip-path 自顶部收拢，
     逐渐揭示至最终高度——面板尺寸每帧真实（等价 grid 0fr→1fr 的揭示效果，
     但 absolute 面板高度无法插值，clip 是唯一可行等价物）；
     内容随底边推进同步下移淡入，与揭示节奏呼应 */
  transition:
    clip-path 0.32s cubic-bezier(0.34, 1.2, 0.5, 1),
    opacity 0.25s ease;
}

.mobile-menu-leave-active {
  transition:
    clip-path 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-6px);
  /* 从顶边几乎全裁 → 仅露出细缝贴在导航栏下缘 */
  clip-path: inset(0 0 100% 0);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  clip-path: inset(0 0 100% 0);
}

/* 全屏遮罩：压暗页面背景（2026-09-22）。
   作为 nav 兄弟节点 fixed 渲染（nav 的 transform 会劫持内部 fixed 的包含块）；
   z-index 99 盖住全部页面内容、低于 nav(100)——菜单、X 按钮、Logo 保持可点 */
.navbar-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

.is-mobile .navbar-mobile-menu {
  display: flex;
}

/* 分割线已移除（2026-09-22 用户指令），条目间距同步收紧 */
.mobile-nav-item {
  padding: 0;
}

.mobile-nav-link {
  display: block;
  padding: 10px 18px;
  /* 药丸行：hover 填充为整行药丸，与 CTA/导航栏同语言 */
  border-radius: var(--radius-pill);
  color: var(--color-white);
  text-decoration: none;
  font-size: var(--text-body-lg);
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-nav-link:hover {
  background: var(--color-primary);
}

.navbar-mobile-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-body);
  font-weight: 600;
  text-decoration: none;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.navbar-mobile-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #2563eb; /* hover 色块比底色更深 */
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.navbar-mobile-cta:hover::before {
  transform: translateX(0);
}

.navbar-mobile-cta > * {
  position: relative;
  z-index: 1;
}

/* hover：箭头作为流内元素参与布局，与文字共同居中 */
.navbar-mobile-cta::after {
  content: '→';
  order: -1;
  position: relative;
  z-index: 1;
  width: 0;
  margin-left: -8px;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transition:
    width 0.3s ease,
    margin-left 0.3s ease,
    opacity 0.25s ease;
}

.navbar-mobile-cta:hover::after {
  width: 1em;
  margin-left: 0;
  opacity: 1;
}

/* 响应式 */
.is-mobile .navbar {
  padding: 12px 16px;
}

.is-mobile .navbar-links {
  display: none;
}

.is-mobile .navbar-cta {
  display: none;
}

@media (max-width: 1024px) {
  .navbar-container {
    display: flex;
    justify-content: space-between;
  }

  .navbar {
    padding: 12px 16px;
  }

  .navbar-links {
    display: none;
  }

  .navbar-actions {
    justify-self: auto;
  }

  .navbar-cta {
    display: none;
  }

  .navbar-menu-btn {
    display: block;
  }

  .navbar-mobile-menu {
    display: flex;
  }
}
</style>
