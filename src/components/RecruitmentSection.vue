<script setup lang="ts">
import {
  ClipboardList,
  BookOpen,
  Mic2,
  FileCheck,
  Trophy,
} from "lucide-vue-next";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  icon: typeof ClipboardList;
}

const timelineItems: TimelineItem[] = [
  {
    id: "register",
    title: "报名阶段",
    description: "报名时间截止到笔试前",
    icon: ClipboardList,
  },
  {
    id: "learning",
    title: "入门学习",
    description: "学会使用 Online Judge 实现问题求解",
    icon: BookOpen,
  },
  {
    id: "presentation",
    title: "招新宣讲",
    description: "三院科协招新宣讲会",
    icon: Mic2,
  },
  {
    id: "exam",
    title: "笔试和面试",
    description: "期待脱颖而出的你！",
    icon: FileCheck,
  },
  {
    id: "competition",
    title: "绘蓝杯科技竞赛",
    description: "绽放你们的光芒！",
    icon: Trophy,
  },
];

const introParagraphs = [
  "三院科协是依托于计算机与信息安全学院，面向全校的校级技术社团。我们的活动包括技术学习，承办和策划各类科技赛事和颁奖仪式，组织创新创业训练等。科协设有软件部、硬件部、多媒体部、组织部共四个部门，致力于对成员技术能力及创新能力的培养。",
  "在科协，你不仅能提高自身的技术，结交志同道合的伙伴，还能收获前辈的悉心指导，共享优质的资源服务。",
  "科协的大门将为你们敞开，我们期待你们的到来，欢迎与我们一起畅游在技术的海洋！",
];
</script>

<template>
  <section class="recruitment-section">
    <div class="recruitment-container">
      <h2 class="recruitment-title">加入我们</h2>

      <div class="recruitment-content">
        <!-- 左侧：时间线 -->
        <div class="timeline-wrapper">
          <h3 class="timeline-section-title">招新时间线</h3>
          <div class="timeline">
            <div
              v-for="(item, index) in timelineItems"
              :key="item.id"
              class="timeline-item"
            >
              <div class="timeline-marker">
                <div class="timeline-icon">
                  <component :is="item.icon" :size="20" stroke-width="2" />
                </div>
                <div
                  v-if="index < timelineItems.length - 1"
                  class="timeline-line"
                ></div>
              </div>
              <div class="timeline-content">
                <h3 class="timeline-title">{{ item.title }}</h3>
                <p class="timeline-description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：科协介绍 -->
        <div class="intro-wrapper">
          <div class="intro-card">
            <p
              v-for="(paragraph, index) in introParagraphs"
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
  padding: 60px 20px;
  background: transparent;
}

.recruitment-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

.recruitment-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    var(--color-blue) 0%,
    var(--color-cyan) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
}

.recruitment-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  width: 100%;
  align-items: start;
}

/* 时间线样式 */
.timeline-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.timeline-section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
  text-align: center;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  padding: 16px 0;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(130, 212, 242, 0.1);
  border: 2px solid var(--color-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue);
  box-shadow: 0 0 20px rgba(130, 212, 242, 0.2);
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(130, 212, 242, 0.6) 0%,
    rgba(111, 208, 206, 0.3) 100%
  );
  margin-top: 8px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
}

.timeline-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.timeline-description {
  font-size: 15px;
  color: rgba(235, 251, 255, 0.75);
  margin: 0;
  line-height: 1.5;
}

/* 科协介绍样式 */
.intro-wrapper {
  display: flex;
  align-items: center;
}

.intro-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid rgba(130, 212, 242, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.intro-card:hover {
  background: rgba(130, 212, 242, 0.08);
  border-color: rgba(130, 212, 242, 0.3);
  box-shadow: 0 8px 32px rgba(130, 212, 242, 0.1);
}

.intro-paragraph {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(235, 251, 255, 0.85);
  margin: 0;
  text-align: justify;
}

/* 响应式处理 */
@media (max-width: 1024px) {
  .recruitment-section {
    padding: 40px 16px;
  }

  .recruitment-title {
    font-size: 32px;
  }

  .recruitment-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .timeline-icon {
    width: 40px;
    height: 40px;
  }

  .timeline-section-title {
    font-size: 20px;
  }

  .timeline-title {
    font-size: 18px;
  }

  .timeline-description {
    font-size: 14px;
  }

  .intro-card {
    padding: 24px;
  }

  .intro-paragraph {
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .recruitment-title {
    font-size: 28px;
  }

  .timeline-section-title {
    font-size: 18px;
  }

  .timeline-item {
    gap: 16px;
    padding: 12px 0;
  }

  .timeline-icon {
    width: 36px;
    height: 36px;
  }

  .timeline-icon > * {
    width: 18px !important;
    height: 18px !important;
  }

  .timeline-content {
    padding-top: 4px;
  }

  .timeline-title {
    font-size: 16px;
  }

  .timeline-description {
    font-size: 13px;
  }

  .intro-card {
    padding: 20px;
  }

  .intro-paragraph {
    font-size: 13px;
    line-height: 1.7;
  }
}
</style>
