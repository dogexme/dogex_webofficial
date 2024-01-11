import { createPinia, defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { DogeErrorCode } from '@/hooks/doge'
import { ElMessageBox } from 'element-plus'
import { getBlocksCount } from '@/services/nft'
import { getMenuAuth } from '@/services/drc'
import menuList from '@/config/navlist'
import { queryPoolState, queryPools } from '@/services/sword'
import { TokenState } from '@/services/types'

const store = createPinia()
const { connectDpal } = useDoge()

export default store

export const useAppStore = defineStore('app', {
  state: () => ({
    activeRoute: {} as RouteLocationNormalized,
    address: '',
    blockCount: 0,
    transferList: JSON.parse(localStorage.getItem('transfer_list') || '[]'),
    menus: JSON.parse(localStorage.getItem('menus') || '[]') as typeof menuList,
    swordPoolInfo: {} as any,
    poolid: '',
    currentPoolState: {} as TokenState,
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
              customClass: 'messageBox-dialog',
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
    },
    getBlocksCountHandler() {
      getBlocksCount().then((r) => {
        this.blockCount = r.data?.data?.[0]?.block || 0
        setTimeout(
          () => {
            this.getBlocksCountHandler()
          },
          1000 * 60 * 5
        )
      })
    },
    async getMenus() {
      const res = await getMenuAuth()
      const auth = res.data
      const menus: typeof menuList = []
      menuList.forEach((mItem) => {
        if (auth[mItem.value] !== false) {
          menus.push(mItem)
        }
      })
      this.menus = menus
      localStorage.setItem('menus', JSON.stringify(menus))
    },
    async getSwordPools() {
      return queryPools().then((res) => {
        this.swordPoolInfo = res.data
      })
    },
    async getStorePoolStatus() {
      const res = await queryPoolState(this.poolid)
      const { status, data } = res.data
      if (status == 'success') {
        this.currentPoolState = data
        return data
      }
      throw status
    },
  },
  getters: {
    swordPools(state) {
      return state.swordPoolInfo?.pools || []
    },
    noticeMessages(state) {
      const { notice_message, notice_message_2 } = state.swordPoolInfo || {}
      return { notice_message, notice_message_2 }
    },
    activeRoutePath(state) {
      return state.activeRoute.path
    },
    transferLoadingCount(state) {
      return state.transferList.filter((f: { status: '0' }) => f.status == '0').length
    },
  },
})
