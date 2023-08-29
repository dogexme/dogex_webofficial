<script setup lang="ts">
import { queryPools, queryPoolState, queryPoolTransfers } from '@/services/sword'
import TransferTable from './components/TransferTable'
import np from 'number-precision'

const pools = ref<any>([])
const poolid = ref('')
const currentPool = ref()
const currentPoolState = ref<TokenState>()
const transfersData = ref([])
const loading = ref(false)
const second = 30

async function queryPoolStatus(poolid: string) {
  try {
    const res = await queryPoolState(poolid)
    const { status, data } = res.data
    if (status == 'success') {
      currentPoolState.value = data
    }
  } finally {
    setTimeout(queryPoolStatus, second * 1000)
  }
}

function changePool(poolid: string) {
  const pool = pools.value.find((p: any) => p.poolid === poolid)
  queryPoolStatus(poolid)
  if (pool) {
    currentPool.value = pool
  }
}

function queryPoolTransfersAll() {
  loading.value = true
  queryPoolTransfers({}).then((res) => {
    const { status, data } = res.data
    if (status == 'success') {
      transfersData.value = data.list
    }
  }).finally(() => {
    loading.value = false
    setTimeout(queryPoolTransfersAll, second * 1000)
  })
}

onMounted(() => {
  queryPools().then(res => {
    pools.value = res.data.pools
    poolid.value = pools.value[0].poolid
    currentPool.value = pools.value[0]
    queryPoolStatus(poolid.value)
  })
  queryPoolTransfersAll()
})

</script>

<template>
    <el-row :gutter="12">
      <el-col :span="6">
        <dog-card  style="height: 80vh;overflow: auto;">
          <h4>Overview</h4>
          <el-select style="margin-bottom: 12px" v-model="poolid" placeholder="select pool" size="large" @change="changePool">
            <el-option
              v-for="item in pools"
              :key="item.poolid"
              :label="`${item.tokenA}/${item.tokenB}`"
              :value="item.poolid"
              :disabled="item.status != 0"
            />
          </el-select>
          <section><span>TokenA:</span> {{ currentPool?.tokenA }}</section>
          <section><span>TokenB:</span> {{ currentPool?.tokenB }}</section>
          <section><span>{{ currentPool?.tokenA }} Balance:</span> {{ currentPoolState?.balanceA }}</section>
          <section><span>{{ currentPool?.tokenB }} Balance:</span> {{ currentPoolState?.balanceB }}</section>
          <section><span>Rate:</span> {{ np.divide(currentPoolState?.balanceA || 0, currentPoolState?.balanceB || 0) }}</section>
          <section><span>Pool Block No:</span> {{ currentPoolState?.blockno }}</section>
        </dog-card>
      </el-col>
      <el-col :span="18">
        <dog-card style="height: 80vh;overflow: auto;">
          <h4>Transfers</h4>
          <TransferTable :loading="loading" :data="transfersData"></TransferTable>
        </dog-card>
      </el-col>
    </el-row>
</template>
<style lang="scss" scoped>
  section {
    line-height: 2;
    color: orange;
    span {
      color: #333;
    }
  }
</style>
