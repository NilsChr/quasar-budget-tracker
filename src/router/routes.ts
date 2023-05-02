import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AddTransactionPage.vue') }],
  },
  {
    path: '/addtransaction',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AddTransactionPage.vue') }],
  },
  {
    path: '/transactions',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TransactionsPage.vue') }],
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SettingsPage.vue') }],
  },
  {
    path: '/managetags',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManageTags.vue') }],
  },
  {
    path: '/manageautotags',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ManageAutoTags.vue') }],
  },
  {
    path: '/savings',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/BudgetPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
