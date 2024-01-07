<script setup lang="ts">
import { consumeToken } from './TransferTable'
import { omitCenterString } from '@/utils'
import { useAppStore } from '@/store'

const props = withDefaults(
  defineProps<{
    visible: boolean
    currentPool: any
    payData: any
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'update:visible', isVisible: boolean): void
}>()
const maxInputDialogWidth = 1000
const inputDialogWidth = ref(maxInputDialogWidth)
const currentPool = computed(() => props.currentPool)
const payData = ref<any>([])
const appStore = useAppStore()

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
    inputDialogWidth.value = Math.min(maxInputDialogWidth, document.documentElement.offsetWidth - 20)
  }
})

watch(
  () => props.payData,
  async (data) => {
    if (data && visible.value) {
      payData.value = [data]
      appStore.updateTransferList(data)
    }
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <el-dialog class="custom-dialog" :width="inputDialogWidth" v-model="visible">
    <div class="swap-result-dialog">
      <el-result class="swap-result" icon="success" title="Payment success"></el-result>
      <div>
        <h4>Pay Data</h4>
        <el-table :data="payData" :show-header="false" style="margin-bottom: 12px">
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
              <DogLink v-if="s.row.txid" is-copy :to="`https://chain.so/tx/DOGE/${s.row.txid}`" :label="omitCenterString(s.row.txid, 12)" :value="s.row.txid"></DogLink>
            </template>
          </el-table-column>
          <el-table-column label="In" width="150px">
            <template #default="s">
              {{ consumeToken(s.row.swapType, s.row.inTokenA, s.row.inTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB) }}
            </template>
          </el-table-column>
          <el-table-column label="Out" width="200px">
            <template #default="s">
              {{ consumeToken(s.row.swapType, s.row.outTokenA, s.row.outTokenB, props.currentPool?.tokenA, props.currentPool?.tokenB, false) }}
            </template>
          </el-table-column>
          <el-table-column label="Date" prop="date" width="190px"></el-table-column>
        </el-table>
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
<style lang="scss" scoped>
.swap-result-dialog {
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  padding: 50px 20px 20px;
}
</style>
