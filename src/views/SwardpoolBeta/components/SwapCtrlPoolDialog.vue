<script setup lang="ts">
import { getTokenIcon } from '@/config/payIcons'
import { CaretRight, RefreshRight } from '@element-plus/icons-vue'
import { consumeToken } from './TransferTable'
import { computedExpcetout, getLiqPools, getTransferList, queryTransferStatus } from '@/services/sword'
import { useAppStore } from '@/store'
import { ElMessage } from 'element-plus'
import { calculateOutA, calculateOutB } from '../computePrice'
import { storeToRefs } from 'pinia'
import { oversellStyle } from '../tools'
import np from 'number-precision'

enum CtrlType {
  Nothing,
  Add,
  Remove,
}

const props = withDefaults(
  defineProps<{
    visible: boolean
    currentPool: any
    poolState: any
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'close'): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

const T_TYPE_REMOVELIQ = 'REMOVELIQ'

const appStore = useAppStore()
const { getStorePoolStatus } = appStore
const { transferLoadingCount, currentPoolState } = storeToRefs(appStore)
const transferHistoryList = computed(() => appStore.transferList)
const { transferD20, multiDoge, doge, isMultiDoge } = useDoge()
const currentPool = computed(() => props.currentPool)
const poolState = computed(() => props.poolState)
const maxInputDialogWidth = 1000
const inputDialogWidth = ref(maxInputDialogWidth)
const doType = ref<CtrlType>(CtrlType.Nothing)
const showSelectTokenDialog = ref(false)
const token = reactive({
  amountA: 0,
  amountB: 0,
})
const transferList = ref<any>([])
const isAToken = ref(true)
const currentPackPool = ref<any>({})
const loading = ref(false)
const transferListLoading = ref(false)
const showTransferDialog = ref(false)
const list = reactive<{ [k: string]: any[] }>({
  doge: [],
  token: [],
  all: [],
})

const address = computed(() => appStore.address)
const isDisabledAddBtn = computed(() => {
  if (isAToken.value) {
    return token.amountA < currentPool.value.minLiqTokenA
  } else {
    return token.amountB < currentPool.value.minLiqTokenB
  }
})

watch(visible, async (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, document.documentElement.offsetWidth - 20)
    if (!isMultiDoge()) {
      visible.value = false
      return ElMessageBox.confirm('DpalWallet version is too low.', 'Install DpalWallet', {
        confirmButtonText: 'Upgrade',
        cancelButtonText: 'Cancel',
        customClass: 'messageBox-dialog',
      })
        .then(() => {
          window.open('https://dpalwallet.io')
        })
        .catch(() => {})
    }
    queryPools()
  } else {
    doType.value = CtrlType.Nothing
    currentPackPool.value = {}
  }
})

watch(doType, (doType) => {
  if (doType == CtrlType.Nothing) {
    Object.assign(token, {
      amountA: 0,
      amountB: 0,
    })
    isAToken.value = true
  }
})

watch(isAToken, () => {
  Object.assign(token, {
    amountA: 0,
    amountB: 0,
  })
  currentPackPool.value = {}
})

