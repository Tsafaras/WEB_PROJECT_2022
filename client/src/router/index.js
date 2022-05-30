import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/WelcomeView.vue')
    },
    {
      path: '/user',
      name: 'user',
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
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})

/**
 * sessionStorage stores 'String' only, so we have to parse it into a 'boolean'.
 * @returns {boolean}
 */
const checkPrivy = () => {
  return JSON.parse(sessionStorage.getItem("privilege")) === true;
}

const checkUsername = () => {
  return sessionStorage.getItem("username");
}

router.beforeEach(async (to,from) => {
  if (!checkUsername() && to.name !=='home')
    return {name: 'home'};

  if ( checkUsername() && !checkPrivy() && to.name !=='user' && to.name !== 'covid' && to.name !== 'profile')
    return {name: 'user'};

  if ( checkUsername() && checkPrivy() && to.name !=='admin' && to.name !== 'graphs')
    return {name: 'admin'};
})

export default router
