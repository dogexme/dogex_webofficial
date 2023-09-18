<script setup lang="ts">
import { queryTransferStatus } from '@/services/sword'
import { consumeToken } from './TransferTable'
import { omitCenterString, delay } from '@/utils'
import { useAppStore } from '@/store'
import { ElMessageBox } from 'element-plus'

const props = withDefaults(
  defineProps<{
    visible: boolean
    currentPool: any
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
  (event: 'close'): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(isVisible) {
    emit('update:visible', isVisible)
  },
})

const currentPool = computed(() => props.currentPool)
const maxInputDialogWidth = 1000
const inputDialogWidth = ref(maxInputDialogWidth)
const appStore = useAppStore()
const transferList = computed(() => appStore.transferList)
const pageSize = 10
const page = ref(1)
const curTransferList = computed(() => transferList.value.slice((page.value - 1) * pageSize, pageSize + pageSize * (page.value - 1)))
const outField = ref('Expected Out')

watch(visible, async (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, window.screen.width - 20)
    outField.value = 'Expected Out'
    queryStatusLoop(curTransferList.value)
  } else {
    appStore.updateTransferList()
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

      await delay(300)
      const res = await queryTransferStatus(data[i].txid)
      const resData = res.data.data

      if (res.data.status == 'failed') {
        data[i].status = '0'
      } else if (resData.status != '0') {
        Object.assign(data[i], resData)
      }

      if (data[i].status != '0') {
        loadingCount--
        continue
      }
    } catch {
      loadingCount--
      continue
    }
  }

  if (loadingCount == 0) {
    outField.value = 'Out'
  }
}

async function next(num: number) {
  page.value = num
  outField.value = 'Expected Out'
  queryStatusLoop(curTransferList.value)
}

async function clearAllHistory() {
  await ElMessageBox.confirm('Do you want to clear all transaction history?', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  })
  appStore.transferList = []
}
</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth" @close="emit('close')">
    <div class="doge-tokenlist">
      <div style="display: flex; justify-content: flex-end">
        <DogTableMenuItem label="Clear All" value="0" @click="clearAllHistory"></DogTableMenuItem>
      </div>
      <el-table :data="curTransferList">
        <el-table-column label="Swap" width="100px">
          <template #default="s">
            <SwapIconExchange :icon-a="currentPool.tokenA" :icon-b="currentPool.tokenB" v-if="s.row.swapType == 'SWAP_A_B'"></SwapIconExchange>
            <SwapIconExchange :icon-a="currentPool.tokenB" :icon-b="currentPool.tokenA" v-else-if="s.row.swapType == 'SWAP_B_A'"></SwapIconExchange>
            <span v-else-if="s.row.swapType == 'ROLLBACK_A' || s.row.swapType == 'ROLLBACK_B'">ROLLBACK</span>
            <span v-else>{{ s.row.swapType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="Status" width="80px">
          <template #default="s">
            <SwapStatusIcon :status="s.row.status"></SwapStatusIcon>
          </template>
        </el-table-column>
        <el-table-column prop="txid" label="Txid" width="200px">
          <template #default="s">
            <DogLink v-if="s.row.txid" is-copy :to="`https://chain.so/tx/DOGE/${s.row.txid}`" :label="omitCenterString(s.row.txid, 12)" :value="s.row.txid"></DogLink>
          </template>
        </el-table-column>
        <el-table-column label="In">
          <template #default="s">
            {{ consumeToken(s.row.inTokenA, s.row.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column :label="outField">
          <template #default="s">
            {{ consumeToken(s.row.outTokenA, s.row.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column label="Date" prop="date"></el-table-column>
      </el-table>
      <div style="margin-top: 12px; display: flex; justify-content: center">
        <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="transferList.length" @current-change="next" />
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
