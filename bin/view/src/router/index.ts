import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/npm-analyze-view'
    },
    {
      path: '/npm-analyze-view',
      name: 'npm-analyze-view',
      component: () => import('../view/npm-analyze-view.vue'),
      children: []
    },
    // 404路由
    {
      path: '/:pathMatch(.*)',
      component: () => import('../view/not-found.vue')
    }
  ]
})

export default router