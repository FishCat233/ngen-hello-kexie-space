import { createRouter, createWebHistory } from 'vue-router'
import { useScrollStore } from '../stores/scroll'
import { useRouteProgress } from '../composables/useRouteProgress'

// 路由组件集中懒加载注册表：路由定义与空闲预取共用同一份 loader，
// 确保 Vite 对两者打出同一份 chunk，预取后点击导航无需再等网络
export const viewLoaders = {
  direction: () => import('../views/DirectionView.vue'),
  projects: () => import('../views/ProjectsView.vue'),
  awards: () => import('../views/AwardsView.vue'),
  comments: () => import('../views/CommentsView.vue'),
  gallery: () => import('../views/GalleryView.vue'),
  organization: () => import('../views/OrganizeView.vue'),
  members: () => import('../views/MembersView.vue'),
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/direction/:id',
      name: 'Direction',
      component: viewLoaders.direction,
      props: true,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: viewLoaders.projects,
    },
    {
      path: '/awards',
      name: 'Awards',
      component: viewLoaders.awards,
    },
    {
      path: '/comments',
      name: 'Comments',
      component: viewLoaders.comments,
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: viewLoaders.gallery,
    },
    {
      path: '/organization',
      name: 'Organization',
      component: viewLoaders.organization,
    },
    {
      path: '/members',
      name: 'Members',
      component: viewLoaders.members,
    },
  ],
  scrollBehavior(to) {
    if (to.path === '/') {
      const store = useScrollStore()
      if (store.hasVisitedHome) {
        // 交给 App.vue 在 DOM 渲染后恢复，这里不做滚动
        return false
      }
    }
    return { top: 0 }
  },
})

const { start: startProgress, done: doneProgress } = useRouteProgress()

router.beforeEach((_to, from) => {
  // 懒加载 chunk 的拉取发生在守卫与确认之间，进度条恰好覆盖这段等待
  startProgress()
  if (from.path === '/') {
    const store = useScrollStore()
    store.savedScrollY = window.scrollY
  }
})

router.afterEach(() => {
  doneProgress()
})

router.onError(() => {
  doneProgress()
})

// 导航意图预取：仅在链接 hover / 聚焦时按需拉取目标路由 chunk。
// 只预取用户可能真正点击的目标，避免首屏后无条件下载全部路由（含 direction 的 300KB+ 文档依赖）
export function prefetchRoute(href: string) {
  let resolved
  try {
    resolved = router.resolve(href)
  } catch {
    return
  }
  const name = String(resolved.name ?? '').toLowerCase()
  const load = viewLoaders[name as keyof typeof viewLoaders]
  if (load) void load()
}

export default router
