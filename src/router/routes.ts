import type { RouteRecordRaw } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'

export default [
  {
    path: '/',
    component: BaseLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home/Home.vue'),
        children: [
          {
            path: '/overview',
            name: 'overview',
            component: () => import('@/views/Home/components/Overview'),
          },
          {
            path: '/holders',
            name: 'holders',
            component: () => import('@/views/Home/components/HolderTable'),
          },
          {
            path: '/transfers',
            name: 'transfers',
            component: () => import('@/views/Home/components/TransfersTable'),
          },
          {
            path: '/assets',
            name: 'transfers',
            component: () => import('@/views/Home/components/AssetsTable'),
          },
        ],
      },
      {
        name: 'address',
        path: 'address/:address',
        component: () => import('@/views/Address/Address.vue'),
      },
      {
        name: 'tokens',
        path: 'tokens/:address/:txid',
        component: () => import('@/views/Address/Tokens'),
      },
    ],
  },
] as RouteRecordRaw[]
