<script setup lang="ts">
import { queryPoolTransfers, queryTransferStatus } from '@/services/sword'
import { getSwapType, consumeToken, StatusType } from './TransferTable'
import { useAppStore } from '@/store'
import { Loading } from '@element-plus/icons-vue'
import { omitCenterString } from '@/utils'

const props = withDefaults(
  defineProps<{
    visible: boolean
    currentPool: any,
    payData: any
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
}>()

const appStore = useAppStore()
const address = computed(() => appStore.address)
const currentPool = computed(() => props.currentPool)
const payData = ref<any>([])
const timer = ref(0)

watch(() => props.payData, async (data) => {
  if (data) {
    payData.value = [data]
    queryStatusLoop(data)
  }
}, {
  immediate: true
})

const { loading, dataSource, total, query } = useTable({
  api: getData,
  pageSize: 5,
})

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

watch(visible, (isVisible) => {
  if (isVisible) {
    query(1)
  } else {
    stopStatusLoop()
  }
})

async function queryStatusLoop(data: any) {
  try {
    const res = await queryTransferStatus('6538cca5570613ccf1096d3cd48c416798e96b9cfde6c7ec17168a9e5ce0f8f6')
    const resData = res.data.data

    if (res.data.status == 'failed') {
      return stopStatusLoop()
    }

    if(resData.status != '0') {
      data.status = resData.status
      stopStatusLoop()
    } else {
      timer.value = window.setTimeout(() => queryStatusLoop(data), 1000)
    }
  } catch {
    stopStatusLoop()
  }
}

function stopStatusLoop() {
  clearTimeout(timer.value)
}

async function getData(page: number, pageSize: number) {
  const res = await queryPoolTransfers({ pageSize, page, address: address.value })
  const { status, data } = res.data
  return status == 'success'
    ? {
        total: data.total,
        data: data.list,
      }
    : {
        total: 0,
        data: [],
      }
}

</script>
<template>
  <el-dialog width="900px" v-model="visible">
    <el-result class="swap-result" icon="success" title="Payment success"></el-result>
    <div v-loading="loading">
      <h4>Pay Data</h4>
      <el-table :data="payData" :show-header="false" style="margin-bottom: 12px">
        <el-table-column label="Swap" width="200px">
          <template #default="s">
            {{ getSwapType(s.row.swapType, currentPool.tokenA, currentPool.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="s">
            {{ StatusType[s.row.status as 0] || '-'}}
            <el-icon class="is-loading" v-if="s.row.status == 0" style="vertical-align: middle;">
              <Loading />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="txid" label="Txid" width="180px">
          <template #default="s">
            <DogLink v-if="s.row.txid" is-copy :to="`https://chain.so/tx/DOGE/${s.row.txid}`" :label="omitCenterString(s.row.txid, 12)" :value="s.row.txid"></DogLink>
          </template>
        </el-table-column>
        <el-table-column label="In">
          <template #default="s">
            {{ consumeToken(s.row.inTokenA, s.row.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column label="Out">
          <template #default="s">
            {{ consumeToken(s.row.outTokenA, s.row.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
      </el-table>
      <h4 style="margin-top: 50px">Pool Transactions</h4>
      <el-table :data="dataSource">
        <el-table-column label="Swap" width="200px">
          <template #default="s">
            {{ getSwapType(s.row.swapType, currentPool.tokenA, currentPool.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="s">
            {{ StatusType[s.row.status as 0] }}
          </template>
        </el-table-column>
        <el-table-column prop="txid" label="Txid" width="180px">
          <template #default="s">
            <DogLink v-if="s.row.txid" is-copy :to="`https://chain.so/tx/DOGE/${s.row.txid}`" :label="omitCenterString(s.row.txid, 12)" :value="s.row.txid"></DogLink>
          </template>
        </el-table-column>
        <el-table-column label="In">
          <template #default="s">
            {{ consumeToken(s.row.inTokenA, s.row.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column label="Out">
          <template #default="s">
            {{ consumeToken(s.row.outTokenA, s.row.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 12px; display: flex; justify-content: center">
        <el-pagination :page-size="5" layout="prev, pager, next" :total="total" @current-change="query" />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.swap-result {
  flex-direction: row;
  padding: 0;
  .el-result__title {
    margin-left: 12px;
    margin-top: 0;
  }
}
</style>
