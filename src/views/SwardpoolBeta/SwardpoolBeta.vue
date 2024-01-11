<script setup lang="ts">
import { getBalanceByPoolAddress } from '@/services/sword'
import TransferTable from './components/TransferTable'
import np from 'number-precision'
import { useAppStore } from '@/store'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, Tickets, Refresh } from '@element-plus/icons-vue'
import SwapDialog from './components/SwapDialog.vue'
import icons from '@/config/payIcons'
import SwapTransferList from './components/SwapTransferList.vue'
import { SwordPool } from '@/services/types'
import { InitEchartParams, MoveTipParams } from './types'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'swap',
})

const appStore = useAppStore()
const { connectDpal, getSwordPools, getStorePoolStatus } = appStore
const showSwapDialog = ref(false)
const { poolid, address, transferLoadingCount, currentPoolState } = storeToRefs(appStore)
const currentPool = ref<Partial<SwordPool>>({})
const noticeMessage = computed(() => appStore.noticeMessages.notice_message)
const pools = computed(() => appStore.swordPools)
const loading = ref(false)
const listLoading = ref(false)
const balance = ref(0)
const tabValue = ref('0')
const showTransferDialog = ref(false)
const showCtrlPoolDialog = ref(false)
const isBalanceLoading = ref(false)
const transferSelectList = [
  { label: 'Pool Transactions', value: 0 },
  { label: 'Holder', value: 1 },
]
const transferSelect = reactive({
  value: transferSelectList[0].value,
  label: transferSelectList[0].label,
})
const showAddPoolsProtocol = ref(false)
const TransactionsListRef = ref()
const queryPoolStatusTimer = ref<number | undefined>(0)
const showUpdownVal = ref(0)
const showPriceVal = ref(0)
const isShowTip = ref(false)

const currentPrice = computed(() => {
  const { balanceA = 0, balanceB = 0 } = currentPoolState.value || {}
  const price = balanceB == 0 ? 0 : np.divide(balanceA, balanceB) || 0
  return {
    oldPrice: price,
    price: np.round(price, 6),
  }
})

const disabledSwap = computed(() => {
  const { balanceA = 0, balanceB = 0 } = currentPoolState.value || {}
  return currentPool.value.status != '0' || balanceA == 0 || balanceB == 0
})

const liqAvaiable = computed(() => currentPool.value.liq_avaiable)
const swapAvaiable = computed(() => currentPool.value.swap_avaiable)

async function queryPoolStatus(poolid: string, timer = false) {
  try {
    loading.value = true
    await getStorePoolStatus()
    if (!isShowTip.value) {
      showPriceVal.value = currentPrice.value.price
    }
  } finally {
    loading.value = false
    if (timer) {
      queryPoolStatusTimer.value = window.setTimeout(() => {
        queryPoolStatus(poolid, true)
      }, 3000)
    }
  }
}

function connect() {
  ElMessageBox.confirm('Is it connected to the DpalWallet?', 'Connect DpalWallet', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    customClass: 'messageBox-dialog',
  }).then(async () => {
    await connectDpal()
    getBalance(address.value)
  })
}

function changePool(pid: string) {
  if (pid === currentPool.value.poolid) {
    return
  }
  const pool = pools.value.find((p: any) => p.poolid === pid)
  if (pool) {
    currentPool.value = pool
    poolid.value = pid
    queryPoolStatus(pid)
  }
}

async function updatePool(timer = false) {
  if (currentPool.value?.poolid) {
    const pool = pools.value.find((p: any) => p.poolid === currentPool.value.poolid)
    poolid.value = pool.poolid
    currentPool.value = pool
  } else {
    poolid.value = pools.value[0].poolid
    currentPool.value = pools.value[0]
  }
  queryPoolStatus(poolid.value, timer)
}

async function getBalance(pooladdress: string) {
  isBalanceLoading.value = true
  await getSwordPools()
  updatePool()
  getBalanceByPoolAddress(pooladdress)
    .then(async (res: any) => {
      if (res.data[0]) {
        balance.value = res.data[0].balance
      }
    })
    .finally(() => (isBalanceLoading.value = false))
}

