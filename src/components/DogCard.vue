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
  <div class="dog-card">
    <div class="dog-card_title" v-if="props.title" :style="[props.isBack ? { cursor: 'pointer' } : {}]" @click="goBack">
      <el-icon v-if="props.isBack" style="margin-right: 12px"><Back /></el-icon>
      <h2 class="dog-card_title_text">{{ props.title }}</h2>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.dog-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #000;
  background-color: #fff;
  &_title {
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
}
</style>
