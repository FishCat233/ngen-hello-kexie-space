<script setup lang="ts">
const items = ['科技融入梦想', '创新点缀人生', '桂电三院科协']

const strip = [...items, ...items, ...items, ...items]
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <span v-for="(item, index) in strip" :key="index" class="marquee-item">
        {{ item }}<span class="marquee-sep">///</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  width: 100%;
  background: var(--color-blue);
  padding: 15px 0;
  overflow: hidden;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 30s linear infinite;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  color: var(--color-white);
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3em;
  white-space: nowrap;
  padding-right: 24px;
}

.marquee-sep {
  padding-left: 24px;
  color: var(--color-white);
}

@keyframes marquee-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>
