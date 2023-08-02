<script setup lang="ts">
import clipboard3 from 'vue-clipboard3'
import { CopyDocument, Select } from '@element-plus/icons-vue'

const props = defineProps<{
  to?: string
  label?: string
  value?: string
  isCopy?: boolean
  disabledTooltip?: boolean
}>()

const { toClipboard } = clipboard3()
const isCopySuccess = ref(false)

async function copy(value?: string) {
  if (isCopySuccess.value || !value) return
  await toClipboard(value)
  isCopySuccess.value = true
  setTimeout(() => {
    isCopySuccess.value = false
  }, 1000)
}
</script>

<template>
  <div class="doglink" v-if="value">
    <el-tooltip :hide-after="0" :disabled="disabledTooltip" effect="dark" :content="props.value" placement="top">
      <a class="doglink_link" v-if="props.to" :href="props.to" target="_blank">{{ props.label }}</a>
      <span class="doglink_link" v-else>{{ props.label }}</span>
    </el-tooltip>
    <el-icon class="copy-icon" @click="copy(props.value)" v-if="props.isCopy && !isCopySuccess">
      <CopyDocument />
    </el-icon>
    <el-icon class="copy-icon" @click="copy(props.value)" v-if="props.isCopy && isCopySuccess">
      <Select />
    </el-icon>
  </div>
</template>

<style lang="scss">
.doglink {
  display: flex;
  align-items: center;
  &_link {
    color: #f9b864;
  }
}
.copy-icon {
  margin-left: 12px;
  cursor: pointer;
}
</style>
