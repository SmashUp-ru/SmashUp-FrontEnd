import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/recover', name: 'recover', component: () => import('../views/auth/RecoverView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
    { path: '/:pathMatch(.*)*', beforeEnter: (to, from, next) => next(`/404`), component: () => {} },
    { path: '/404', name: '404', component: () => import('../views/PageNotFound.vue') },
  ]
})
 
export default router
