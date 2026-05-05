<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Github, Users, MessageCircle, Radio, Video, ExternalLink } from 'lucide-vue-next'
import { version } from '../../package.json'

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

const updateTime = () => {
  currentTime.value = formatDateTime(new Date())
}

const handleLinkClick = (url: string) => {
  if (url === '#') {
    return
  }
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
  if (timeInterval) {
    clearInterval(timeInterval)
  }
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
  position: relative;
  width: 100%;
  background: rgba(4, 8, 12, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(130, 212, 242, 0.08);
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
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  opacity: 0.7;
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
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-white);
  text-decoration: none;
  opacity: 0.6;
}

.footer-link-item:hover {
  background: rgba(130, 212, 242, 0.08);
  color: var(--color-blue);
  opacity: 0.9;
}

.footer-link-icon {
  width: 14px;
  height: 14px;
  color: var(--color-blue);
  transition: transform 0.3s ease;
}

.footer-link-item:hover .footer-link-icon {
  transform: scale(1.1);
}

.footer-link-text {
  font-size: 12px;
  font-weight: 400;
  position: relative;
}

.footer-link-text::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  transition: width 0.3s ease;
}

.footer-link-item:hover .footer-link-text::after {
  width: 100%;
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
  background: rgba(130, 212, 242, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(130, 212, 242, 0.06);
}

.footer-info-label {
  font-size: 12px;
  color: var(--color-blue);
  font-weight: 400;
  opacity: 0.7;
}

.footer-info-value {
  font-size: 12px;
  color: var(--color-white);
  font-family: var(--mono);
  opacity: 0.6;
}

.footer-info-link {
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-info-link:hover {
  background: rgba(130, 212, 242, 0.08);
  border-color: rgba(130, 212, 242, 0.15);
}

.footer-info-link:hover .footer-info-label {
  opacity: 0.9;
}

.footer-info-link:hover .footer-info-icon {
  color: var(--color-blue);
  transform: translate(2px, -2px);
}

.footer-info-icon {
  width: 12px;
  height: 12px;
  color: var(--color-blue);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.footer-bottom {
  padding-top: 12px;
  border-top: 1px solid rgba(130, 212, 242, 0.06);
  text-align: center;
}

.footer-copyright {
  font-size: 11px;
  color: var(--color-white);
  opacity: 0.4;
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