async function queryPools() {
  loading.value = true
  try {
    const res = await getLiqPools({
      address: address.value,
    })

    await getStorePoolStatus()

    const data = res.data?.data
    const { balanceA, balanceB } = currentPoolState.value

    if (data) {
      list.all = data.map((pi: any) => {
        return Object.assign(pi, {
          isRemove: false,
          in: consumeToken('', pi.inTokenA, pi.inTokenB, currentPool.value.tokenA, currentPool.value.tokenB),
          out: 0,
          loading: true,
          outProportion: 0,
        })
      })

      list.all.sort((a: any, b: any) => a.addBlockno - b.addBlockno)

      list.doge = list.all.filter((pi: any) => pi.liqtype === 'doge')
      list.token = list.all.filter((pi: any) => pi.liqtype !== 'doge')

      list.doge[0] && (list.doge[0].isRemove = true)
      list.token[0] && (list.token[0].isRemove = true)

      if (list.doge.length < 1 || list.token.length < 1) {
        const oldTokens = list.doge.length < 1 ? list.token : list.doge
        list.doge = []
        list.token = []
        oldTokens.forEach((t: any, i) => (i % 2 == 0 ? list.doge.push(t) : list.token.push(t)))
      }

      list.all.forEach(async (pi: any) => {
        const out = await computedOut(pi.inTokenA == 0 ? pi.inTokenB : pi.inTokenA, pi.liqtype)
        const outProportion = (pi.liqtype === 'doge' ? pi.inTokenA / balanceA : pi.inTokenB / balanceB) || 1
        Object.assign(pi, {
          out,
          loading: false,
          outProportion,
          outProportionFormat: np.round(outProportion * 100, 4) + '%',
          bg: oversellStyle(outProportion),
        })
      })
    }
  } finally {
    loading.value = false
  }
}

async function addPool() {
  doType.value = CtrlType.Add
}

async function isDisabledRemove() {
  const removeLiqs = transferHistoryList.value.filter((t: any) => t.swapType.includes(T_TYPE_REMOVELIQ) && t.status == 0)

  if (removeLiqs.length < 1) {
    return
  }

  return Promise.all(
    removeLiqs.map(async (d: any) => {
      const res = await queryTransferStatus(d.txid)
      const resData = res.data.data

      if (res.data.status == 'success' && resData?.hash) {
        return true
      }

      throw 0
    })
  )
}

// async function isAddLiq(type = 1) {
//   const res = await isCheckAddLiq({
//     address: address.value,
//     type,
//   })
//   return res.data.data ? Promise.resolve(true) : Promise.reject(false)
// }

async function computedOut(amount: number, tokenName: string) {
  const { balanceA, balanceB } = poolState.value
  const { tokenA } = currentPool.value

  try {
    const res = await computedExpcetout({
      amount,
      type: tokenName == tokenA ? 1 : 2,
      balance_a: balanceA,
      balance_b: balanceB,
    })

    return res.data.data
  } catch {
    return 'UNKNOWN'
  }
}

async function removePool(p: any) {
  const { removeAmount, removeTokenALiqAdr, removeTokenBLiqAdr } = currentPool.value
  const { liqtype, out } = p
  let rs: any = {}

  loading.value = true

  // try {
  //   await isAddLiq(liqtype == currentPool.value.tokenA ? PoolCtrlType.removea : PoolCtrlType.removeb)
  // } catch {
  //   return ElMessage({
  //     message: 'The pool cannot be removed.!',
  //     type: 'error',
  //   })
  // }

  try {
    await isDisabledRemove()
  } catch {
    loading.value = false
    return ElMessage({
      message: 'There is an ongoing liquidity removal being processed, please wait for the completion.',
      type: 'error',
    })
  }

  try {
    const isTokenA = liqtype == currentPool.value.tokenA
    let tokenLetter = 'A'

    if (isTokenA) {
      rs = await doge(removeAmount, removeTokenALiqAdr, 'remove lp')
    } else {
      rs = await doge(removeAmount, removeTokenBLiqAdr, 'remove lp')
      tokenLetter = 'B'
    }

    if (rs?.txid) {
      const outAmount = parseFloat(out) || 1

      ElMessage({
        message: 'Successful!',
        type: 'success',
      })

      appStore.updateTransferList({
        txid: rs.txid,
        status: 0,
        swapType: T_TYPE_REMOVELIQ + '_' + tokenLetter,
        inTokenA: 0,
        inTokenB: 0,
        outTokenA: !isTokenA ? outAmount : 0,
        outTokenB: isTokenA ? outAmount : 0,
        date: dateFormat(new Date()),
      })
    } else {
      ElMessage({
        message: 'Failed!',
        type: 'error',
      })
    }

    loading.value = false
  } catch {
    loading.value = false
  }
}

