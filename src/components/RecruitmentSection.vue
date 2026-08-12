<script setup lang="ts">
interface TimelineItem {
  id: string
  title: string
  description: string
}

const timelineItems: TimelineItem[] = [
  { id: 'register', title: '报名阶段', description: '报名时间截止到笔试前' },
  {
    id: 'learning',
    title: '入门学习',
    description: '学会使用 Online Judge 实现问题求解',
  },
  { id: 'presentation', title: '招新宣讲', description: '三院科协招新宣讲会' },
  { id: 'exam', title: '笔试和面试', description: '期待脱颖而出的你！' },
  { id: 'competition', title: '绘蓝杯科技竞赛', description: '绽放你们的光芒！' },
]

const introParagraphs = [
  '三院科协是依托于计算机与信息安全学院，面向全校的技术社团。我们的活动包括技术学习，承办和策划各类科技赛事和颁奖仪式，组织创新创业训练等。科协设有软件部、硬件部、多媒体部、组织部、安全部共五个部门，致力于对成员技术能力及创新能力的培养。',
  '在科协，你不仅能提高自身的技术，结交志同道合的伙伴，还能收获前辈的悉心指导，共享优质的资源服务。',
  '科协的大门将为你们敞开，我们期待你们的到来，欢迎与我们一起畅游在技术的海洋！',
]
</script>

<template>
  <section class="recruitment-section">
    <div class="ghost-char" v-parallax="0.05" aria-hidden="true">入</div>
    <div class="recruitment-container">
      <header class="recruitment-header" v-reveal>
        <p class="section-eyebrow">RECRUITMENT</p>
        <h2 class="recruitment-title"><span class="title-accent">#</span> 加入我们</h2>
        <p class="section-note">从报名到竞赛，五步走进科协</p>
      </header>

      <div class="recruitment-content">
        <!-- 左侧：时间线 -->
        <div class="timeline-wrapper" v-reveal>
          <h3 class="timeline-section-title">招新时间线</h3>
          <div class="timeline">
            <div
              v-for="(item, index) in timelineItems"
              :key="item.id"
              class="timeline-item"
              v-reveal
              :style="{ '--reveal-delay': `${index * 70}ms` }"
            >
              <div class="timeline-marker">
                <div class="timeline-num">{{ String(index + 1).padStart(2, '0') }}</div>
                <div v-if="index < timelineItems.length - 1" class="timeline-line"></div>
              </div>
              <div class="timeline-content">
                <h3 class="timeline-title">{{ item.title }}</h3>
                <p class="timeline-description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：科协介绍 -->
        <div class="intro-wrapper" v-reveal :style="{ '--reveal-delay': '140ms' }">
          <div class="intro-card">
            <p class="intro-paragraph intro-paragraph-lead">{{ introParagraphs[0] }}</p>
            <p
              v-for="(paragraph, index) in introParagraphs.slice(1)"
              :key="index"
              class="intro-paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.recruitment-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12vh 24px;
  background: var(--color-gray);
  overflow: hidden;
}

/* 淡墨汉字 - 背景纹理 */
.ghost-char {
  position: absolute;
  right: -2vw;
  top: 50%;
  transform: translateY(calc(-50% + var(--parallax-y, 0px)));
  font-family: var(--heading);
  font-weight: 800;
  font-size: 60vh;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px #d9d5cb;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  will-change: transform;
}

.recruitment-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.recruitment-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.section-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.4em;
  color: var(--color-muted);
  margin: 0;
  text-transform: uppercase;
}

.recruitment-title {
  font-family: var(--heading);
  font-size: 56px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.title-accent {
  color: var(--color-blue);
}

.section-note {
  font-family: var(--sans);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-muted);
  margin: 0;
  letter-spacing: 0.04em;
}

/* 黄金分割：38.2% : 61.8% */
.recruitment-content {
  display: grid;
  grid-template-columns: 38.2fr 61.8fr;
  gap: 60px;
  width: 100%;
  align-items: start;
}

/* 时间线样式 */
.timeline-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  padding: 14px 0;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 36px;
}

.timeline-num {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-blue);
  line-height: 1;
  padding-top: 5px;
}

.timeline-line {
  width: 1px;
  flex: 1;
  min-height: 40px;
  background: var(--color-hairline);
  margin-top: 14px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.timeline-description {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0;
  line-height: 1.6;
}

/* 科协介绍样式 */
.intro-wrapper {
  display: flex;
  align-items: stretch;
}

.intro-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 36px;
  background: var(--color-blue);
}

.intro-paragraph {
  font-size: 15px;
  line-height: 1.9;
  color: var(--color-white);
  margin: 0;
  text-align: justify;
}

.intro-paragraph-lead {
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  line-height: 2;
}

/* 响应式处理 */
@media (max-width: 1024px) {
  .recruitment-section {
    padding: 10vh 16px;
  }

  .recruitment-container {
    gap: 40px;
  }

  .recruitment-title {
    font-size: 32px;
  }

  .recruitment-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .timeline-section-title {
    font-size: 18px;
  }

  .timeline-title {
    font-size: 16px;
  }

  .timeline-description {
    font-size: 13px;
  }

  .intro-card {
    padding: 28px 24px;
  }

  .intro-paragraph {
    font-size: 14px;
  }

  .intro-paragraph-lead {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .recruitment-title {
    font-size: 28px;
  }

  .timeline-item {
    gap: 16px;
    padding: 12px 0;
  }

  .intro-card {
    padding: 24px 20px;
  }

  .intro-paragraph {
    font-size: 13px;
    line-height: 1.8;
  }
}
</style>
