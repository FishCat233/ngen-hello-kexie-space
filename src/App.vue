<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import AsciiBackground from './components/AsciiBackground.vue'
import TracerBullet from './components/TracerBullet.vue'
</script>

<template>
  <div class="app-container">
    <AsciiBackground />
    <TracerBullet />
    <main class="main-content">
      <HeroSection />
      <DepartmentsSection />
      <LearningDirectionsSection />
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
</style>
