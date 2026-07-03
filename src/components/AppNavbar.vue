<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDevice } from '@/composables/useDevice'
import { useScrollStore } from '@/stores/scroll'

const router = useRouter()
const scrollStore = useScrollStore()
const route = useRoute()
const { isMobile } = useDevice()

// 导航菜单项类型定义
interface NavSubChild {
  label: string
  href: string
}

interface NavChild {
  label: string
  href: string
  children?: NavSubChild[]
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
    children: [
      { label: '部门介绍', href: '#departments' },
      { label: '学习方向', href: '#learning' },
      { label: '加入我们', href: '#recruitment' },
    ],
  },
  {
    id: 'departments',
    label: '部门',
    href: '#departments',
    children: [
      {
        label: '多媒体部门',
        href: '#departments',
        children: [
          { label: '前端开发', href: '/direction/web' },
          { label: '后端开发', href: '/direction/backend' },
          { label: 'UI设计', href: '/direction/ui' },
          { label: '视频剪辑', href: '/direction/video' },
          { label: '编辑', href: '/direction/editing' },
        ],
      },
      {
        label: '软件部门',
        href: '#departments',
        children: [
          { label: '深度学习', href: '/direction/machinelearning' },
          { label: 'APP开发', href: '/direction/android' },
          { label: '游戏开发', href: '/direction/game' },
        ],
      },
      {
        label: '硬件部门',
        href: '#departments',
        children: [{ label: '硬件开发', href: '/direction/embedded' }],
      },
      {
        label: '安全部门',
        href: '#departments',
        children: [
          { label: '逆向工程', href: '/direction/reverse' },
          { label: 'Web 安全', href: '/direction/websecurity' },
          { label: 'Pwn', href: '/direction/pwn' },
          { label: '密码学', href: '/direction/crypto' },
        ],
      },
    ],
  },
  {
    id: 'learning',
    label: '学习',
    href: '#learning',
    children: [
      { label: '练习编程', href: 'https://oj.kexie.space' },
      { label: '知识库', href: 'https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb' },
    ],
  },
  {
    id: 'recruitment',
    label: '招新',
    href: '#recruitment',
    children: [
      { label: 'QQ 群', href: 'https://api.kexie.space/recruitment-qq-group' },
      { label: 'QQ 频道', href: 'https://pd.qq.com/s/5pxzsijx0' },
    ],
  },
  {
    id: 'more',
    label: '更多',
    href: '#',
    children: [
      { label: '近年获奖情况', href: '/awards' },
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
  <nav class="navbar" :class="{ 'is-mobile': isMobile }">
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
          <div v-if="item.children && activeDropdown === item.id" class="dropdown-menu">
            <div
              v-for="(child, index) in item.children"
              :key="index"
              class="dropdown-item"
              :class="{ 'has-children': child.children }"
            >
              <a
                :href="child.href"
                class="dropdown-link"
                @click.prevent="handleNavigation(child.href)"
              >
                {{ child.label }}
                <svg
                  v-if="child.children"
                  class="dropdown-arrow-right"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>

              <!-- 二级下拉菜单 -->
              <div v-if="child.children" class="subdropdown-menu">
                <a
                  v-for="(subChild, subIndex) in child.children"
                  :key="subIndex"
                  :href="subChild.href"
                  class="subdropdown-link"
                  @click.prevent="handleNavigation(subChild.href)"
                >
                  {{ subChild.label }}
                </a>
              </div>
            </div>
          </div>
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
          <div v-for="(child, index) in item.children" :key="index" class="mobile-submenu-group">
            <a
              :href="child.href"
              class="mobile-submenu-title mobile-submenu-title-link"
              @click.prevent="handleNavigation(child.href)"
            >
              {{ child.label }}
            </a>
            <div v-if="child.children" class="mobile-submenu-items">
              <a
                v-for="(subChild, subIndex) in child.children"
                :key="subIndex"
                :href="subChild.href"
                class="mobile-submenu-link"
                @click.prevent="handleNavigation(subChild.href)"
              >
                {{ subChild.label }}
              </a>
            </div>
          </div>
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
.navbar {
  width: 100%;
  padding: 16px 24px;
  background: var(--color-black);
  position: relative;
  z-index: 10;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 4px 12px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navbar-logo:hover {
  background: var(--color-blue);
  color: var(--color-black);
}

.navbar-logo:hover .navbar-logo-text {
  color: var(--color-black);
}

.navbar-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-blue);
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
  gap: 4px;
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navbar-link:hover {
  background: var(--color-blue);
  color: var(--color-black);
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: var(--color-black);
  border: 1px solid var(--color-blue);
  padding: 8px;
  margin-top: 0;
}

.dropdown-item {
  position: relative;
}

.dropdown-item.has-children:hover .subdropdown-menu {
  display: block;
}

.dropdown-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 14px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.dropdown-link:hover {
  background: var(--color-blue);
  color: var(--color-black);
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
  background: var(--color-black);
  border: 1px solid var(--color-cyan);
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
  background: var(--color-blue);
  color: var(--color-black);
}

/* 操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--color-blue);
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
  background: var(--color-black);
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

/* 移动端菜单按钮 */
.navbar-menu-btn {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--color-cyan);
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
  background: var(--color-blue);
  color: var(--color-black);
}

.navbar-menu-btn svg {
  width: 100%;
  height: 100%;
}

/* 移动端菜单 */
.navbar-mobile-menu {
  display: none;
  background: var(--color-black);
  border-top: 1px solid var(--color-cyan);
  padding: 16px 24px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  flex-direction: column;
  gap: 4px;
  max-height: calc(100vh - 80px);
  max-height: calc(100dvh - 80px);
  overflow-y: auto;
}

.is-mobile .navbar-mobile-menu {
  display: flex;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--color-blue);
  padding: 8px 0;
}

.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-nav-link:hover {
  background: var(--color-blue);
  color: var(--color-black);
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
  color: var(--color-blue);
  font-size: 14px;
  font-weight: 600;
}

.mobile-submenu-title-link {
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.mobile-submenu-title-link:hover {
  background: var(--color-blue);
  color: var(--color-black);
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
  background: var(--color-blue);
  color: var(--color-black);
}

.navbar-mobile-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  background: var(--color-blue);
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
  background: var(--color-black);
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
  .navbar {
    padding: 12px 16px;
  }

  .navbar-logo-text {
    font-size: 16px;
  }

  .navbar-links {
    display: none;
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
