<script setup lang="ts">
import clipboard3 from 'vue-clipboard3'
import { CopyDocument, Select } from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  to?: string
  label?: string
  value?: string
  isCopy?: boolean
  disabledTooltip?: boolean
  route?: boolean
}>()

const emit = defineEmits(['click'])

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
      <router-link class="doglink_link" v-if="props.to && props.route" :to="props.to" @click.stop="emit('click', props.value)">{{
        props.label
      }}</router-link>
      <a class="doglink_link" v-else-if="props.to" :href="props.to" target="_blank" @click.stop="emit('click', props.value)">{{ props.label }}</a>
      <span class="doglink_link" @click.stop="emit('click', props.value)" v-else>{{ props.label }}</span>
    </el-tooltip>
    <el-icon class="copy-icon" @click.stop="copy(props.value)" v-if="props.isCopy && !isCopySuccess">
      <CopyDocument />
    </el-icon>
    <el-tooltip :hide-after="1000" effect="dark" content="Copied!" placement="top" v-if="props.isCopy && isCopySuccess">
      <el-icon class="copy-icon" @click.stop>
        <Select />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss">
.doglink {
  display: inline;
  &_link,
  &_link:hover {
    color: #f9b864;
  }
}
.copy-icon {
  margin-left: 12px;
  cursor: pointer;
}
</style>
