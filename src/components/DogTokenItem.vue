<script setup lang="ts">
// import { omitCenterString } from '@/utils'
const props = defineProps<{
  imgSrc?: string
  tokenId?: string | number
  owner?: string
  baseUrl?: string
}>()
</script>
<template>
  <div class="dog-token-item">
    <div class="dog-token-item_img">
      <el-image v-if="props.baseUrl" :src="props.imgSrc" :style="{ borderRadius: '8px' }"> </el-image>
      <div class="el-image__error" style="width: 100%; height: 230px" v-else>#{{ props.tokenId }}</div>
    </div>
    <div class="dog-token-item_row">
      <span class="dog-token-item_label">Token ID: </span>
      <span class="dog-token-item_value">{{ props.tokenId }}</span>
    </div>
    <!-- <div class="dog-token-item_row">
      <span class="dog-token-item_label">Owner: </span>
      <span class="dog-token-item_value"><DogLink is-copy :label="omitCenterString(props.owner, 24)" :value="props.owner"></DogLink></span>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.dog-token-item {
  height: 250px;
  padding: 12px 12px 24px 12px;
  border-radius: 8px;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #000;
  background-color: #fff;
  font-size: 12px;
  &_row {
    line-height: 2;
    word-break: break-all;
  }
  &_label {
    font-weight: 500;
    color: #737373;
  }
}
</style>
