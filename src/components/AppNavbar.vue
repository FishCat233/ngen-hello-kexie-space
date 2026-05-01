<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 导航项配置
const navItems = [
  { id: 'home', label: '首页', href: '#home' },
  { id: 'departments', label: '部门', href: '#departments' },
  { id: 'learning', label: '学习', href: '#learning' },
  { id: 'recruitment', label: '招新', href: '#recruitment' },
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// 监听滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 平滑滚动到指定区域
const scrollToSection = (href: string) => {
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <a href="#home" class="navbar-logo" @click.prevent="scrollToSection('#home')">
        <img src="/logo.png" alt="科协LOGO" class="navbar-logo-img" />
        <span class="navbar-logo-text">桂电三院科协</span>
      </a>

      <!-- 桌面端导航链接 -->
      <div class="navbar-links">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="navbar-link"
          @click.prevent="scrollToSection(item.href)"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <a href="#" class="navbar-cta">加入我们</a>

        <!-- 移动端菜单按钮 -->
        <button
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
    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="navbar-mobile-menu">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="navbar-mobile-link"
          @click.prevent="scrollToSection(item.href)"
        >
          {{ item.label }}
        </a>
        <a href="#" class="navbar-mobile-cta">加入我们</a>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 24px;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar-scrolled {
  background: rgba(4, 8, 12, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(130, 212, 242, 0.1);
  padding: 12px 24px;
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
  transition: opacity 0.3s ease;
}

.navbar-logo:hover {
  opacity: 0.8;
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
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航链接 */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-link {
  padding: 8px 16px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-blue), var(--color-cyan));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navbar-link:hover {
  color: var(--color-blue);
}

.navbar-link:hover::after {
  width: 60%;
}

/* 操作区 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-cta {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(130, 212, 242, 0.4);
}

/* 移动端菜单按钮 */
.navbar-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 8px;
  color: var(--color-white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.navbar-menu-btn:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
}

.navbar-menu-btn svg {
  width: 100%;
  height: 100%;
}

/* 移动端菜单 */
.navbar-mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(4, 8, 12, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(130, 212, 242, 0.1);
  padding: 16px 24px;
  flex-direction: column;
  gap: 8px;
}

.navbar-mobile-link {
  padding: 12px 16px;
  color: var(--color-white);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar-mobile-link:hover {
  background: rgba(130, 212, 242, 0.1);
  color: var(--color-blue);
}

.navbar-mobile-cta {
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  color: var(--color-black);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  margin-top: 8px;
  transition: all 0.3s ease;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
  }

  .navbar-scrolled {
    padding: 10px 16px;
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

@media (max-width: 1024px) {
  .navbar-link {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>