async function add() {
  if (isDisabledAddBtn.value) {
    return
  }

  const T_TYPE_ADDLIQ_LP = 'ADDLIQ'
  const { amountA, amountB } = token
  const { txid } = currentPackPool.value
  const { poolid, addTokenALiqAdr, pooladdress, addfees, tokenB } = currentPool.value
  const { balanceA, balanceB } = poolState.value
  let id = ''

  loading.value = true

  // try {
  //   await isAddLiq(isAToken.value ? PoolCtrlType.adda : PoolCtrlType.addb)
  // } catch {
  //   loading.value = false
  //   return ElMessage({
  //     message: 'You can only add up to 2 different lp!',
  //     type: 'error',
  //   })
  // }

  try {
    if (isAToken.value) {
      id = await multiDoge([pooladdress, addTokenALiqAdr].join(), [amountA, addfees].join(), 'add doge LP')
      appStore.updateTransferList({
        txid: id,
        status: 0,
        swapType: T_TYPE_ADDLIQ_LP,
        inTokenA: amountA,
        inTokenB: 0,
        outTokenA: 0,
        outTokenB: calculateOutB(amountA, balanceA, balanceB, 0),
        date: dateFormat(new Date()),
      })
    } else {
      id = await transferD20(txid, currentPool.value.pooladdress, amountB, tokenB, '1', true, poolid)
      appStore.updateTransferList({
        txid: id,
        status: 0,
        swapType: T_TYPE_ADDLIQ_LP,
        inTokenA: 0,
        inTokenB: amountB,
        outTokenA: calculateOutA(amountB, balanceA, balanceB, 4),
        outTokenB: 0,
        date: dateFormat(new Date()),
      })
    }
    ElMessage({
      message: 'Successful!',
      type: 'success',
    })
    loading.value = false
    doType.value = CtrlType.Nothing
    queryPools()
  } catch {
    ElMessage({
      message: 'Failed!',
      type: 'error',
    })
    loading.value = false
  }
}

async function selectToken() {
  showSelectTokenDialog.value = true
  try {
    transferListLoading.value = true
    const res = await getTransferList(address.value)
    const resData = res.data
    if (resData.status == 'success') {
      transferList.value = resData.data.transfer_list
    }
  } finally {
    transferListLoading.value = false
  }
}

