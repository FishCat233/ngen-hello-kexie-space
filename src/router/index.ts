import { createRouter, createWebHistory } from 'vue-router'

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
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
