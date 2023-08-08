import { createPinia, defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

const store = createPinia()

export default store

export const useAppStore = defineStore('app', {
  state: () => ({
    activeRoute: {} as RouteLocationNormalized,
  }),
  getters: {
    activeRoutePath(state) {
      return state.activeRoute.path
    },
  },
})
