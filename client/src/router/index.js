import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user',
      name: 'home',
      component: () => import('../views/UserView.vue')
    },
    {
      path: '/covid',
      name: 'covid',
      component: () => import('../views/UserCovidView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/graphs',
      name: 'graphs',
      component: () => import('../views/AdminGraphsView.vue')
    }
  ]
})

export default router
