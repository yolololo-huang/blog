import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/diary',
      name: 'diary',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DiaryView.vue')
    },
    {
      path: '/debuglog',
      name: 'debuglog',
      component: () => import('../views/DebuglogView.vue')
    },
    {
      path: '/ielts',
      name: 'IELTS',
      component: () => import('../views/IELTSView.vue')
    }
  ]
})

export default router
