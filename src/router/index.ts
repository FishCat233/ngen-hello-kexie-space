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

// 空闲时预取全部路由 chunk：首屏渲染完成后在后台拉取，
// 之后点击导航即点即开，无需再等网络
export function prefetchViews() {
  Object.values(viewLoaders).forEach((load) => {
    void load()
  })
}

export default router
