<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Github, Users, MessageCircle, Radio, Video, ExternalLink } from 'lucide-vue-next'
import { version } from '../../package.json'
import { KEXIE_FOUNDING_DATE } from '../data/kexie'

interface ContactLink {
  name: string
  url: string
  icon: string
}

const contactLinks: ContactLink[] = [
  { name: 'Github', url: 'https://github.com/sanyuankexie', icon: 'github' },
  { name: 'QQ 群', url: 'https://api.kexie.space/recruitment-qq-group', icon: 'users' },
  { name: 'QQ 频道', url: 'https://pd.qq.com/s/5pxzsijx0', icon: 'message-circle' },
  { name: '微信公众号', url: 'https://mp.weixin.qq.com/s/Gszdlpxdv-puAVj9KalcHg', icon: 'radio' },
  { name: 'Bilibili 账号', url: 'https://space.bilibili.com/673693349', icon: 'video' },
]

const currentTime = ref('')
const kexieDuration = ref('')
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

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60
  return `${days}天${remainingHours}小时${remainingMinutes}分${remainingSeconds}秒`
}

const updateTime = () => {
  currentTime.value = formatDateTime(new Date())
  const kexieStartDate = new Date(KEXIE_FOUNDING_DATE)
  const now = new Date()
  const duration = now.getTime() - kexieStartDate.getTime()
  kexieDuration.value = formatDuration(duration)
}

const handleLinkClick = (url: string) => {
  if (url === '#') return
  window.open(url, '_blank')
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, typeof Github> = {
    github: Github,
    users: Users,
    'message-circle': MessageCircle,
    radio: Radio,
    video: Video,
  }
  return iconMap[iconName] || Github
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
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <div class="footer-links">
            <div
              v-for="link in contactLinks"
              :key="link.name"
              class="footer-link-item"
              @click="handleLinkClick(link.url)"
            >
              <component :is="getIconComponent(link.icon)" class="footer-link-icon" />
              <span class="footer-link-text">{{ link.name }}</span>
            </div>
          </div>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">站点信息</h3>
          <div class="footer-info">
            <div class="footer-info-item">
              <span class="footer-info-label">版本：</span>
              <span class="footer-info-value">v{{ version }}</span>
            </div>
            <div
              class="footer-info-item footer-info-link"
              @click="handleLinkClick('https://github.com/FishCat233/ngen-hello-kexie-space')"
            >
              <span class="footer-info-label">Github 仓库：</span>
              <span class="footer-info-value">FishCat233/ngen-hello-kexie-space</span>
              <ExternalLink class="footer-info-icon" />
            </div>
            <div class="footer-info-item">
              <span class="footer-info-label">时间：</span>
              <span class="footer-info-value">{{ currentTime }}</span>
            </div>
            <div class="footer-info-item kexie-duration">
              <span class="footer-info-label">科协已砥砺前行(至少)：</span>
              <span class="footer-info-value">{{ kexieDuration }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          桂电三院科协 © {{ new Date().getFullYear() }} :: Site Powered by ❤️.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background: var(--color-black);
  border-top: 1px solid var(--color-cyan);
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px 12px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 16px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-blue);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  color: var(--color-white);
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.footer-link-item:hover {
  background: var(--color-blue);
  color: var(--color-black);
}

.footer-link-item:hover .footer-link-icon {
  color: var(--color-black);
}

.footer-link-icon {
  width: 14px;
  height: 14px;
  color: var(--color-cyan);
}

.footer-link-text {
  font-size: 12px;
  font-weight: 400;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
}

.footer-info-label {
  font-size: 12px;
  color: var(--color-blue);
  font-weight: 400;
}

.footer-info-value {
  font-size: 12px;
  color: var(--color-white);
  font-family: var(--mono);
}

.footer-info-link {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.footer-info-link:hover {
  background: var(--color-blue);
}

.footer-info-link:hover .footer-info-label,
.footer-info-link:hover .footer-info-value,
.footer-info-link:hover .footer-info-icon {
  color: var(--color-black);
}

.footer-info-icon {
  width: 12px;
  height: 12px;
  color: var(--color-cyan);
}

.kexie-duration .footer-info-value {
  color: var(--color-blue);
}

.footer-bottom {
  padding-top: 12px;
  border-top: 1px solid var(--color-cyan);
  text-align: center;
}

.footer-copyright {
  font-size: 11px;
  color: var(--color-white);
  margin: 0;
}

@media (max-width: 1024px) {
  .footer-container {
    padding: 16px 16px 10px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 12px;
  }

  .footer-title {
    font-size: 13px;
  }

  .footer-link-item {
    padding: 3px 6px;
  }

  .footer-link-text {
    font-size: 11px;
  }

  .footer-info-item {
    padding: 3px 6px;
  }

  .footer-info-label,
  .footer-info-value {
    font-size: 11px;
  }

  .footer-copyright {
    font-size: 10px;
  }
}
</style>
