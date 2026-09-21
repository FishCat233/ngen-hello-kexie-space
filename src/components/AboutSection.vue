<script setup lang="ts">
import SectionMark from './SectionMark.vue'
import SlidingCarousel from './SlidingCarousel.vue'
import workshopImg from '../assets/images/kexie-workshop.webp'
import labImg from '../assets/images/kexie-lab.webp'
import officeImg from '../assets/images/kexie-office.webp'

const paragraphs = [
  '三院科协是依托于计算机与信息安全学院，面向全校的技术社团。我们的活动包括技术学习，承办和策划各类科技赛事和颁奖仪式，组织创新创业训练等。科协设有软件部、硬件部、多媒体部、组织部、安全部共五个部门，致力于对成员技术能力及创新能力的培养。',
  '在科协，你不仅能提高自身的技术，结交志同道合的伙伴，还能收获前辈的悉心指导，共享优质的资源服务。',
  '科协的大门将为你们敞开，我们期待你们的到来，欢迎与我们一起畅游在技术的海洋！',
]

// 轮播：科协各处实拍，左右滑动切换 + 底部渐变地点标注（SlidingCarousel 承载）
const slides = [
  { src: workshopImg, label: '科协活动室' },
  { src: labImg, label: '科协机房' },
  { src: officeImg, label: '科协办公室' },
]
</script>

<template>
  <section class="about-section">
    <div class="about-container">
      <h2 class="about-title"><SectionMark class="title-mark" /> 关于科协</h2>

      <div class="about-body">
        <div class="about-text">
          <p v-for="(paragraph, index) in paragraphs" :key="index" class="about-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <!-- 右侧：科协实拍轮播（左右滑动，hover 暂停） -->
        <div class="about-photo">
          <SlidingCarousel :slides="slides" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 20px 6vh;
  background: var(--color-bg);
}

.about-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}

.about-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  line-height: 1;
}

.title-mark {
  color: var(--color-primary);
}

.about-body {
  display: flex;
  align-items: stretch;
  gap: 48px;
  width: 100%;
}

.about-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  min-width: 0;
}

.about-paragraph {
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  margin: 0;
  text-align: justify;
}

/* 轮播外框：尺寸与圆角由本组件控制，滑动机制在 SlidingCarousel 内 */
.about-photo {
  position: relative;
  flex-shrink: 0;
  width: 620px;
  min-height: 349px; /* 620 × 16:9 */
  border-radius: var(--radius-lg);
  overflow: hidden;
}

@media (max-width: 1024px) {
  .about-section {
    padding: 4vh 16px 6vh;
  }

  .about-body {
    flex-direction: column-reverse;
    gap: 40px;
  }

  .about-photo {
    width: 100%;
    min-height: 0;
    aspect-ratio: 16 / 9;
  }
}
</style>
