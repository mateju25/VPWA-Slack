import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { requiresAuth: true },
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/auth',
    component: () => import('layouts/SideLayout.vue'),
    children: [
      {
        path: 'register',
        name: 'register',
        meta: { guestOnly: true },
        component: () => import('pages/Register.vue'),
      },
      {
        path: 'login',
        name: 'login',
        meta: { guestOnly: true },
        component: () => import('pages/Login.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
