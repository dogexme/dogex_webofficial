<script lang="ts">
import { Loading, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { PropType } from 'vue'

export default {
  props: {
    status: {
      type: [String, Number] as PropType<'0' | '1' | '2'>,
      required: true,
    },
  },
  setup(props) {
    const status = computed(() => props.status)
    const StatusMap = {
      0: Loading,
      1: SuccessFilled,
      2: CircleCloseFilled,
    }
    const iconComp = computed(() => StatusMap[status.value])
    return {
      iconComp,
      status,
    }
  },
}
</script>

<template>
  <el-icon v-if="iconComp" style="font-size: 16px" :class="{ 'is-loading': status == '0' }" :style="[status == '1' && { color: '#67C23A' }, status == '2' && { color: '#F56C6C' }]">
    <component :is="iconComp"></component>
  </el-icon>
  <span v-else>-</span>
</template>

<style lang="scss" scoped>
.tokenIcon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>
