<script setup lang="ts">
import clipboard3 from 'vue-clipboard3'
import { CopyDocument, Select } from '@element-plus/icons-vue'

const props = defineProps<{
  to?: string
  label?: string
  value?: string
  isCopy?: boolean
}>()

const { toClipboard } = clipboard3()
const isCopySuccess = ref(false)

async function copy(value: string) {
  if (isCopySuccess.value) return
  await toClipboard(value)
  isCopySuccess.value = true
  setTimeout(() => {
    isCopySuccess.value = false
  }, 1000)
}
</script>

<template>
  <div class="doglink" v-if="props.value">
    <a v-if="props.to" :href="props.to" target="_blank">{{ props.label }}</a>
    <span v-else>{{ props.label }}</span>
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
}
.copy-icon {
  margin-left: 12px;
  cursor: pointer;
}
</style>
