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
            path: 'nft',
            name: 'nft',
            component: {},
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
      {
        path: 'swordpool',
        name: 'swordpool',
        component: () => import('@/views/SwardpoolBeta/SwardpoolBeta.vue'),
      },
      {
        path: '/drc20',
        name: 'drc20',
        component: () => import('@/views/Drc20/Drc20.vue'),
        children: [
          {
            path: 'item/:tick',
            component: () => import('@/views/Drc20/DrcItem.vue'),
          },
          {
            path: 'wallet/:address',
            component: () => import('@/views/Drc20/DrcWallet.vue'),
          },
        ],
      },
      // {
      //   path: 'swap',
      //   name: 'swap',
      //   component: () => import('@/views/Swap/Swap.vue')
      // }
      // {
      //   name: 'marketplace',
      //   path: 'marketplace',
      //   component: () => import('@/views/Marketplace/Marketplace.vue'),
      //   redirect: {
      //     name: 'marketTokenList',
      //     query: { category: 'tokens' },
      //   },
      //   children: [
      //     {
      //       path: '',
      //       name: 'marketTokenList',
      //       component: () => import('@/views/Marketplace/MarketTokenList'),
      //     },
      //     {
      //       path: 'tokens',
      //       name: 'marketTokens',
      //       component: () => import('@/views/Marketplace/MarketTokens'),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '/home',
    redirect: '/',
  },
] as RouteRecordRaw[]
