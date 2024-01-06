<script setup lang="ts">
import SwapInput from '@/views/Swap/components/SwapInput.vue'
import icons from '@/config/payIcons'
import { Back, CaretRight, Right } from '@element-plus/icons-vue'
import { omitCenterString } from '@/utils'
import { consumeToken } from './TransferTable'
import { getLiqPools, getTransferList } from '@/services/sword'
import { useAppStore } from '@/store'
import { ElMessage } from 'element-plus'
import { calculateOutA, calculateOutB } from '../computePrice'
// import { PoolCtrlType } from '../types.d'

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
const appStore = useAppStore()
const transferLoadingCount = computed(() => appStore.transferLoadingCount)
const { transferD20, multiDoge, doge } = useDoge()
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
const poolsList = ref<any>([])
const isAToken = ref(true)
const currentPackPool = ref<any>({})
const loading = ref(false)
const transferListLoading = ref(false)
const showTransferDialog = ref(false)

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
    inputDialogWidth.value = Math.min(maxInputDialogWidth, window.screen.width - 20)
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
    poolsList.value = res.data?.data || []
  } finally {
    loading.value = false
  }
}

async function addPool() {
  doType.value = CtrlType.Add
}

// async function isAddLiq(type = 1) {
//   const res = await isCheckAddLiq({
//     address: address.value,
//     type,
//   })
//   return res.data.data ? Promise.resolve(true) : Promise.reject(false)
// }

