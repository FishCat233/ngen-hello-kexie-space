<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import RecruitmentSection from './components/RecruitmentSection.vue'
import AsciiBackground from './components/AsciiBackground.vue'
import TracerBullet from './components/TracerBullet.vue'
</script>

<template>
  <div class="app-container">
    <AsciiBackground />
    <TracerBullet />
    <AppNavbar />
    <main class="main-content">
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
