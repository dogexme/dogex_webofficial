<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { getTransferList } from '@/services/sword'
import NP from 'number-precision'
import { useAppStore } from '@/store'
import { omitCenterString } from '@/utils'
import icons from '@/config/payIcons'
import { SwordPool, TokenState, TokenInfo, TokenInputName } from '@/services/types'

NP.enableBoundaryChecking(false)

const props = withDefaults(
  defineProps<{
    visible: boolean
    currentPool: SwordPool
    currentPoolState: TokenState
    pools: any[]
    loading: boolean
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'changePool', poolid: string): void
  (event: 'paySuccess'): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

const maxDialogWidth = 1000
const dialogWidth = ref(maxDialogWidth)
const maxInputDialogWidth = 500
const inputDialogWidth = ref(maxInputDialogWidth)

const appStore = useAppStore()
const address = computed(() => appStore.address)
const showRecordDialog = ref(false)
const { payPool, transferD20 } = useDoge()

const payToken = ref<TokenInfo>({
  amount: 0,
  rate: 1,
  loading: false,
  pools: [],
  swapType: 'SWAP_A_B',
  price: 4,
  txid: '',
})

const revToken = ref<TokenInfo>({
  amount: 0,
  rate: 1,
  loading: false,
  pools: [],
  price: 0,
  swapType: 'SWAP_B_A',
})

const focusName = ref<TokenInputName>('')
const isWatchStop = ref(false)
const paying = ref(false)
const payData = ref<any>({})
const showSelectTokenDialog = ref(false)
const transferList = ref<{ amt: number; txid: string }[]>([])
const transferListLoading = ref(false)

watch(visible, (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, window.screen.width - 20)
  }
})

watch(
  () => props.currentPoolState,
  (currentPoolState) => {
    const { balanceA, balanceB } = currentPoolState
    const key = focusName.value

    payToken.value.rate = NP.divide(balanceB, balanceA)
    revToken.value.rate = NP.divide(balanceA, balanceB)

    isWatchStop.value = true
    if (key == 'pay') {
      payToken.value.amount = NP.round(NP.divide(revToken.value.amount, revToken.value.rate), 4)
    } else {
      revToken.value.amount = NP.round(NP.divide(payToken.value.amount, revToken.value.rate), 4)
    }
    nextTick(() => {
      isWatchStop.value = false
    })
  }
)

watch(
  () => props.pools,
  (pools) => {
    revToken.value.pools = pools
  }
)

watch(
  () => payToken.value.amount,
  (amount) => {
    if (focusName.value == 'pay' && !isWatchStop.value) {
      revToken.value.amount = NP.round(NP.divide(amount, revToken.value.rate), revToken.value.price)
    }
  }
)

watch(
  () => revToken.value.amount,
  (amount) => {
    if (focusName.value == 'rev' && !isWatchStop.value) {
      payToken.value.amount = NP.round(NP.divide(amount, payToken.value.rate), 4)
    }
  }
)

watch(showSelectTokenDialog, async (isVisible) => {
  if (isVisible) {
    dialogWidth.value = Math.min(maxDialogWidth, window.screen.width - 20)
    try {
      transferListLoading.value = true
      const res = await getTransferList(address.value)
      const resData = res.data
      if (resData.status == 'success') {
        transferList.value = resData.data.transfer_list
        console.log(transferList.value)
      }
    } finally {
      transferListLoading.value = false
    }
  }
})

function changePool(poolid: string) {
  emit('changePool', poolid)
}

const isLimitAmount = computed(() => payToken.value.swapType == 'SWAP_A_B' && +payToken.value.amount < 10)
const isSelectLimit = computed(() => !payToken.value.txid && payToken.value.swapType == 'SWAP_B_A')

async function pay() {
  if (isLimitAmount.value) {
    return
  }

  if (!payToken.value.txid && payToken.value.swapType == 'SWAP_B_A') {
    return
  }

  const { swapType, amount } = payToken.value
  let txid

  try {
    if (amount) {
      paying.value = true
      if (swapType == 'SWAP_A_B') {
        txid = await payPool(amount, props.currentPool.pooladdress)
        payData.value = {
          txid,
          status: '0',
          swapType,
          inTokenA: payToken.value.amount,
          inTokenB: 0,
          outTokenA: 0,
          outTokenB: revToken.value.amount,
          date: dateFormat(new Date()),
        }
      } else {
        txid = await transferD20(payToken.value.txid as string, props.currentPool.pooladdress, amount, props.currentPool.tokenB)
        payData.value = {
          txid,
          status: '0',
          swapType,
          inTokenA: 0,
          inTokenB: payToken.value.amount,
          outTokenA: revToken.value.amount,
          outTokenB: 0,
          date: dateFormat(new Date()),
        }
      }
      visible.value = false
      showRecordDialog.value = true
      emit('paySuccess')
    }
  } catch {
    if (!txid && swapType == 'SWAP_B_A') {
      await ElNotification({
        title: 'Error',
        message: `Please select transferable utxo.`,
        type: 'error',
      })
    } else {
      await ElNotification({
        title: 'Error',
        message: 'Payment failed!',
        type: 'error',
      })
    }
  } finally {
    paying.value = false
  }
}

