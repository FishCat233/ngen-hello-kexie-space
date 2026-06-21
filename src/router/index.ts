import { createRouter, createWebHistory } from 'vue-router'
import { useScrollStore } from '../stores/scroll'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/direction/:id',
      name: 'Direction',
      component: () => import('../views/DirectionView.vue'),
      props: true,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/awards',
      name: 'Awards',
      component: () => import('../views/AwardsView.vue'),
    },
    {
      path: '/comments',
      name: 'Comments',
      component: () => import('../views/CommentsView.vue'),
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: () => import('../views/GalleryView.vue'),
    },
  ],
  scrollBehavior(to) {
    if (to.path === '/') {
      const store = useScrollStore()
      if (store.hasVisitedHome) {
        return { top: store.savedScrollY }
      }
      return { top: 0 }
    }
    return { top: 0 }
  },
})

router.beforeEach((_to, from) => {
  if (from.path === '/') {
    const store = useScrollStore()
    store.savedScrollY = window.scrollY
  }
})

export default router