async function removePool(p: any) {
  const T_TYPE_REMOVELIQ = 'REMOVELIQ'
  const { removeAmount, removeTokenALiqAdr, removeTokenBLiqAdr } = currentPool.value
  const { liqtype } = p
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
    if (liqtype == currentPool.value.tokenA) {
      rs = await doge(removeAmount, removeTokenALiqAdr, 'remove lp')
    } else {
      rs = await doge(removeAmount, removeTokenBLiqAdr, 'remove lp')
    }

    if (rs?.txid) {
      ElMessage({
        message: 'Successful!',
        type: 'success',
      })

      appStore.updateTransferList({
        txid: rs.txid,
        status: 2,
        swapType: T_TYPE_REMOVELIQ,
        inTokenA: 0,
        inTokenB: 0,
        outTokenA: 0,
        outTokenB: 0,
        date: dateFormat(new Date()),
      })

      console.log('删除流动性：txid: ' + rs.txid)
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

  const T_TYPE_ADDLIQ_LP = 'ADDLIQ_LP'
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

  console.log('添加流动性：txid: ' + id)
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
        <h2 class="swap-header m-0 pt-3 ml-3">Liquidity</h2>
        <el-divider />
        <div class="flex justify-end mt-4">
          <DogeButton type="warn" @click="addPool">+ Add</DogeButton>
          <el-badge :value="transferLoadingCount" :hidden="!transferLoadingCount">
            <DogeButton @click="showTransferDialog = true">History</DogeButton>
          </el-badge>
        </div>
        <div class="pools">
          <div class="pools-item mt-4" v-for="pi in poolsList" :key="pi.addBlockno">
            <div class="pools-item_avator flex items-center">
              <el-image style="width: 48px; height: 48px; border-radius: 12px" :src="icons[pi.liqtype]"></el-image>
            </div>
            <div class="pools-item_info">
              <div class="pools-line">
                <div class="pools-line_label">Type:</div>
                <span class="pools-line_item">{{ pi.liqtype }}</span>
              </div>
              <div class="pools-line">
                <div class="pools-line_label">blockNo:</div>
                <span class="pools-line_item">{{ pi.status == 1 ? pi.addBlockno : pi.removeBlockno }}</span>
              </div>
              <div class="pools-line">
                <div class="pools-line_label">Address:</div>
                <span class="pools-line_item">
                  <DogLink is-copy :label="omitCenterString(pi.address, 12)" :value="pi.address"></DogLink>
                </span>
              </div>
            </div>
            <div class="flex flex-col flex-1 items-center justify-center mx-5">
              <div>
                <div class="pools-line mb-3">
                  <div class="pools-line_label">Status:</div>
                  <span class="pools-line_item"
                    ><el-tag :type="pi.status == 1 ? 'success' : 'danger'">{{ pi.status == 1 ? 'Add' : 'Reduce' }}</el-tag></span
                  >
                </div>
                <div class="flex flex-1 justify-center items-center whitespace-nowrap">
                  <p class="m-0">
                    <span>In: </span>
                    <span class="text-sm text-black">{{ consumeToken('', pi.inTokenA, pi.inTokenB, currentPool.tokenA, currentPool.tokenB) }}</span>
                  </p>
                  <el-icon style="font-size: 14px; margin: 0 12px"><Right /></el-icon>
                  <p class="m-0">
                    <span>Out: </span>
                    <span class="text-sm text-black">{{ consumeToken('', pi.outTokenA, pi.outTokenB, currentPool.tokenA, currentPool.tokenB) }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="pools-line">
              <DogeButton type="warn" @click="removePool(pi)" style="margin: 0; line-height: 1.5; background-color: rgb(186, 119, 255)" v-if="pi.status == 1">Remove</DogeButton>
            </div>
          </div>
          <el-empty v-if="poolsList.length < 1" description="To add liquidity." />
        </div>
      </template>
      <template v-else-if="doType == CtrlType.Add">
        <div class="flex items-center pt-2">
          <el-icon class="cursor-pointer p-2" @click="doType = CtrlType.Nothing"><Back /></el-icon>
          <h2 class="swap-header m-0 ml-2">Add liquidity</h2>
        </div>
        <el-divider />
        <div class="flex justify-center">
          <div class="swappool-wrapper mt-5">
            <div class="flex mb-4">
              <div
                class="flex items-center py-2 px-4 rounded-3xl overflow-hidden bg-white border border-gray-400 border-solid cursor-pointer"
                :style="[isAToken ? { border: '1px solid #ffa21e', backgroundColor: '#ffa21e40' } : {}]"
                @click="isAToken = true"
              >
                <img class="w-6 mr-2" style="border-radius: 50%" :src="icons.doge" alt="" />
                doge
              </div>
              <div
                class="flex items-center ml-3 py-2 px-4 rounded-3xl overflow-hidden bg-white border border-gray-400 border-solid cursor-pointer"
                @click="isAToken = false"
                :style="[!isAToken ? { border: '1px solid #ffa21e', backgroundColor: '#ffa21e40' } : {}]"
              >
                <img class="w-6 mr-2" style="border-radius: 50%" :src="icons.dogim" alt="" />
                dogim
              </div>
            </div>
            <div style="min-height: 200px">
              <SwapInput v-model="token.amountA" title="Add doge" name="pay" :price="4" :min="currentPool.minLiqTokenA" swap-type="SWAP_A_B" v-if="isAToken">
                <template #right>
                  <div>
                    <div class="limit-btn">Min: {{ currentPool.minLiqTokenA }}</div>
                  </div>
                </template>
              </SwapInput>
              <SwapInput disabled v-model="token.amountB" :price="0" :min="currentPool.minLiqTokenB" title="Add dogim" name="pay" swap-type="SWAP_A_B" @selectToken="selectToken" v-else>
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
  <SwapSelectTokenDialog v-model:visible="showSelectTokenDialog" :list="transferList" @select="setSelectToken" :loading="transferListLoading" :icon="icons.dogim"></SwapSelectTokenDialog>
</template>

<style lang="scss" scoped>
.swap-pool-dialog {
  background-color: #fff;
}
.swap-header {
  font-size: 16px;
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

.pools {
  overflow: auto;
  font-size: 12px;
  .pools-item {
    position: relative;
    display: flex;
    box-sizing: border-box;
    padding: 12px 15px;
    background-color: rgb(255, 240, 240);
    border-radius: 13px;

    &_avator {
      margin-right: 12px;
    }
    &_info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .pools-line {
    display: flex;
    align-items: center;
    width: max-content;
    &_label {
      width: 5em;
      margin-right: 12px;
    }
  }
}
</style>
