<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ClipboardList, BookOpen, Mic2, FileCheck, Trophy } from 'lucide-vue-next'
import SectionMark from './SectionMark.vue'
import { recruitmentStages } from '../data/recruitment'
import { loadRecruitment } from '../api/cms'

// 图标按阶段 id 映射：CMS 只存标题/时间/描述等文案，图标属于代码资产
const stageIcons: Record<string, typeof ClipboardList> = {
  register: ClipboardList,
  learning: BookOpen,
  presentation: Mic2,
  exam: FileCheck,
  competition: Trophy,
}
const iconFor = (id: string) => stageIcons[id] || ClipboardList

const timelineItems = ref(recruitmentStages)
const loadError = ref(false)

onMounted(() => {
  void loadRecruitment(recruitmentStages).then((result) => {
    timelineItems.value = result.data
    loadError.value = result.source === 'fallback'
  })
})
</script>

<template>
  <section class="recruitment-section">
    <div class="recruitment-container">
      <h2 class="recruitment-title"><SectionMark class="title-mark" /> 加入我们</h2>

      <p v-if="loadError" class="cms-notice">内容服务暂不可用，当前显示内置数据</p>

      <!-- 横向时间线：圆角卡片包裹，阶段之间以 SVG 箭头衔接 -->
      <div class="timeline-card">
        <div class="timeline">
          <template v-for="(item, index) in timelineItems" :key="item.id">
            <div class="timeline-node">
              <div class="timeline-icon">
                <component :is="iconFor(item.id)" :size="22" stroke-width="2" />
              </div>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <span class="timeline-time">{{ item.time }}</span>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
            <svg
              v-if="index < timelineItems.length - 1"
              class="timeline-arrow"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 24H36"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                d="M38 17.5L45.5 24L38 30.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.recruitment-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 20px 10vh;
  background: var(--color-bg);
}

.recruitment-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 64px;
}

.cms-notice {
  width: 100%;
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 16px;
  margin: -40px 0;
  color: var(--color-text);
}

.recruitment-title {
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

/* 时间线外层：二级卡片圆角包裹 */
.timeline-card {
  width: 100%;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 44px 48px;
}

/* 横向时间线 */
.timeline {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.timeline-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 0 8px;
}

.timeline-icon {
  width: 44px;
  height: 44px;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* 阶段衔接箭头：SVG 中心对齐 44px 图标中心（22px） */
.timeline-arrow {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  color: var(--color-primary);
  margin-top: -2px;
}

.timeline-title {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

/* 阶段时间：扁平小徽章（同获奖页等级徽章语言），紧贴标题 */
.timeline-time {
  margin-top: -4px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 13%, transparent);
  color: var(--color-primary-bright);
  font-size: var(--text-xs);
  line-height: 1.4;
  white-space: nowrap;
}

.timeline-description {
  font-size: var(--text-body);
  color: var(--color-text);
  margin: 0;
  line-height: var(--leading-normal);
}

@media (max-width: 1024px) {
  .recruitment-section {
    padding: 4vh 16px 10vh;
  }

  .timeline-card {
    padding: 40px 28px;
  }

  .timeline-arrow {
    width: 36px;
    height: 36px;
    margin-top: 4px;
  }
}

/* 窄屏：时间线转为纵向，箭头旋转指向下一阶段 */
@media (max-width: 640px) {
  .timeline {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .timeline-card {
    padding: 32px 20px;
  }

  .timeline-arrow {
    width: 28px;
    height: 28px;
    transform: rotate(90deg);
    margin: 4px 0;
  }

  .timeline-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
