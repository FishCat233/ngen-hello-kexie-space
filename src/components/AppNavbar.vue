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
interface NavChild {
  label: string
  href: string
}

interface NavItem {
  id: string
  label: string
  href: string
  children?: NavChild[]
}

// 导航菜单配置
const navMenu: NavItem[] = [
  {
    id: 'home',
    label: '首页',
    href: '#home',
  },
  {
    id: 'more',
    label: '更多',
    href: '#',
    children: [
      { label: '组织架构', href: '/organization' },
      { label: '成员墙', href: '/members' },
      { label: '获奖情况', href: '/awards' },
      { label: '项目活动', href: '/projects' },
      { label: '项目展廊', href: '/gallery' },
      { label: '畅心所言', href: '/comments' },
    ],
  },
]

const isMobileMenuOpen = ref(false)
const activeDropdown = ref<string | null>(null)

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
      activeDropdown.value = null
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
  activeDropdown.value = null
}

// 显示下拉菜单
const showDropdown = (id: string) => {
  activeDropdown.value = id
}

// 隐藏下拉菜单
const hideDropdown = () => {
  activeDropdown.value = null
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
        <div
          v-for="item in navMenu"
          :key="item.id"
          class="navbar-item"
          @mouseenter="item.children && showDropdown(item.id)"
          @mouseleave="hideDropdown"
        >
          <a
            :href="item.href"
            class="navbar-link"
            :class="{ 'has-dropdown': item.children }"
            @click.prevent="handleNavigation(item.href)"
          >
            {{ item.label }}
            <svg
              v-if="item.children"
              class="dropdown-arrow"
              :class="{ 'is-open': activeDropdown === item.id }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>

          <!-- 一级下拉菜单 -->
          <Transition name="dropdown">
            <div v-if="item.children && activeDropdown === item.id" class="dropdown-menu">
              <div class="dropdown-inner">
                <a
                  v-for="(child, index) in item.children"
                  :key="index"
                  :href="child.href"
                  class="dropdown-link"
                  @click.prevent="handleNavigation(child.href)"
                >
                  {{ child.label }}
                </a>
              </div>
            </div>
          </Transition>
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
    <div v-if="isMobile && isMobileMenuOpen" class="navbar-mobile-menu">
      <div v-for="item in navMenu" :key="item.id" class="mobile-nav-item">
        <a :href="item.href" class="mobile-nav-link" @click.prevent="handleNavigation(item.href)">
          {{ item.label }}
        </a>

        <!-- 移动端子菜单 -->
        <div v-if="item.children" class="mobile-submenu">
          <a
            v-for="(child, index) in item.children"
            :key="index"
            :href="child.href"
            class="mobile-submenu-title mobile-submenu-title-link"
            @click.prevent="handleNavigation(child.href)"
          >
            {{ child.label }}
          </a>
        </div>
      </div>
      <a
        href="https://api.kexie.space/recruitment-qq-group"
        class="navbar-mobile-cta"
        @click.prevent="handleNavigation('https://api.kexie.space/recruitment-qq-group')"
        ><span>加入我们</span></a
      >
    </div>
  </nav>
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
  box-shadow: 0 0 0 0 transparent;
  transition:
    border-radius 0.4s ease,
    border-color 0.4s ease,
    background-color 0.4s ease,
    box-shadow 0.4s ease;
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
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
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
  font-size: 18px;
  font-weight: 600;
  color: var(--color-white);
}

/* 导航链接 */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 15px;
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

.dropdown-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

/* 下拉菜单：
   完全落在导航栏之下（top 偏移清出底部边框区），同时用 ::before
   造一段不可见的 hover 桥，消除「移开触发器 → 菜单间真空区」导致的消失。
   采用 grid-template-rows 0fr→1fr 驱动"自上而下展开"动画（内层 overflow:hidden
   裁剪，内容不拉伸），背景/圆角/阴影生长在 .dropdown-menu 上 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 16px);
  left: 0;
  min-width: 180px;
  display: grid;
  grid-template-rows: 1fr;
  background: rgba(10, 14, 20, 0.72);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

/* 内容层裁剪，保证展开时高度从 0 平滑增长 */
.dropdown-inner {
  overflow: hidden;
  min-height: 0;
  padding: 8px;
}

/* 自上而下展开过渡 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    grid-template-rows 0.35s ease,
    opacity 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  grid-template-rows: 1fr;
  opacity: 1;
}

/* hover 桥：覆盖导航项与下拉菜单之间的空隙 */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -16px;
  left: -8px;
  right: -8px;
  height: 16px;
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--color-white);
  text-decoration: none;
  font-size: 14px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.dropdown-link:hover {
  background: var(--color-primary);
}

.dropdown-arrow-right {
  width: 14px;
  height: 14px;
  margin-left: 8px;
}

/* 二级下拉菜单 */
.subdropdown-menu {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  min-width: 140px;
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  padding: 8px;
  margin-left: 0;
}

.subdropdown-link {
  display: block;
  padding: 8px 14px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 13px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.subdropdown-link:hover {
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
  font-size: 14px;
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
  background: var(--color-primary-bright);
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
  border: 1px solid var(--color-primary);
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

/* 移动端菜单：悬浮玻璃面板 */
.navbar-mobile-menu {
  display: none;
  position: absolute;
  top: calc(100% + 12px);
  left: 8px;
  right: 8px;
  z-index: 2;
  background: rgba(10, 14, 20, 0.72);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  padding: 16px 20px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);
  flex-direction: column;
  gap: 4px;
  max-height: calc(100vh - 120px);
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
}

.is-mobile .navbar-mobile-menu {
  display: flex;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--color-primary);
  padding: 8px 0;
}

.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--color-white);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-nav-link:hover {
  background: var(--color-primary);
}

.mobile-submenu {
  padding-left: 16px;
  margin-top: 8px;
}

.mobile-submenu-group {
  margin-bottom: 8px;
}

.mobile-submenu-title {
  display: block;
  padding: 8px 12px;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 600;
}

.mobile-submenu-title-link {
  display: block;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-submenu-title-link:hover {
  background: var(--color-primary);
}

.mobile-submenu-items {
  padding-left: 12px;
}

.mobile-submenu-link {
  display: block;
  padding: 6px 12px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 13px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-submenu-link:hover {
  background: var(--color-primary);
}

.navbar-mobile-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 16px;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

.navbar-mobile-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-primary-bright);
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

.is-mobile .navbar-logo-text {
  font-size: 16px;
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

  .navbar-logo-text {
    font-size: 16px;
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
