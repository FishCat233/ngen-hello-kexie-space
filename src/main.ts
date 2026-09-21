import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router, { prefetchRoute } from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// 按需预取路由 chunk：悬停 / 键盘聚焦站内链接时才拉取目标页面代码。
// 省流模式或 2G 网络下不预取，避免为用户大概率不会点开的页面浪费流量。
type NetworkInformation = { saveData?: boolean; effectiveType?: string }
const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
const slowNetwork = /(^|-)2g$/.test(connection?.effectiveType ?? '')
if (!connection?.saveData && !slowNetwork) {
  const maybePrefetch = (target: EventTarget | null) => {
    const anchor = (target as Element | null)?.closest?.('a[href]')
    const href = anchor?.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('//')) return
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return
    prefetchRoute(href)
  }
  window.addEventListener('pointerover', (e) => maybePrefetch(e.target), { passive: true })
  window.addEventListener('focusin', (e) => maybePrefetch(e.target))
}
