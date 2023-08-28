<script setup lang="ts">
import { queryPools, queryPoolState } from '@/services/sword'
import SwapInput from './components/SwapInput.vue'
import SwapTokenSelectDialog from './components/SwapTokenSelectDialog.vue'
import { useAppStore } from '@/store';
import { ElMessageBox } from 'element-plus';

const appStore = useAppStore()
const { connectDpal } = appStore
const address = computed(() => appStore.address)
const loading = ref(false)

const payToken = ref<TokenInfo>({
  amount: 10,
  rate: 1,
  min: 10,
})

const revToken = ref<TokenInfo>({
  amount: 0,
  rate: 1,
})

const tokenItems = reactive({
  pay: payToken,
  rev: revToken
})

const focusName = ref<TokenInputName>('')
const visible = ref(false)
const tokenPools = ref([])

watch(
  () => payToken.value.amount,
  (amount) => {
    if (focusName.value == 'pay') {
      revToken.value.amount = amount
    }
  }
)

watch(
  () => revToken.value.amount,
  (amount) => {
    if (focusName.value == 'rev') {
      payToken.value.amount = amount
    }
  }
)

function changeToken() {
  focusName.value = ''
  const swap = payToken.value
  payToken.value = revToken.value
  revToken.value = swap
}

function selectToken(name: TokenInputName) {
  visible.value = true
  focusName.value = name
}

function changeSelectToken(token: TokenSwapInfo) {
  if (!loading.value && focusName.value) {
    const key = focusName.value
    tokenItems[key].currentPool = token
    loading.value = true
    queryPoolState(token.poolid).then((res) => {
      if (res.data.status == 'success') {
        const data = res.data.data
        const { balanceA, balanceB } = data

        if (balanceA / balanceB < 0) {

        }
      }
      visible.value = false
      setTimeout(() => {
        loading.value = false
      }, 500)
    })
  }
}

function connect() {
  ElMessageBox.confirm('Is it connected to the DpalWallet?', 'Connect DpalWallet', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then(() => {
    connectDpal()
  })
}

onMounted(() => {
  queryPools().then((res) => {
    tokenPools.value = res.data.data
    revToken.value.currentPool = tokenPools.value[0] as TokenSwapInfo
  })
})
</script>

<template>
  <div class="swap-container">
    <div class="swap-pair">
      <div class="swap-pair_title">
        <span class="swap-pair_tab">兑换</span>
      </div>
      <SwapInput name="pay" v-model="payToken.amount" title="你付钱" @focus="focusName = 'pay'" @select-token="selectToken" :currentPool="payToken.currentPool" :min="payToken.min"></SwapInput>
      <div class="swap-pair_changewrap">
        <div class="swap-pair_change" @click="changeToken">
          <span class="nft">&#xe64f;</span>
        </div>
      </div>
      <SwapInput name="rev" v-model="revToken.amount" title="你收到" @focus="focusName = 'rev'" @select-token="selectToken" :currentPool="revToken.currentPool" :min="revToken.min"></SwapInput>
      <!-- <div class="swap-pair_info"></div> -->
      <div class="swap-pair_buy swap-pair_buy--connect" @click="connect" v-if="!address">连接钱包</div>
      <div class="swap-pair_buy" v-else>支付</div>
    </div>
    <SwapTokenSelectDialog v-model="visible" :list="tokenPools" @change="changeSelectToken"></SwapTokenSelectDialog>
  </div>
</template>
<style lang="scss">
.swap-pair {
  max-width: 500px;
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(218, 112, 214);
  margin: 50px auto;
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
  }
  &_buy {
    text-align: center;
    padding: 20px;
    margin-top: 12px;
    border-radius: 20px;
    cursor: pointer;
    border: 2px solid #fff;
    background-color: #1E90FF;
    color: #fff;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    &--connect {
      background-color: rgb(238, 181, 15);
      color: #333;
    }
  }
}
</style>
