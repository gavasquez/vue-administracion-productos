import { adminRoutes } from '@/modules/admin/routes';
import { authRoutes } from '@/modules/auth/routes/routes';
import ShopLayoutVue from '@/modules/shop/layouts/ShopLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayoutVue,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../modules/shop/views/HomeView.vue'),
        },
      ],
    },
    /* Auth Routes */
    authRoutes,
    /* Admin routes */
    adminRoutes,
  ],
});

export default router;
