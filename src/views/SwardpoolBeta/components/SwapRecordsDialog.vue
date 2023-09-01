<script setup lang="ts">
import { queryPoolTransfers } from '@/services/sword'
import { getSwapType, consumeToken } from './TransferTable'
import { useAppStore } from '@/store'
import { Loading } from '@element-plus/icons-vue'

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

const statusType = {
  0: 'waiting',
  1: 'success',
  2: 'fail',
}

const appStore = useAppStore()
const address = computed(() => appStore.address)
const currentPool = computed(() => props.currentPool)
const payData = ref<any>([])

watch(() => props.payData, (data) => {
  if (data) {
    payData.value = [data]
  }
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
  }
})

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
  <el-dialog width="800px" v-model="visible">
    <el-result icon="success" title="Payment success"></el-result>
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
            {{ statusType[s.row.status as 0] || '-'}}
            <el-icon class="is-loading" v-if="s.row.status == 0" style="vertical-align: middle;">
              <Loading />
            </el-icon>
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
      <h4>Pool Transactions</h4>
      <el-table :data="dataSource">
        <el-table-column label="Swap" width="200px">
          <template #default="s">
            {{ getSwapType(s.row.swapType, currentPool.tokenA, currentPool.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="s">
            {{ statusType[s.row.status as 0] }}
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
