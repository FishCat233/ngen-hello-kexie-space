import { createRouter, createWebHistory } from 'vue-router'
import DirectionView from '../views/DirectionView.vue'
import ProjectsView from '../views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/direction/:id',
      name: 'Direction',
      component: DirectionView,
      props: true,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