function change() {
  return
  // isWatchStop.value = true
  // const temp = payToken.value
  // payToken.value = revToken.value
  // revToken.value = temp
  // if (revToken.value.amount == '' || payToken.value.amount == '') {
  //   revToken.value.amount = payToken.value.amount = 0
  // }
  // nextTick(() => {
  //   isWatchStop.value = false
  // })
}

function close() {
  payToken.value.amount = revToken.value.amount = 0
  payToken.value.txid = ''
}

function selectToken() {
  if (payToken.value.swapType == 'SWAP_B_A') {
    showSelectTokenDialog.value = true
  }
}

function setSelectToken(t: { txid: string; amt: number }) {
  focusName.value = 'pay'
  payToken.value.amount = t.amt
  payToken.value.txid = t.txid
  showSelectTokenDialog.value = false
}
</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth" @close="close" append-to-body>
    <div class="swap-container" v-loading="paying">
      <div class="swap-pair">
        <div class="swap-pair_title">
          <span class="swap-pair_tab">Swap</span>
        </div>
        <SwapInput
          name="pay"
          v-model="payToken.amount"
          :price="payToken.price"
          :loading="loading"
          title="You pay"
          @focus="focusName = 'pay'"
          :currentPool="props.currentPool"
          :pools="payToken.pools"
          @change-pool="changePool"
          :min="payToken.min"
          :disabled="payToken.swapType == 'SWAP_B_A'"
          :swap-type="payToken.swapType"
          @select-token="selectToken"
        ></SwapInput>
        <div class="swap-pair_changewrap">
          <div class="swap-pair_change swap-pair_change--disabled" @click="change">
            <span class="nft">&#xe64f;</span>
          </div>
        </div>
        <SwapInput
          name="rev"
          v-model="revToken.amount"
          :loading="loading"
          title="You will receive"
          @focus="focusName = 'rev'"
          :currentPool="props.currentPool"
          :pools="revToken.pools"
          :price="revToken.price"
          @change-pool="changePool"
          :min="revToken.min"
          :disabled="payToken.swapType == 'SWAP_B_A'"
          :swap-type="revToken.swapType"
        ></SwapInput>
        <div style="color: red; margin-top: 10px; text-align: center" v-if="isLimitAmount && payToken.amount != ''">The minimum doge currency is 10.</div>
        <div style="color: red; margin-top: 10px; text-align: center" v-if="isSelectLimit">Please select transferable utxo.</div>
        <div class="swap-pair_buy" :style="[isLimitAmount || payToken.amount == 0 || isSelectLimit ? { cursor: 'not-allowed' } : {}]" @click="pay">Swap</div>
      </div>
    </div>
  </el-dialog>
  <el-dialog class="custom-dialog" v-model="showSelectTokenDialog" :width="dialogWidth">
    <div class="doge-tokenlist" v-loading="transferListLoading">
      <el-row :gutter="8">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="t in transferList" :key="t.txid">
          <section class="doge-tokenitem" @click="setSelectToken(t)">
            <div class="doge-tokenitem_ava">
              <img :src="icons.dogim" class="doge-tokenitem_avaitem" alt="" />
            </div>
            <div>
              <div class="doge-tokenitem_row">Name: dogim</div>
              <div class="doge-tokenitem_row">
                Txid:
                <DogLink is-copy :label="omitCenterString(t.txid, 12)" :value="t.txid"></DogLink>
              </div>
              <div class="doge-tokenitem_row">
                Amount:
                {{ t.amt }}
              </div>
            </div>
          </section>
        </el-col>
      </el-row>
      <el-empty v-if="transferList.length < 1" description="No data." />
    </div>
  </el-dialog>
  <SwapRecordsDialog v-model:visible="showRecordDialog" :currentPool="currentPool" :payData="payData"></SwapRecordsDialog>
</template>
<style lang="scss" scoped>
.swap-container {
  max-width: 500px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  padding: 50px 20px 20px;
}
.swap-pair {
  padding: 10px;
  background-color: #dadada;
  border-radius: 20px;
  &_title {
    margin: 12px 5px;
    color: #2c2c2c;
    font-weight: 600;
  }
  &_changewrap {
    display: flex;
    justify-content: center;
  }
  &_change {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    margin: 5px 0;
    border-radius: 12px;
    color: #fff;
    border: 1px solid #fff;
    background-color: #ffa21e;
    cursor: pointer;
    &--disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  }
  &_buy {
    text-align: center;
    line-height: 55px;
    margin-top: 12px;
    border-radius: 20px;
    font-size: 18px;
    cursor: pointer;
    border: 2px solid #fff;
    background-color: #ffa21e;
    color: #fff;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    &--connect {
      background-color: rgb(238, 181, 15);
      color: #333;
    }
  }
}

.doge-tokenlist {
  background-color: #fff;
  min-height: 350px;
  border-radius: 20px;
  overflow: hidden;
  padding: 50px 20px 20px;
}
.doge-tokenitem {
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: 8px;
  &:hover {
    border-color: #ffa21e;
    transition: all 0.2s;
    cursor: pointer;
  }
  &_row {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &_ava {
    align-self: center;
    margin-bottom: 12px;
  }
  &_avaitem {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  @media screen and (max-width: 768px) {
    flex-direction: row;
    &_ava {
      margin-bottom: 0;
      margin-right: 12px;
    }
  }
}
</style>