function setSelectToken(transToken: any) {
  currentPackPool.value = transToken
  token.amountB = transToken.amt
  showSelectTokenDialog.value = false
}
</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth" @close="emit('close')">
    <div class="swap-pool-dialog p-5" style="min-height: 500px" v-loading="loading">
      <template v-if="doType == CtrlType.Nothing">
        <DialogTitle title="Liquidity"></DialogTitle>
        <div class="flex justify-end mt-4">
          <DogeButton type="warn" @click="addPool">+ Supply</DogeButton>
          <DogeButton @click="queryPools">
            <el-icon style="vertical-align: middle"><RefreshRight /></el-icon>
            <span class="ml-1" style="vertical-align: middle">Refresh</span>
          </DogeButton>
          <el-badge :value="transferLoadingCount" :hidden="!transferLoadingCount">
            <DogeButton @click="showTransferDialog = true">History</DogeButton>
          </el-badge>
        </div>
        <div class="liq flex flex-wrap justify-between mx-12 mt-4">
          <div class="liq-card w-6/12 mr-2">
            <LiqItem
              v-for="pi in list.doge"
              :key="pi.addBlockno"
              :item="pi"
              :bg="pi.bg"
              :icon="getTokenIcon(pi.liqtype)"
              @remove="removePool"
            ></LiqItem>
          </div>
          <div class="liq-card w-6/12">
            <LiqItem
              v-for="pi in list.token"
              :key="pi.addBlockno"
              :item="pi"
              :bg="pi.bg"
              :icon="getTokenIcon(pi.liqtype)"
              @remove="removePool"
            ></LiqItem>
          </div>
          <el-empty class="w-full" v-if="!list.doge.length && !list.token.length" description="To add liquidity." />
        </div>
      </template>
      <template v-else-if="doType == CtrlType.Add">
        <DialogTitle title="Supply" back @back="doType = CtrlType.Nothing"></DialogTitle>
        <div class="flex justify-center">
          <div class="swappool-wrapper mt-5">
            <div class="flex mb-4">
              <div
                class="flex items-center py-2 px-4 rounded-3xl overflow-hidden bg-white border border-gray-400 border-solid cursor-pointer"
                :style="[isAToken ? { border: '1px solid #ffa21e', backgroundColor: '#ffa21e40' } : {}]"
                @click="isAToken = true"
              >
                <img class="w-6 mr-2" style="border-radius: 50%" :src="getTokenIcon(currentPool.tokenA)" alt="" />
                {{ currentPool.tokenA }}
              </div>
              <div
                class="flex items-center ml-3 py-2 px-4 rounded-3xl overflow-hidden bg-white border border-gray-400 border-solid cursor-pointer"
                @click="isAToken = false"
                :style="[!isAToken ? { border: '1px solid #ffa21e', backgroundColor: '#ffa21e40' } : {}]"
              >
                <img class="w-6 mr-2" style="border-radius: 50%" :src="getTokenIcon(currentPool.tokenB)" alt="" />
                {{ currentPool.tokenB }}
              </div>
            </div>
            <div style="min-height: 200px">
              <SwapInput
                v-model="token.amountA"
                :title="`Add ${currentPool.tokenA}`"
                name="pay"
                :price="4"
                :min="currentPool.minLiqTokenA"
                swap-type="SWAP_A_B"
                v-if="isAToken"
              >
                <template #right>
                  <div>
                    <div class="limit-btn">Min: {{ currentPool.minLiqTokenA }}</div>
                  </div>
                </template>
              </SwapInput>
              <SwapInput
                disabled
                v-model="token.amountB"
                :price="0"
                :min="currentPool.minLiqTokenB"
                :title="`Add ${currentPool.tokenB}`"
                name="pay"
                swap-type="SWAP_A_B"
                @selectToken="selectToken"
                v-else
              >
                <template #right>
                  <div class="flex flex-col items-end">
                    <DogeButton type="warn" border-color="#fff" @click="selectToken">
                      <div class="flex items-center text-sm">
                        Select<el-icon><CaretRight /></el-icon>
                      </div>
                    </DogeButton>
                    <div class="flex">
                      <div class="limit-btn">Min: {{ currentPool.minLiqTokenB }}</div>
                    </div>
                  </div>
                </template>
              </SwapInput>
            </div>
            <div class="swap-sub-btn" :class="[isDisabledAddBtn && 'swap-sub-btn--disabled']" @click="add">Add</div>
          </div>
        </div>
      </template>
    </div>
  </el-dialog>
  <SwapTransferList v-model:visible="showTransferDialog" :current-pool="currentPool"></SwapTransferList>
  <SwapSelectTokenDialog
    v-model:visible="showSelectTokenDialog"
    :list="transferList"
    @select="setSelectToken"
    :loading="transferListLoading"
    :icon="getTokenIcon(currentPool.tokenB)"
  ></SwapSelectTokenDialog>
</template>

<style lang="scss" scoped>
.swap-pool-dialog {
  background-color: #fff;
}
.swappool-wrapper {
  width: 100%;
  max-width: 650px;
  padding: 1% 0;
  border-radius: 30px;
}

.limit-btn {
  padding: 6px 12px;
  margin: 5px 0;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  background-color: #d6d6d6;
}

.liq {
  @media screen and (max-width: 800px) {
    margin-left: 0;
    margin-right: 0;
  }
}

.liq-card {
  width: calc(50% - 0.5rem);
  @media screen and (max-width: 800px) {
    width: 100%;
    margin-right: 0;
  }
}
</style>
