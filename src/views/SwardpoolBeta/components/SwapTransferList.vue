<script setup lang="ts">
import { queryTransferStatus } from '@/services/sword'
import { consumeToken } from './TransferTable'
import { omitCenterString } from '@/utils'
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
const transferList = computed(() => {
  return appStore.transferList.map((d: any) => {
    let out = ''
    if (d.swapType === 'ADDLIQ') {
      out = '-'
    } else {
      out = consumeToken(d.swapType, d.outTokenA, d.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB, false) as string
    }
    return Object.assign(d, {
      out,
    })
  })
})
const pageSize = 10
const page = ref(1)
const curTransferList = computed(() => transferList.value.slice((page.value - 1) * pageSize, pageSize + pageSize * (page.value - 1)))
const outField = ref('Expected Out')

watch(visible, async (isVisible) => {
  if (isVisible) {
    inputDialogWidth.value = Math.min(maxInputDialogWidth, document.documentElement.offsetWidth - 20)
    outField.value = 'Expected Out'
    queryStatusLoop(curTransferList.value)
  } else {
    appStore.updateTransferList()
  }
})

async function queryStatusLoop(data: any) {
  const waitReqData = data.filter((d: any) => d.status == 0)

  if (waitReqData.length < 1) {
    outField.value = 'Out'
    return
  }

  Promise.all(
    waitReqData.map(async (d: any) => {
      const res = await queryTransferStatus(d.txid)
      const resData = res.data.data
      if (res.data.status == 'success' && resData?.hash) {
        resData.status = 1
        return Object.assign(d, resData)
      } else {
        throw res.data.status
      }
    })
  ).then(() => {
    outField.value = 'Out'
  })
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
    customClass: 'messageBox-dialog',
  })
  appStore.transferList = []
}
</script>

<template>
  <el-dialog class="custom-dialog" v-model="visible" :width="inputDialogWidth" @close="emit('close')">
    <div class="doge-tokenlist">
      <DialogTitle title="History"></DialogTitle>
      <div style="display: flex; justify-content: flex-end">
        <DogTableMenuItem label="Clear All" value="0" @click="clearAllHistory"></DogTableMenuItem>
      </div>
      <el-table :data="curTransferList">
        <el-table-column label="Swap" align="center" width="100px">
          <template #default="s">
            <SwapTypeIcon :record="s.row" :swap-type="s.row.swapType" :token-a="currentPool.tokenA" :token-b="currentPool.tokenB"></SwapTypeIcon>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="Status">
          <template #default="s">
            <SwapStatusIcon :status="s.row.status"></SwapStatusIcon>
          </template>
        </el-table-column>
        <el-table-column prop="txid" label="Txid" width="200px">
          <template #default="s">
            <DogLink
              v-if="s.row.txid"
              is-copy
              :to="`https://chain.so/tx/DOGE/${s.row.txid}`"
              :label="omitCenterString(s.row.txid, 12)"
              :value="s.row.txid"
            ></DogLink>
          </template>
        </el-table-column>
        <el-table-column label="In" width="150px">
          <template #default="s">
            {{ consumeToken(s.row.swapType, s.row.inTokenA, s.row.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
          </template>
        </el-table-column>
        <el-table-column :label="outField" width="200px">
          <template #default="s">
            {{ s.row.out }}
          </template>
        </el-table-column>
        <el-table-column label="Date" prop="date" width="190px"></el-table-column>
      </el-table>
      <div style="margin-top: 12px; display: flex; justify-content: center">
        <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="transferList.length" @current-change="next" />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.doge-tokenlist {
  background-color: #fff;
  overflow: hidden;
  padding: 20px;
}
</style>
