import { ref } from 'vue'

// 路由切换进度条状态：模块级单例，router 守卫写入、RouteProgress 组件读取。
// 背景：路由组件均为懒加载，首次点击导航需等待 chunk 拉取/编译，
// 期间页面无任何反馈——顶部细进度条提供即时视觉反馈
const active = ref(false)

let showTimer: number | undefined
let hideTimer: number | undefined
let safetyTimer: number | undefined

function scheduleHide() {
  if (hideTimer !== undefined) clearTimeout(hideTimer)
  // 稍作停留再隐藏，配合淡出过渡让进度条收尾更自然
  hideTimer = window.setTimeout(() => {
    hideTimer = undefined
    active.value = false
  }, 250)
}

export function useRouteProgress() {
  function start() {
    // 兜底：重复导航等场景不会触发 afterEach，8s 后强制隐藏避免进度条卡死
    if (safetyTimer !== undefined) clearTimeout(safetyTimer)
    safetyTimer = window.setTimeout(() => {
      safetyTimer = undefined
      active.value = false
    }, 8000)

    if (showTimer !== undefined || active.value) return
    // 延迟 120ms 再显示：瞬时完成的导航不闪进度条
    showTimer = window.setTimeout(() => {
      showTimer = undefined
      active.value = true
    }, 120)
  }

  function done() {
    if (safetyTimer !== undefined) {
      clearTimeout(safetyTimer)
      safetyTimer = undefined
    }
    if (showTimer !== undefined) {
      clearTimeout(showTimer)
      showTimer = undefined
    } else {
      scheduleHide()
    }
  }

  return { active, start, done }
}
