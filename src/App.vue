<script setup lang="ts">
import HeroSection from './components/HeroSection.vue'
import AsciiBackground from './components/AsciiBackground.vue'
</script>

<template>
  <div class="app-container">
    <AsciiBackground />
    <HeroSection />
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #04080c;
}
</style>
