<script setup lang="ts">
import { getBalanceByPoolAddress, getTokenInfo, queryPoolState, getKline } from '@/services/sword'
import TransferTable from './components/TransferTable'
import np from 'number-precision'
import { useAppStore } from '@/store'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, Clock, Refresh } from '@element-plus/icons-vue'
import SwapDialog from './components/SwapDialog.vue'
import icons from '@/config/payIcons'
import SwapTransferList from './components/SwapTransferList.vue'
import { SwordPool, TokenState } from '@/services/types'
import VChart from 'vue-echarts'
import ECharts from 'vue-echarts'
import moment from 'moment'

enum KlineType {
  _10m = '10m',
  _1h = '1h',
  _12h = '12h',
  _1d = '1d',
}

defineOptions({
  name: 'swap',
})

const appStore = useAppStore()
const { connectDpal } = appStore
const address = computed(() => appStore.address)
const transferLoadingCount = computed(() => appStore.transferLoadingCount)
const showSwapDialog = ref(false)
const poolid = ref('')
const currentPool = ref<Partial<SwordPool>>({})
const currentPoolState = ref<TokenState>()
const tokenInfo = ref({})
const noticeMessage = computed(() => appStore.noticeMessages.notice_message)
const pools = computed(() => appStore.swordPools)
const loading = ref(false)
const listLoading = ref(false)
const balance = ref(0)
const tabValue = ref('0')
const showTransferDialog = ref(false)
const showCtrlPoolDialog = ref(false)
const isBalanceLoading = ref(false)
const echatLoading = ref(false)
const transferSelectList = [
  { label: 'Pool Transactions', value: 0 },
  { label: 'Holder', value: 1 },
]
const transferSelect = reactive({
  value: transferSelectList[0].value,
  label: transferSelectList[0].label,
})

const klineOpts = [
  {
    label: '10m',
    limit: 400,
  },
  {
    label: '1h',
    limit: 400,
  },
  {
    label: '12h',
    limit: 400,
  },
  {
    label: '1d',
    limit: 400,
  },
]

const currentKline = ref(klineOpts[0])
const curKlinePoint = ref()

const currentPrice = computed(() => {
  const { balanceA = 0, balanceB = 0 } = currentPoolState.value || {}
  const price = np.divide(balanceA, balanceB) || 0
  return {
    oldPrice: price,
    price: np.round(price, 6),
  }
})

const queryPoolStatusTimer = ref<number | undefined>(0)

