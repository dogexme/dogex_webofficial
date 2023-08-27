<script setup lang="ts">
import { queryPools } from '@/services/sword'
import SwapInput from './components/SwapInput.vue'
import SwapTokenSelectDialog from './components/SwapTokenSelectDialog.vue'
import { useAppStore } from '@/store';
import { ElMessageBox } from 'element-plus';

const appStore = useAppStore()
const { connectDpal } = appStore
const address = computed(() => appStore.address)
const payToken = ref({
  amount: 0,
  rate: 100,
  currentPool: {
    pooladdress: '池子地址',
    poolid: '池子编号，可以部署相同的池子',
    tokenA: 'doge',
    tokenB: 'dogi',
  },
})
const revToken = ref({
  amount: 0,
  rate: 10,
  currentPool: {
    pooladdress: '池子地址',
    poolid: '池子编号，可以部署相同的池子',
    tokenA: 'doge',
    tokenB: 'dogi',
  },
})
const focusName = ref('')
const visible = ref(false)
const tokenPools = ref([])
const currentPool = ref({})

watch(
  () => payToken.value.amount,
  (amount) => {
    if (focusName.value == 'payToken') {
      revToken.value.amount = amount
    }
  }
)

watch(
  () => revToken.value.amount,
  (amount) => {
    if (focusName.value == 'revToken') {
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

function selectToken() {
  visible.value = true
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
  })
})
</script>

<template>
  <div class="swap-container">
    <div class="swap-pair">
      <div class="swap-pair_title">
        <span class="swap-pair_tab">兑换</span>
      </div>
      <SwapInput v-model="payToken.amount" title="你付钱" @focus="focusName = 'payToken'" @select-token="selectToken" :currentPool="currentPool"></SwapInput>
      <div class="swap-pair_changewrap">
        <div class="swap-pair_change" @click="changeToken">
          <span class="nft">&#xe64f;</span>
        </div>
      </div>
      <SwapInput v-model="revToken.amount" title="你收到" @focus="focusName = 'revToken'" @select-token="selectToken" :currentPool="currentPool"></SwapInput>
      <!-- <div class="swap-pair_info"></div> -->
      <div class="swap-pair_buy swap-pair_buy--connect" @click="connect" v-if="!address">连接钱包</div>
      <div class="swap-pair_buy" v-else>支付</div>
    </div>
    <SwapTokenSelectDialog v-model="visible"></SwapTokenSelectDialog>
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
