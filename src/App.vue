<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollStore } from './stores/scroll'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import RouteProgress from './components/RouteProgress.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import RecruitmentSection from './components/RecruitmentSection.vue'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const scrollStore = useScrollStore()

// 标记已访问首页（scrollBehavior 依赖此标记）
watch(isHomePage, (val) => {
  if (val) {
    scrollStore.hasVisitedHome = true
  }
})

// 主页进入 DOM 后恢复滚动位置
function onHomeMounted() {
  nextTick(() => {
    if (scrollStore.savedScrollY > 0) {
      window.scrollTo(0, scrollStore.savedScrollY)
    }
    if (scrollStore.pendingAnchor) {
      const el = document.querySelector(scrollStore.pendingAnchor)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      scrollStore.pendingAnchor = null
    }
  })
}
</script>

<template>
  <div class="app-container">
    <AppNavbar />
    <RouteProgress />
    <main v-if="isHomePage" class="main-content" @vue:mounted="onHomeMounted">
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="learning">
        <LearningDirectionsSection />
      </section>
      <section id="recruitment">
        <RecruitmentSection />
      </section>
    </main>
    <div v-else class="router-wrapper">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: var(--color-bg);
}

/* 首页 hero 从浏览器顶部起铺满整屏（body 不再留白，导航栏浮于其上），
   其余路由页面需为固定导航栏补出顶部空间 */
.router-wrapper {
  padding-top: 72px;
}

@media (max-width: 1024px) {
  .router-wrapper {
    padding-top: 64px;
  }
}

section {
  scroll-margin-top: 72px;
}

@media (max-width: 1024px) {
  section {
    scroll-margin-top: 64px;
  }
}
</style>