async function queryPoolStatus(poolid: string, timer = false) {
  try {
    loading.value = true
    const res = await queryPoolState(poolid)
    const { status, data } = res.data
    if (status == 'success') {
      currentPoolState.value = data
      if (!isShowTip.value) {
        showPriceVal.value = currentPrice.value.price
      }
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

function changePool(poolid: string) {
  if (poolid === currentPool.value.poolid) {
    return
  }
  const pool = pools.value.find((p: any) => p.poolid === poolid)
  queryPoolStatus(poolid)
  if (pool) {
    currentPool.value = pool
  }
}

function getBalance(pooladdress: string) {
  isBalanceLoading.value = true
  queryPoolStatus(poolid.value)
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

const vchart = ref(ECharts)
const showUpdownVal = ref(0)
const showPriceVal = ref(0)
const isShowTip = ref(false)

function init() {
  poolid.value = pools.value[0].poolid
  currentPool.value = pools.value[0]
  // 第二个参数开启实时金额
  queryPoolStatus(poolid.value, false)
  if (address.value) {
    getBalance(address.value)
  }
}

getTokenInfoHandle.isLoaded = false
function getTokenInfoHandle() {
  if (getTokenInfoHandle.isLoaded) {
    transferSelect.value = 2
    return
  }
  listLoading.value = true
  getTokenInfo()
    .then((res) => {
      tokenInfo.value = res.data[0]
      getTokenInfoHandle.isLoaded = true
      transferSelect.value = 2
    })
    .finally(() => {
      listLoading.value = false
    })
}
const TransactionsListRef = ref()
const TransferTop500Ref = ref()
getHolderData.loaded = false
async function getHolderData() {
  if (getHolderData.loaded) {
    transferSelect.value = 1
    return
  }
  if (TransferTop500Ref.value) {
    listLoading.value = true
    TransferTop500Ref.value
      .load()
      .then((result: any) => {
        if (result.status == 'success') {
          transferSelect.value = 1
          getHolderData.loaded = true
        }
      })
      .finally(() => {
        listLoading.value = false
      })
  }
}

onActivated(() => {
  init()
})

const klineData = ref<any[]>([])

async function loadKline() {
  const { label, limit } = currentKline.value
  try {
    echatLoading.value = true
    const res = await getKline({
      interval: label,
      limit: limit,
    })
    let data = res.data.data
    let currentTime = moment()
    let currentData = [] as any[]
    let timeType = 'hours'
    let timeNum = 1

    data = klineData.value = data

    if (label === KlineType._1h) {
      currentTime = moment().minute(0).second(0)
      timeType = 'hours'
      timeNum = 1
    } else if (label === KlineType._12h) {
      currentTime = moment().minute(0).second(0)
      timeType = 'hours'
      timeNum = 12
    } else if (label === KlineType._10m) {
      currentTime = moment()
        .minute(parseInt(String(moment().minute() / 10)) * 10)
        .second(0)
      timeNum = 10
      timeType = 'minutes'
    } else {
      timeNum = 1
      timeType = 'days'
    }

    const xLabels = Array.from({ length: limit }).map((_, i) => {
      let formatTime = currentTime.format('YYYY-MM-DD HH:mm')
      if (label == KlineType._1d) {
        formatTime = currentTime.format('YYYY-MM-DD')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      currentTime = currentTime.subtract(timeNum, timeType)

      const prev = data[i + 1]
      const cur = data[i]
      const curPrice = cur?.c || 0
      const prevPrice = prev?.c || 0

      data[i] = cur ? Object.assign(cur, { r: (curPrice - prevPrice) / prevPrice }) : cur

      currentData[i] = {
        custom: cur,
        value: [formatTime, curPrice],
      }

      return formatTime
    })
    showUpdownVal.value = klineData.value[0]?.r || 0
    loadTransferData(xLabels.reverse(), currentData.reverse())
  } finally {
    echatLoading.value = false
  }
}

function hideHideTipOrPointerEvent(e: Event) {
  if ((e.target as HTMLElement).tagName != 'CANVAS') {
    vchart.value.dispatchAction({
      type: 'hideTip',
    })
    vchart.value.dispatchAction({
      type: 'updateAxisPointer',
      currTrigger: 'leave',
    })
  }
}

onMounted(() => {
  document.documentElement.addEventListener('touchstart', hideHideTipOrPointerEvent)
  loadKline()
})

onUnmounted(() => {
  document.documentElement.removeEventListener('touchstart', hideHideTipOrPointerEvent)
})

function loadTransferData(xLabels: any[], data: any[]) {
  vchart.value.setOption(
    {
      title: {
        show: false,
      },
      grid: {
        left: 40,
        right: 10,
        top: 20,
        bottom: 20,
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
          minSpan: 50,
          start: 0,
          end: 100,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const opts = params[0]
          const [date, value] = opts.value
          const { custom } = opts.data
          curKlinePoint.value = custom
          showPriceVal.value = value
          showUpdownVal.value = custom?.r || 0
          return `${date} Ð ${np.round(value, 6)}`
        },
      },
      xAxis: {
        type: 'category',
        show: true,
        data: xLabels,
        splitLine: {
          show: false,
        },
        scale: true,
        axisLabel: {
          showMinLabel: false,
          showMaxLabel: false,
          color: '#aeaeae',
          fontSize: 10,
          formatter(value: string) {
            const { label } = currentKline.value
            return label == KlineType._1d ? value : value.slice(0, -6)
          },
        },
        axisTick: {
          length: 2,
          lineStyle: {
            color: '#aeaeae',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#aeaeae',
          },
        },
      },
      yAxis: {
        show: true,
        type: 'value',
        axisLabel: {
          showMinLabel: false,
          color: '#aeaeae',
          fontSize: 10,
        },
        scale: true,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'price',
          type: 'line',
          showSymbol: false,
          animation: false,
          lineStyle: {
            color: '#ba77ff',
          },
          data,
        },
      ],
    },
    true
  )
}

async function changeKline(k: any) {
  currentKline.value = k
  loadKline()
}

function hideTipHandle() {
  isShowTip.value = false
  showPriceVal.value = currentPrice.value.price
  if (klineData.value.length > 0) {
    showUpdownVal.value = klineData.value[0]?.r || 0
  }
}

function getAddressTransList() {
  transferSelect.value = 3
  TransactionsListRef.value?.load()
}
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
                        <el-dropdown-item v-for="item in pools" :key="item.poolid" :command="item.poolid" :disabled="!!noticeMessage || item.status != 0">
                          <img class="token-icon rounded-full" v-if="icons[item.tokenA]" :src="icons[item.tokenA]" alt="" />{{ item?.tokenA }}<span class="split-word">/</span>
                          <img class="token-icon rounded-full" v-if="icons[item.tokenB]" :src="icons[item.tokenB]" alt="" />{{ item?.tokenB }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-badge style="font-size: 0" class="inline-block mr-2" :value="transferLoadingCount" :hidden="!transferLoadingCount" v-if="address">
                    <el-icon style="color: #666; font-size: 24px; cursor: pointer" @click="showTransferDialog = true"><Clock /></el-icon>
                  </el-badge>
                </div>
                <template v-if="address && currentPool.pooladdress">
                  <div class="selectToken_bar inline-block">
                    <el-button :loading="isBalanceLoading" :icon="Refresh" circle @click="getBalance(address)" />
                    <!-- 生成环境需增加禁用属性 :disabled="!!noticeMessage" -->
                    <el-button class="mr-3" type="primary" :disabled="!!noticeMessage || currentPool.status != '0'" @click="showSwapDialog = true">Swap</el-button>
                    <el-button style="margin: 0" type="warning" :disabled="!!noticeMessage" @click="showCtrlPoolDialog = true">+ Add Liquidity</el-button>
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
                <el-statistic :title="`Current ${currentPool?.tokenA} Balance`" :precision="5" :value="+currentPoolState?.balanceA" />
              </el-col>
              <el-col :span="12">
                <el-statistic :title="`Current ${currentPool?.tokenB} Balance`" :precision="5" :value="+currentPoolState?.balanceB" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" :md="12" v-loading="echatLoading">
            <div class="flex justify-between items-center mb-4">
              <ul class="flex text-xs font-bold">
                <li
                  class="inline-block w-8 text-center rounded-md cursor-pointer py-2 mp ml-2 hover:bg-yellow-300"
                  :style="[currentKline.label == k.label ? { 'background-color': 'rgb(255, 194, 0)', color: '#fff' } : {}]"
                  v-for="k in klineOpts"
                  @click="changeKline(k)"
                  :key="k.label"
                >
                  {{ k.label }}
                </li>
              </ul>
              <div class="text-center">
                <el-link href="https://dogim.defieyes.io/" style="font-size: 12px; color: #a8a8a8" target="_blank">
                  <!-- <img class="token-icon" src="@/assets/img/logo32.png" alt="" /> -->
                  dogim.defieyes.io
                </el-link>
              </div>
            </div>
            <el-row
              class="text-xs font-bold text-center"
              flex
              justify="center"
              :gutter="12"
              style="min-height: 20px"
              :style="[{ color: (curKlinePoint?.r || 0) < 0 ? 'rgb(255, 90, 80)' : 'rgb(64, 180, 105)', visibility: curKlinePoint ? 'visible' : 'hidden' }]"
            >
              <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
                <span>O</span>:<span>{{ np.round(curKlinePoint?.o || 0, 4) }}</span>
              </el-col>
              <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
                <span>H</span>:<span>{{ np.round(curKlinePoint?.h || 0, 4) }}</span>
              </el-col>
              <el-col class="mb-2" :span="3" :xs="8" :md="8" :lg="3">
                <span>L</span>:<span>{{ np.round(curKlinePoint?.l || 0, 4) }}</span>
              </el-col>
              <el-col class="mb-2" :span="6" :xs="{ span: 12 }">
                <span>C</span>:<span>{{ np.round(curKlinePoint?.c || 0, 4) }}</span>
                <span class="ml-2">{{ (curKlinePoint?.r || 0) < 0 ? '-' : '+' }}{{ Math.abs(np.round((curKlinePoint?.r || 0) * 100, 2)) }}%</span>
              </el-col>
              <el-col class="mb-2" :span="3" :xs="12">
                <span>Vol</span>:<span>{{ np.round(curKlinePoint?.tav || 0, 4) }}</span>
              </el-col>
            </el-row>
            <v-chart ref="vchart" class="chart" autoresize @hideTip="hideTipHandle" />
          </el-col>
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
  <SwapCtrlPoolDialog v-model:visible="showCtrlPoolDialog" :current-pool="currentPool"></SwapCtrlPoolDialog>
</template>
<style lang="scss" scoped>
:deep(.el-statistic__number) {
  font-size: 16px;
}

:deep(.doglink .doglink_link) {
  color: rgb(255, 194, 0);
}

.chart {
  height: 200px;
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
