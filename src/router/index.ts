import * as VueRouter from 'vue-router'
import routes from './routes'
import { useAppStore } from '../store'

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

router.beforeEach((to, _form, next) => {
  const appStore = useAppStore()
  appStore.activeRoute = to
  next()
})

export default router
