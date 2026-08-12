<script setup lang="ts">
import { KEXIE_FOUNDING_DATE } from '@/data/kexie'

const foundedYear = new Date(KEXIE_FOUNDING_DATE).getFullYear()

const links = [
  { id: 'terminal', label: '练习编程', href: 'https://oj.kexie.space' },
  {
    id: 'knowledge',
    label: '知识库',
    href: 'https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb',
  },
  { id: 'qq-channel', label: 'QQ频道', href: 'https://pd.qq.com/s/5pxzsijx0' },
]
</script>

<template>
  <section class="hero-section">
    <div class="hero-halo" aria-hidden="true">
      <span class="hero-ring"></span>
    </div>

    <div class="hero-content">
      <p class="hero-eyebrow hero-enter hero-enter-1">GUET KEXIE · EST. {{ foundedYear }}</p>

      <h1 class="hero-title">
        <span class="hero-line-1 hero-enter hero-enter-2"
          ><span class="title-accent">#</span> 桂电三院</span
        >
        <span class="hero-line-2 hero-enter hero-enter-3">科协</span>
      </h1>

      <p class="hero-slogan hero-enter hero-enter-4">科技融入梦想，创新点缀人生</p>

      <div class="hero-cta hero-enter hero-enter-5">
        <a href="https://api.kexie.space/recruitment-qq-group" class="hero-cta-primary"
          ><span>加入我们</span></a
        >
        <a v-for="link in links" :key="link.id" :href="link.href" class="hero-cta-link">
          {{ link.label }}<span class="hero-cta-arrow">›</span>
        </a>
      </div>
    </div>

    <div class="hero-scroll" aria-hidden="true">↓</div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-black);
}

/* 圣环与神光：明暗对照 */
.hero-halo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 86vw;
  height: 86vw;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.hero-halo::before {
  content: '';
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(92, 184, 217, 0.12) 0%, rgba(92, 184, 217, 0) 62%);
}

.hero-ring {
  position: absolute;
  inset: 0;
  border: 1px solid #1b2a38;
  border-radius: 50%;
  animation: ring-reveal 1.4s ease-out both;
}

@keyframes ring-reveal {
  from {
    opacity: 0;
    transform: scale(1.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 金字塔构图：小字在上，大字居中，标语按钮在下 */
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 26px;
  padding: 56px 24px;
}

@keyframes hero-rise {
  0% {
    opacity: 0;
    transform: translateY(34px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hero-enter {
  animation: hero-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-enter-1 {
  animation-delay: 0.1s;
}

.hero-enter-2 {
  animation-delay: 0.24s;
}

.hero-enter-3 {
  animation-delay: 0.4s;
  animation-duration: 1.1s;
}

.hero-enter-4 {
  animation-delay: 0.72s;
  animation-duration: 1s;
}

.hero-enter-5 {
  animation-delay: 0.9s;
  animation-duration: 1s;
}

.hero-eyebrow {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.32em;
  padding-left: 0.32em;
  color: var(--color-cyan);
  margin: 0;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  line-height: 1.04;
}

.hero-line-1 {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 0.42em;
  padding-left: 0.42em;
  color: var(--color-white);
}

.title-accent {
  color: var(--color-blue);
}

/* 唯一主角：宽度 = 画面黄金分割 */
.hero-line-2 {
  font-size: min(28vw, 46vh);
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--color-blue);
  text-shadow: 0 0 80px rgba(92, 184, 217, 0.35);
}

.hero-slogan {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 400;
  color: #b4c2ce;
  letter-spacing: 0.16em;
  padding-left: 0.16em;
  margin: 0;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 26px;
  margin-top: 10px;
}

.hero-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: var(--color-blue);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
}

.hero-cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-white);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.hero-cta-primary:hover::before {
  transform: translateX(0);
}

.hero-cta-primary:hover {
  color: var(--color-black);
}

.hero-cta-primary > * {
  position: relative;
  z-index: 1;
}

.hero-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-cyan);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.hero-cta-arrow {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.hero-cta-link:hover {
  color: var(--color-blue);
}

.hero-cta-link:hover .hero-cta-arrow {
  transform: translateX(3px);
}

.hero-scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-muted-dark);
  font-size: 15px;
  z-index: 1;
}

@media (max-width: 1024px) {
  .hero-section {
    min-height: calc(100vh - 64px);
  }

  .hero-content {
    gap: 20px;
  }

  .hero-line-1 {
    font-size: 22px;
    letter-spacing: 0.34em;
    padding-left: 0.34em;
  }

  .hero-line-2 {
    font-size: 34vw;
  }

  .hero-slogan {
    font-size: 16px;
  }

  .hero-cta {
    gap: 20px;
    margin-top: 6px;
  }

  .hero-cta-primary {
    padding: 12px 26px;
    font-size: 14px;
  }

  .hero-cta-link {
    font-size: 14px;
  }

  .hero-scroll {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-enter,
  .hero-ring {
    animation: none;
  }
}
</style>
