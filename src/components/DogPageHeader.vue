<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'

const router = useRouter()
const props = defineProps<{
  title?: string
  isBack?: boolean
}>()

function goBack() {
  if (!props.isBack) return
  router.back()
}
</script>

<template>
  <div class="dog-page-header" v-if="props.title" :style="[props.isBack ? { cursor: 'pointer' } : {}]" @click="goBack">
    <el-icon v-if="props.isBack" style="margin-right: 12px"><Back /></el-icon>
    <h2 class="dog-page-header_text">{{ props.title }}</h2>
  </div>
</template>

<style lang="scss">
.dog-page-header {
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px 0;
  &_text {
    line-height: 1;
    font-size: 14px;
    margin: 0;
  }
}
</style>
