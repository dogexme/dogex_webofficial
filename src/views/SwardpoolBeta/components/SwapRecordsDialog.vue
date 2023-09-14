<script setup lang="ts">
import { queryTransferStatus } from '@/services/sword'
import { getSwapType, consumeToken, StatusType } from './TransferTable'
import { Loading } from '@element-plus/icons-vue'
import { omitCenterString } from '@/utils'
import { useAppStore } from '@/store';

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

const currentPool = computed(() => props.currentPool)
const payData = ref<any>([])
const timer = ref(0)
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
  if (!isVisible) {
    stopStatusLoop()
  }
})

watch(() => props.payData, async (data) => {
  if (data && visible.value) {
    payData.value = [data]
    appStore.updateTransferList(data)
    queryStatusLoop(data)
  }
}, {
  immediate: true
})

async function queryStatusLoop(data: any) {
  try {
    const res = await queryTransferStatus(data.txid)
    const resData = res.data.data

    if (res.data.status == 'failed') {
      data.status = '0'
    } else if(resData.status != '0') {
      data.status = resData.status
    }

    if (data.status != '0') {
      appStore.updateTransferList()
      return stopStatusLoop()
    }

    if(resData.status == '0') {
      timer.value = window.setTimeout(() => queryStatusLoop(data), 1000)
    }
  } catch {
    stopStatusLoop()
  }
}

function stopStatusLoop() {
  clearTimeout(timer.value)
}

</script>
<template>
  <el-dialog class="custom-dialog" width="800px" v-model="visible">
    <div class="swap-result-dialog">
      <el-result class="swap-result" icon="success" title="Payment success"></el-result>
      <div>
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
