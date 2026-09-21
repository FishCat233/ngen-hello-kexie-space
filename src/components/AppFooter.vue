<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Github, Users, Hash, Megaphone, Tv, Tag, FolderGit2, Clock } from 'lucide-vue-next'
import { version } from '../../package.json'
import { KEXIE_FOUNDING_DATE } from '../data/kexie'
import BlurNumber from './BlurNumber.vue'

const commitSha = import.meta.env.VITE_GIT_COMMIT_SHA
const commitUrl = computed(() =>
  commitSha ? `https://github.com/FishCat233/ngen-hello-kexie-space/commit/${commitSha}` : '',
)

interface ContactLink {
  name: string
  url: string
  icon: typeof Github
}

const contactLinks: ContactLink[] = [
  { name: 'Github', url: 'https://github.com/sanyuankexie', icon: Github },
  { name: 'QQ 群', url: 'https://api.kexie.space/recruitment-qq-group', icon: Users },
  { name: 'QQ 频道', url: 'https://pd.qq.com/s/5pxzsijx0', icon: Hash },
  { name: '微信公众号', url: 'https://mp.weixin.qq.com/s/Gszdlpxdv-puAVj9KalcHg', icon: Megaphone },
  { name: 'Bilibili 账号', url: 'https://space.bilibili.com/673693349', icon: Tv },
]

interface SiteLink {
  name: string
  url?: string
  time?: boolean
  icon: typeof Tag
}

const siteLinks: SiteLink[] = [
  {
    name: `版本 v${version}${commitSha ? ` (${commitSha})` : ''}`,
    icon: Tag,
    url: commitSha ? commitUrl.value : undefined,
  },
  {
    name: 'Github 仓库',
    url: 'https://github.com/FishCat233/ngen-hello-kexie-space',
    icon: FolderGit2,
  },
  { name: '时间', icon: Clock, time: true },
]

interface DurationParts {
  days: string
  hours: string
  minutes: string
  seconds: string
}

const currentTime = ref('')
const duration = ref<DurationParts>({ days: '0', hours: '00', minutes: '00', seconds: '00' })
let timeInterval: number | null = null

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const formatDuration = (ms: number): DurationParts => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  return {
    days: String(days),
    hours: String(hours % 24).padStart(2, '0'),
    minutes: String(minutes % 60).padStart(2, '0'),
    seconds: String(seconds % 60).padStart(2, '0'),
  }
}

const updateTime = () => {
  currentTime.value = formatDateTime(new Date())
  const kexieStartDate = new Date(KEXIE_FOUNDING_DATE)
  const now = new Date()
  duration.value = formatDuration(now.getTime() - kexieStartDate.getTime())
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-main">
        <!-- 左：品牌区 -->
        <div class="footer-brand">
          <picture>
            <source srcset="/logo.webp" type="image/webp" />
            <img src="/logo.png" alt="科协LOGO" class="footer-logo" />
          </picture>
          <div class="footer-brand-text">
            <span class="footer-brand-name">桂电三院科协</span>
            <span class="footer-brand-slogan">科技融入梦想，创新点缀人生</span>
          </div>
        </div>

        <!-- 右：两栏信息 -->
        <div class="footer-columns">
          <div class="footer-col">
            <h3 class="footer-col-title">联系我们</h3>
            <div class="footer-col-list">
              <a
                v-for="link in contactLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-item"
              >
                <component :is="link.icon" :size="14" class="item-icon" />
                <span>{{ link.name }}</span>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h3 class="footer-col-title">站点信息</h3>
            <div class="footer-col-list">
              <a
                v-for="link in siteLinks"
                :key="link.name"
                :href="link.url"
                :target="link.url ? '_blank' : undefined"
                :rel="link.url ? 'noopener noreferrer' : undefined"
                class="footer-item"
                :class="{ 'is-static': !link.url }"
              >
                <component :is="link.icon" :size="14" class="item-icon" />
                <span v-if="link.time">{{ currentTime }}</span>
                <span v-else>{{ link.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部版权条：更深的底色区分区域 -->
    <div class="footer-bottom">
      <!-- 页面最底部中心放射的椭圆蓝色光晕（呼吸感动画） -->
      <div class="footer-glow" aria-hidden="true"></div>

      <!-- 砥砺前行翻卡计时 -->
      <div class="duration-block">
        <span class="duration-label">科协已砥砺前行（至少）</span>
        <div class="flip-counter">
          <span class="counter-group">
            <BlurNumber :value="duration.days" />
            <span class="counter-unit">天</span>
          </span>
          <span class="counter-group">
            <BlurNumber :value="duration.hours" />
            <span class="counter-unit">小时</span>
          </span>
          <span class="counter-group">
            <BlurNumber :value="duration.minutes" />
            <span class="counter-unit">分</span>
          </span>
          <span class="counter-group">
            <BlurNumber :value="duration.seconds" />
            <span class="counter-unit">秒</span>
          </span>
        </div>
      </div>

      <p class="footer-copyright">
        桂电三院科协 © {{ new Date().getFullYear() }} :: Site Powered by ❤️.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background: var(--color-surface);
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
}

/* 品牌区与右侧两栏顶部对齐 */
.footer-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 64px;
}

/* 品牌区：上提补偿右侧标题行高的半行距，保证视觉顶边齐平 */
.footer-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: -4px;
}

.footer-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.footer-brand-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-brand-name {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-white);
}

.footer-brand-slogan {
  font-size: var(--text-sm);
  color: #9ca3af;
}

/* 右侧两栏 */
.footer-columns {
  display: flex;
  gap: 96px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 标题与子项图标的左缘对齐 */
.footer-col-title {
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.footer-col-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-ui);
  color: #9ca3af;
  text-decoration: none;
  font-family: inherit;
  white-space: nowrap;
}

.item-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

a.footer-item {
  cursor: pointer;
}

a.footer-item.is-static {
  cursor: default;
}

/* 版权条：底色与页脚主区统一 */
.footer-bottom {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 32px 24px 20px;
  text-align: center;
}

/* 底部中心放射椭圆蓝色光晕：置于内容之下，呼吸感起伏 */
.footer-glow {
  position: absolute;
  left: 50%;
  bottom: -200px;
  width: min(1200px, 92vw);
  height: 400px;
  z-index: -1;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(59, 130, 246, 0.24),
    rgba(59, 130, 246, 0.1) 38%,
    transparent 68%
  );
  pointer-events: none;
  animation: footer-glow-breathe 7s ease-in-out infinite;
}

@keyframes footer-glow-breathe {
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
}

.duration-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.duration-label {
  font-size: var(--text-sm);
  color: #9ca3af;
}

/* 翻卡计数器 */
.flip-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  perspective: 300px;
}

.counter-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.counter-unit {
  font-size: var(--text-ui);
  color: #9ca3af;
}

/* 版权行与计时器同灰阶，视觉上连为一个整体 */
.footer-copyright {
  font-size: var(--text-xs);
  color: #9ca3af;
  margin: 0;
}

@media (max-width: 1024px) {
  .footer-container {
    padding: 48px 16px;
  }

  .footer-main {
    flex-direction: column;
    gap: 48px;
  }

  .footer-columns {
    gap: 64px;
  }
}

@media (max-width: 640px) {
  .footer-columns {
    flex-direction: column;
    gap: 40px;
  }

  .flip-counter {
    gap: 8px;
  }
}
</style>
