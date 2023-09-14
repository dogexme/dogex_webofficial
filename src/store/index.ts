import { createPinia, defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { DogeErrorCode } from '@/hooks/doge'
import { ElMessageBox } from 'element-plus'

const store = createPinia()
const { connectDpal } = useDoge()

export default store

export const useAppStore = defineStore('app', {
  state: () => ({
    activeRoute: {} as RouteLocationNormalized,
    address: '',
    transferList: JSON.parse(localStorage.getItem('transfer_list') || '[]')
  }),
  actions: {
    connectDpal() {
      return connectDpal()
      .then((userAddress: string) => {
        if (userAddress) {
          this.address = userAddress
        }
        return userAddress
      })
      .catch((code) => {
        if (DogeErrorCode.notInstall == code) {
          ElMessageBox.confirm('please install dpal wallet?', '', {
            confirmButtonText: 'Install',
            type: 'warning',
          }).then(() => {
            window.open('https://dpalwallet.io')
          })
        }
        throw code
      })
    },
    updateTransferList(transfer?: any) {
      if (transfer) {
        this.transferList.unshift(transfer)
      }
      localStorage.setItem('transfer_list', JSON.stringify(this.transferList))
    }
  },
  getters: {
    activeRoutePath(state) {
      return state.activeRoute.path
    },
    transferLoadingCount(state) {
      return state.transferList.filter((f: { status: '0' }) => f.status == '0').length
    }
  },
})
