<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollStore } from './stores/scroll'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import StatsStrip from './components/StatsStrip.vue'
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
    <main v-if="isHomePage" class="main-content" @vue:mounted="onHomeMounted">
      <section id="home">
        <HeroSection />
      </section>
      <MarqueeBand />
      <section id="departments">
        <DepartmentsSection />
      </section>
      <StatsStrip />
      <section id="learning">
        <LearningDirectionsSection />
      </section>
      <section id="recruitment">
        <RecruitmentSection />
      </section>
      <MarqueeBand />
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
  background: var(--color-black);
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
