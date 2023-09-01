<script setup lang="ts">
import { ElMessageBox, ElNotification } from 'element-plus';
import SwapRecordsDialog from './SwapRecordsDialog.vue'
import NP from 'number-precision'

NP.enableBoundaryChecking(false);

const props = withDefaults(
  defineProps<{
    visible: boolean,
    currentPool: SwordPool,
    currentPoolState: TokenState,
    pools: any[],
    loading: boolean
  }>(), {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'changePool', poolid: string): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  }
})

const showRecordDialog = ref(true)
const { payPool } = useDoge()

const payToken = ref<TokenInfo>({
  amount: 0,
  rate: 1,
  loading: false,
  pools: [],
  price: 4
})

const revToken = ref<TokenInfo>({
  amount: 0,
  rate: 1,
  loading: false,
  pools: [],
  price: 0
})

const focusName = ref<TokenInputName>('')
const isWatchStop = ref(false)
const paying = ref(false)
const payData = ref<any>({})

watch(() => props.currentPoolState, (currentPoolState) => {
  const { balanceA, balanceB } = currentPoolState
  const key = focusName.value

  payToken.value.rate = NP.divide(balanceB, balanceA)
  revToken.value.rate = NP.divide(balanceA, balanceB)

  isWatchStop.value = true
  if (key == 'pay') {
    payToken.value.amount = NP.round(NP.divide(revToken.value.amount, revToken.value.rate ), 4)
  } else {
    revToken.value.amount = NP.round(NP.divide(payToken.value.amount, revToken.value.rate), 4)
  }
  nextTick(() => {
    isWatchStop.value = false
  })
})

watch(() => props.pools, (pools) => {
  revToken.value.pools = pools
})


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

function changePool(poolid: string) {
  emit('changePool', poolid)
}

async function pay() {

  if (+payToken.value.amount < 10) {
    return ElMessage.error('The minimum doge currency is 10.')
  }

  await ElMessageBox.confirm('Do you want to pay?', 'Pay', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })

  try {
    if (payToken.value.amount) {
      paying.value = true
      await payPool(payToken.value.amount, props.currentPool.pooladdress)
      showRecordDialog.value = true
      payData.value = {
        status: '0',
        swapType: 'SWAP_A_B',
        inTokenA: payToken.value.amount,
        inTokenB: 0,
        outTokenA: 0,
        outTokenB: revToken.value.amount,
      }
    }
  } catch {
    await ElNotification({
      title: 'Error',
      message: 'Payment failed!',
      type: 'error',
    })
  } finally {
    paying.value = false
  }
}

function close() {
   payToken.value.amount = revToken.value.amount = 0
}

</script>

<template>
  <el-dialog v-model="visible" width="500px" @close="close" append-to-body>
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
        ></SwapInput>
        <div style="color: red;margin-top: 4px" v-if="+payToken.amount < 10">The minimum doge currency is 10.</div>
        <div class="swap-pair_changewrap">
          <div class="swap-pair_change swap-pair_change--disabled">
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
        ></SwapInput>
        <div class="swap-pair_buy" :style="[+payToken.amount < 10 ? {'background-color': '#aaa', cursor: 'not-allowed'} : {}]" @click="pay">Pay</div>
      </div>
    </div>
  </el-dialog>
  <SwapRecordsDialog v-model:visible="showRecordDialog" :currentPool="currentPool" :payData="payData"></SwapRecordsDialog>
</template>
<style lang="scss" scoped>
.swap-pair {
  max-width: 500px;
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(218, 112, 214);
  &_title {
    margin: 12px 5px;
    color: #fff;
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
    background-color: rgb(238, 181, 15);
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
    background-color: #1e90ff;
    color: #fff;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    &--connect {
      background-color: rgb(238, 181, 15);
      color: #333;
    }
  }
}
</style>
