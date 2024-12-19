import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../components/LoginView.vue'),
    meta: { layout: false }, 
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/RegisterView.vue'),
    meta: { layout: false }, 
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../components/MainView.vue'),
    meta: { layout: true },
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../components/InventoryView.vue'),
    meta: { layout: true },
  },
  {
    path: '/manage-users',
    name: 'manage users',
    component: () => import('../components/ManageUserView.vue'),
    meta: { layout: true },
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../components/CategoryView.vue'),
    meta: { layout: true },
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../components/ProductView.vue'),
    meta: { layout: true },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../components/OrderView.vue'),
    meta: { layout: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/AdminUpdateView.vue'),
    meta: { layout: true },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
