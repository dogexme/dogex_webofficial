<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'

const props = defineProps<{
  title: string
  back?: boolean
}>()

const emit = defineEmits<{
  (event: 'back'): void
}>()
</script>
<template>
  <div class="dialog-title">
    <div class="flex h-5 items-center pt-2">
      <el-icon class="cursor-pointer p-2" v-if="props.back" @click="emit('back')"><Back /></el-icon>
      <h2 class="text-base m-0" :class="[!props.back && 'ml-2']">{{ props.title }}</h2>
    </div>
    <el-divider />
  </div>
</template>
