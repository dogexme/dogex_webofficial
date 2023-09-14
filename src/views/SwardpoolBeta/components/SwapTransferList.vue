<script setup lang="ts">
import { queryPoolTransfers, queryTransferStatus } from '@/services/sword'
import { getSwapType, consumeToken, StatusType } from './TransferTable'
import { Loading } from '@element-plus/icons-vue'
import { omitCenterString, delay } from '@/utils'
import { useAppStore } from '@/store';

const props = withDefaults(
  defineProps<{
    visible: boolean,
    currentPool: any,
  }>(), {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void,
  (event: 'close'): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  }
})

const { loading, dataSource, total, query } = useTable({
  api: getData,
  pageSize: 5,
  first: false
})
const currentPool = computed(() => props.currentPool)
const maxInputDialogWidth = 800
const inputDialogWidth = ref(maxInputDialogWidth)
const appStore = useAppStore()
const address = computed(() => appStore.address)
const timer = ref(0)

watch(visible, async (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, window.screen.width - 20)
    await query(1)
    queryStatusLoop(dataSource.value)
  } else {
    stopStatusLoop()
  }
})

async function queryStatusLoop(data: any) {
  let loadingCount = data.length

  for (let i = 0; i < data.length; i++) {
    try {
      if (data[i].status != '0') {
        loadingCount--
        continue
      }

      await delay(200)
      const res = await queryTransferStatus(data[i].txid)
      const resData = res.data.data

      if (res.data.status == 'failed') {
        loadingCount--
        continue
      }

      if(resData.status != '0') {
        loadingCount--
        data[i].status = resData.status
        continue
      }
    } catch {
      loadingCount--
      continue
    }
  }

  if (loadingCount > 0) {
    timer.value = window.setTimeout(() => queryStatusLoop(data), 500)
  } else {
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

async function next(page: number) {
  await query(page)
  queryStatusLoop(dataSource.value)
}

</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth" @close="emit('close')">
    <div class="doge-tokenlist" v-loading="loading">
      <el-table :data="dataSource">
          <el-table-column label="Swap" width="200px">
            <template #default="s">
              {{ getSwapType(s.row.swapType, currentPool.tokenA, currentPool.tokenB) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status">
            <template #default="s">
              {{ StatusType[s.row.status as 0] || '-' }}
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
        <div style="margin-top: 12px; display: flex; justify-content: center">
          <el-pagination :page-size="5" layout="prev, pager, next" :total="total" @current-change="next" />
        </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.custom-dialog {
  background-color: transparent;
  box-shadow: none;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: 14px;
    right: 8px;
    width: 35px;
    height: 35px;
  }
  .el-dialog__close {
    color: #000;
  }
}
</style>

<style lang="scss" scoped>
.doge-tokenlist {
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  padding: 50px 20px 20px;
}
</style>