function paySuccess() {
  getBalance(address.value)
}

function init() {
  // 第一个参数开启实时金额
  updatePool()
  if (address.value) {
    getBalance(address.value)
  }
}

function getAddressTransList() {
  transferSelect.value = 3
  TransactionsListRef.value?.load()
}

function showAddPools() {
  if (!Number(localStorage.getItem('isAgree'))) {
    showAddPoolsProtocol.value = true
  } else {
    showCtrlPoolDialog.value = true
  }
}

function hideTip({ currentRate }: InitEchartParams) {
  isShowTip.value = false
  showPriceVal.value = currentPrice.value.price
  showUpdownVal.value = currentRate
}

function tipMove({ price, rate }: MoveTipParams) {
  showPriceVal.value = price
  showUpdownVal.value = rate
}

function echartInit({ currentRate }: InitEchartParams) {
  showUpdownVal.value = currentRate
}

onActivated(() => {
  init()
})
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24" class="mb-3">
      <dog-card>
        <div class="flex justify-between">
          <h4 class="mt-0" style="font-size: 18px">Swordpool</h4>
          <div class="text-center">
            <el-link href="https://github.com/dpalwallet/swordpool" style="font-size: 14px; font-weight: bold" target="_blank">
              <img class="token-icon" src="@/assets/img/logo32.png" alt="" />
              Swordpool Rule
            </el-link>
          </div>
        </div>
        <el-alert class="mb-3" v-if="noticeMessage" title="Notice" :description="noticeMessage" type="info" effect="dark" show-icon :closable="false" />
        <el-row style="margin-top: 12px">
          <el-col :span="24" :md="12">
            <el-row :span="24">
              <el-col>
                <div class="inline-block mb-2">
                  <el-dropdown class="inline-block mr-2" style="vertical-align: middle" trigger="click" @command="changePool">
                    <el-button>
                      <img class="token-icon rounded-full" v-if="currentPool.tokenA && icons[currentPool.tokenA]" :src="icons[currentPool.tokenA]" alt="" />{{ currentPool?.tokenA
                      }}<span class="split-word">/</span> <img class="token-icon rounded-full" v-if="currentPool.tokenB && icons[currentPool.tokenB]" :src="icons[currentPool.tokenB]" alt="" /><span
                        v-if="address"
                        >{{ balance }}&nbsp;</span
                      >{{ currentPool?.tokenB }}
                      <el-icon class="ml-2"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="item in pools" :key="item.poolid" :command="item.poolid" :disabled="item.status != 0">
                          <img class="token-icon rounded-full" v-if="icons[item.tokenA]" :src="icons[item.tokenA]" alt="" />{{ item?.tokenA }}<span class="split-word">/</span>
                          <img class="token-icon rounded-full" v-if="icons[item.tokenB]" :src="icons[item.tokenB]" alt="" />{{ item?.tokenB }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-badge style="font-size: 0" class="inline-block mr-2" :value="transferLoadingCount" :hidden="!transferLoadingCount" v-if="address">
                    <el-icon style="color: #666; font-size: 24px; cursor: pointer" @click="showTransferDialog = true"><Tickets /></el-icon>
                  </el-badge>
                </div>
                <template v-if="address && currentPool.pooladdress">
                  <div class="selectToken_bar inline-block">
                    <el-button :loading="isBalanceLoading" :icon="Refresh" circle @click="getBalance(address)" />
                    <!-- 生成环境需增加禁用属性 :disabled="!!noticeMessage" -->
                    <el-button class="mr-3" type="primary" :disabled="disabledSwap || !swapAvaiable" @click="showSwapDialog = true">Swap</el-button>
                    <el-button
                      :style="[!liqAvaiable ? { filter: 'grayscale(.5)' } : {}]"
                      style="margin: 0; background-color: #ba77ff; border: 1px solid #ba77ff"
                      type="warning"
                      :disabled="!liqAvaiable"
                      @click="showAddPools"
                      >Liquidity<em class="beta" style="color: #ba77ff">BETA</em></el-button
                    >
                  </div>
                </template>
                <div class="inline-block" style="font-size: 14px" v-else-if="currentPool.pooladdress && !address">
                  <div class="swap-pair_buy swap-pair_buy--connect size" @click="connect">Connect DpalWallet</div>
                </div>
              </el-col>
            </el-row>
            <el-row class="my-5" v-if="currentPoolState">
              <el-col :span="12" class="mb-2">
                <h4 style="font-size: 26px; margin: 0"><span style="margin-right: 6px; font-size: 30px">Ð</span>{{ np.round(showPriceVal, 6) }}</h4>
                <p class="m-0 mt-2" style="font-size: 16px; color: #777; vertical-align: middle">
                  <span style="margin-right: 4px">{{ Math.abs(np.round(showUpdownVal * 100, 2)) }}%</span>
                  <svg v-show="showUpdownVal >= 0" style="vertical-align: middle" width="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" fill="rgb(64, 180, 105)" />
                  </svg>
                  <svg v-show="showUpdownVal < 0" style="vertical-align: middle" width="18" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" fill="rgb(255, 90, 80)" />
                  </svg>
                </p>
              </el-col>
              <el-col :span="12" class="flex items-end mb-2">
                <el-statistic title="Processed Blocks" :value="currentPoolState?.blockno" />
              </el-col>
              <el-col :span="12">
                <el-statistic :title="`Current ${currentPool?.tokenA} Balance`" :precision="5" :value="+currentPoolState?.balanceA || 0" />
              </el-col>
              <el-col :span="12">
                <el-statistic :title="`Current ${currentPool?.tokenB} Balance`" :precision="5" :value="+currentPoolState?.balanceB || 0" />
              </el-col>
            </el-row>
          </el-col>
          <Kline @init="echartInit" @move-tip="tipMove" @hide-tip="hideTip"></Kline>
        </el-row>
      </dog-card>
    </el-col>
    <el-col :span="24">
      <dog-card v-loading="listLoading">
        <div class="mb-3">
          <DogTableMenuItem label="Pool Transactions" :value="0" @click="transferSelect.value = 0" :selected="transferSelect.value == 0" />
          <DogTableMenuItem label="Transactions" :value="3" @click="getAddressTransList" :selected="transferSelect.value == 3" />
        </div>
        <div>
          <TransferTable v-show="transferSelect.value == 0" :current-pool="currentPool as SwordPool"></TransferTable>
          <TransactionsList ref="TransactionsListRef" v-show="transferSelect.value == 3" :current-pool="currentPool as SwordPool"></TransactionsList>
        </div>
      </dog-card>
    </el-col>
  </el-row>
  <SwapDialog
    v-model:visible="showSwapDialog"
    :current-pool="currentPool as SwordPool"
    :current-pool-state="currentPoolState"
    @change-pool="changePool"
    :pools="pools"
    :loading="loading"
    @pay-success="paySuccess"
  />
  <SwapTransferList v-model:visible="showTransferDialog" :current-pool="currentPool" @close="tabValue = '0'"></SwapTransferList>
  <SwapCtrlPoolDialog v-model:visible="showCtrlPoolDialog" :current-pool="currentPool" :poolState="currentPoolState"></SwapCtrlPoolDialog>
  <AddPoolsProtocol v-model:visible="showAddPoolsProtocol" @confirm="showCtrlPoolDialog = true"></AddPoolsProtocol>
</template>
<style lang="scss" scoped>
:deep(.el-statistic__number) {
  font-size: 16px;
}

:deep(.doglink .doglink_link) {
  color: rgb(255, 194, 0);
}

.swordpool-info {
  margin-top: 12px;
  :deep(.dog-tabmenu) {
    margin-bottom: 12px;
  }
  :deep(.dog-card) {
    padding: 0;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
}
.token-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}
.split-word {
  padding: 0 5px;
}

section {
  line-height: 2;
  color: orange;
  span {
    color: #333;
  }
}
.swap-pair_buy {
  display: inline-block;
  text-align: center;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid #fff;
  background-color: #1e90ff;
  color: #fff;
  box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
  font-size: 13px;
  line-height: 1.5;
  margin-left: 6px;
  &--connect {
    background-color: rgb(255, 194, 0);
    color: #333;
    border: 1px solid #333;
  }
}
</style>
