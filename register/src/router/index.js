import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Information from '@/components/Information.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/information',
      name: 'information',
      component: Information
    },
  ]
})

export default router
