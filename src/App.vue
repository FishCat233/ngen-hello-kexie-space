<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import HeroSection from './components/HeroSection.vue'
import DepartmentsSection from './components/DepartmentsSection.vue'
import LearningDirectionsSection from './components/LearningDirectionsSection.vue'
import RecruitmentSection from './components/RecruitmentSection.vue'
import ScrollFadeIn from './components/transitions/ScrollFadeIn.vue'

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
    <Transition name="home" mode="out-in">
      <main v-if="isHomePage" key="home" class="main-content">
        <section id="home">
          <HeroSection />
        </section>
        <section id="departments">
          <ScrollFadeIn :duration="400" :distance="20">
            <DepartmentsSection />
          </ScrollFadeIn>
        </section>
        <section id="learning">
          <ScrollFadeIn :duration="400" :distance="20">
            <LearningDirectionsSection />
          </ScrollFadeIn>
        </section>
        <section id="recruitment">
          <ScrollFadeIn :duration="400" :distance="20">
            <RecruitmentSection />
          </ScrollFadeIn>
        </section>
      </main>
      <div v-else key="router" class="router-wrapper">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </Transition>
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

.router-wrapper {
  position: relative;
  z-index: 10;
}

section {
  scroll-margin-top: 80px;
}

/* Home page transition animations */
.home-enter-active,
.home-leave-active {
  transition:
    opacity 190ms ease-out,
    transform 190ms ease-out;
}

.home-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.home-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.home-enter-to,
.home-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .home-enter-active,
  .home-leave-active,
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }

  .home-enter-from,
  .home-leave-to,
  .page-enter-from,
  .page-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
