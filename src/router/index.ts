import * as VueRouter from 'vue-router'
import routes from './routes'
import { useAppStore } from '../store'

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
  scrollBehavior (_to, _from, _savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach((to, _form, next) => {
  const appStore = useAppStore()
  appStore.activeRoute = to
  next()
})

export default router
