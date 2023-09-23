<script setup lang="ts">
import { getBalanceByPoolAddress, queryPools, queryPoolState } from '@/services/sword'
import TransferTable from './components/TransferTable'
import np from 'number-precision'
import { useAppStore } from '@/store'
import { ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { ArrowDown, Refresh } from '@element-plus/icons-vue'
import SwapDialog from './components/SwapDialog.vue'
import icons from '@/config/payIcons'
import SwapTransferList from './components/SwapTransferList.vue'
import TransferTop500 from './components/TransferTop500'
import { SwordPool, TokenState } from '@/services/types'

defineOptions({
  name: 'swap',
})

const appStore = useAppStore()
const { connectDpal } = appStore
const address = computed(() => appStore.address)
const transferLoadingCount = computed(() => appStore.transferLoadingCount)
const showSwapDialog = ref(false)
const pools = ref<any[]>([])
const poolid = ref('')
const currentPool = ref<Partial<SwordPool>>({})
const currentPoolState = ref<TokenState>()
const noticeMessage = ref('')
const loading = ref(false)
const balance = ref(0)
const tabValue = ref('0')
const showTransferDialog = ref(false)
const isBalanceLoading = ref(false)
const transferSelectList = [
  { label: 'Pool Transactions', value: 0 },
  { label: 'Holder', value: 1 },
]
const transferSelect = reactive({
  value: transferSelectList[0].value,
  label: transferSelectList[0].label,
})

async function queryPoolStatus(poolid: string) {
  try {
    loading.value = true
    const res = await queryPoolState(poolid)
    const { status, data } = res.data
    if (status == 'success') {
      currentPoolState.value = data
    }
  } finally {
    loading.value = false
  }
}

function connect() {
  ElMessageBox.confirm('Is it connected to the DpalWallet?', 'Connect DpalWallet', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
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

function init() {
  queryPools().then((res) => {
    pools.value = res.data.pools
    poolid.value = pools.value[0].poolid
    currentPool.value = pools.value[0]
    noticeMessage.value = res.data.notice_message
    queryPoolStatus(poolid.value)
  })
  if (address.value) {
    getBalance(address.value)
  }
}

onActivated(() => {
  init()
})
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24" style="margin-bottom: 12px">
      <dog-card>
        <h4 style="margin-top: 0">Swordpool</h4>
        <el-alert v-if="noticeMessage" title="Notice" :description="noticeMessage" type="warning" effect="dark" show-icon style="margin-bottom: 12px" />
        <el-row>
          <el-col :span="24" :md="18">
            <div class="selectToken">
              <el-dropdown style="display: inline-block; margin-right: 6px" trigger="click" @command="changePool">
                <el-button>
                  <img class="token-icon" v-if="currentPool.tokenA && icons[currentPool.tokenA]" :src="icons[currentPool.tokenA]" alt="" />{{ currentPool?.tokenA }}<span class="split-word">/</span>
                  <img class="token-icon" v-if="currentPool.tokenB && icons[currentPool.tokenB]" :src="icons[currentPool.tokenB]" alt="" /><span v-if="address">{{ balance }}&nbsp;</span
                  >{{ currentPool?.tokenB }}
                  <el-icon style="margin-left: 6px"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="item in pools" :key="item.poolid" :command="item.poolid" :disabled="!!noticeMessage || item.status != 0">
                      <img class="token-icon" v-if="icons[item.tokenA]" :src="icons[item.tokenA]" alt="" />{{ item?.tokenA }}<span class="split-word">/</span>
                      <img class="token-icon" v-if="icons[item.tokenB]" :src="icons[item.tokenB]" alt="" />{{ item?.tokenB }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <template v-if="address && currentPool.pooladdress">
                <el-button :loading="isBalanceLoading" :icon="Refresh" circle style="margin-right: 12px" @click="getBalance(address)" />
                <div class="selectToken_bar">
                  <el-button type="primary" style="margin-right: 12px" :disabled="!!noticeMessage" @click="showSwapDialog = true">Swap</el-button>
                  <el-badge :value="transferLoadingCount" :hidden="!transferLoadingCount" v-if="address">
                    <DogTableMenuItem style="margin-right: 0; line-height: 30px; padding: 0 10px" label="History" value="1" @click="showTransferDialog = true" />
                  </el-badge>
                </div>
              </template>
              <div v-else-if="currentPool.pooladdress && !address" style="font-size: 14px; display: inline-block">
                <div class="swap-pair_buy swap-pair_buy--connect" @click="connect">Connect DpalWallet</div>
              </div>
            </div>
            <el-row style="margin: 24px 0" v-if="currentPoolState">
              <el-col :span="12">
                <el-statistic :title="`Current ${currentPool?.tokenA} Balance`" :precision="5" :value="currentPoolState?.balanceA" />
              </el-col>
              <el-col :span="12">
                <el-statistic :title="`Current ${currentPool?.tokenB} Balance`" :precision="5" :value="currentPoolState?.balanceB" />
              </el-col>
              <el-col :span="12">
                <el-statistic title="Price" :precision="6" :value="np.divide(currentPoolState?.balanceA || 0, currentPoolState?.balanceB || 0) || 0" />
              </el-col>
              <el-col :span="12">
                <el-statistic title="Block No" :value="currentPoolState?.blockno" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" :md="6" style="display: flex; flex-direction: column; align-items: center">
            <el-link href="https://github.com/dpalwallet/swordpool" style="margin-bottom: 12px" target="_blank">
              <img class="token-icon" src="/logo.png" alt="" />
              Swordpool Rule
            </el-link>
            <div style="border: 2px solid rgb(238, 181, 15); padding: 12px; border-radius: 24px">
              <qrcode-vue :value="currentPool?.pooladdress" :size="150" level="H" />
            </div>
            <DogLink style="font-size: 12px; margin-top: 12px" is-copy :label="currentPool?.pooladdress" :value="currentPool?.pooladdress"></DogLink>
          </el-col>
        </el-row>
      </dog-card>
    </el-col>
    <el-col :span="24">
      <dog-card>
        <div style="position: absolute; z-index: 2000">
          <DogTableMenuItem label="Pool Transactions" :value="0" @click="transferSelect.value = 0" :selected="transferSelect.value == 0" />
          <DogTableMenuItem label="Holder" :value="1" @click="transferSelect.value = 1" :selected="transferSelect.value == 1" />
        </div>
        <div>
          <TransferTable v-show="transferSelect.value == 0" :current-pool="currentPool as SwordPool"></TransferTable>
          <TransferTop500 v-show="transferSelect.value == 1" :current-pool="currentPool as SwordPool"></TransferTop500>
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
</template>
<style lang="scss" scoped>
:deep(.el-statistic__number) {
  font-size: 18px;
}
.selectToken {
  display: flex;
  align-items: center;
  @media screen and (max-width: 490px) {
    flex-wrap: wrap;
    & .swap-pair_buy--connect,
    & &_bar {
      margin-top: 12px;
    }
  }
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
  border-radius: 50%;
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
    background-color: rgb(238, 181, 15);
    color: #333;
    border: 1px solid #333;
  }
}
.dog-tabmenu {
  margin-bottom: 20px;
  &_item {
    display: inline-block;
    padding: 4px 10px 5px 8px;
    border-radius: 8px;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #000;
    background-color: #fafafa;
    font-size: 14px;
    margin-right: 12px;
    cursor: pointer;
    &:hover {
      @extend .dog-tabmenu_item--active;
    }
    &--active {
      background-color: #ddc2f9;
    }
    &:last-child {
      margin-right: 0;
    }
    @media screen and (max-width: 430px) {
      & {
        font-size: 12px;
      }
    }
  }
}
</style>
