<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import RecruitmentSection from './components/RecruitmentSection.vue'
import AsciiBackground from './components/AsciiBackground.vue'
import TracerBullet from './components/TracerBullet.vue'

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
