import { createRouter, createWebHistory } from 'vue-router'
import DirectionView from '../views/DirectionView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/direction/:id',
      name: 'Direction',
      component: DirectionView,
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
