<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import HeroSection from './components/HeroSection.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import RecruitmentSection from './components/RecruitmentSection.vue'

const AsciiBackground = defineAsyncComponent(() => import('./components/AsciiBackground.vue'))
const TracerBullet = defineAsyncComponent(() => import('./components/TracerBullet.vue'))

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <div class="app-container">
    <AsciiBackground :active="isHomePage" />
    <TracerBullet :active="true" />
    <AppNavbar />
    <main v-if="isHomePage" class="main-content">
      <section id="home">
        <HeroSection />
      </section>
      <section id="departments">
        <DepartmentsSection />
      </section>
      <section id="learning">
        <LearningDirectionsSection />
      </section>
      <section id="recruitment">
        <RecruitmentSection />
      </section>
    </main>
    <router-view v-else />
    <AppFooter />
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #04080c;
}

.main-content {
  position: relative;
  z-index: 10;
}

section {
  scroll-margin-top: 80px;
}
</style>
