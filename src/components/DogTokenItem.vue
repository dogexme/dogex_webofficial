<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  tokenId?: string
  owner?: string
}>()
</script>
<template>
  <div class="dog-token-item">
    <div class="dog-token-item_img">
      <el-image :src="props.imgSrc" :style="{ borderRadius: '8px' }"></el-image>
    </div>
    <div class="dog-token-item_row">
      <span class="dog-token-item_label">Token ID: </span>
      <span class="dog-token-item_value">{{ props.tokenId }}</span>
    </div>
    <div class="dog-token-item_row">
      <span class="dog-token-item_label">Owner: </span>
      <span class="dog-token-item_value">{{ props.owner }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dog-token-item {
  display: inline-block;
  width: 16.66666666666666%;
  box-sizing: border-box;
  height: 260px;
  padding: 12px 12px 24px 12px;
  border-radius: 8px;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #000;
  background-color: #fff;
  font-size: 12px;
  &_row {
    line-height: 2;
  }
  &_label {
    font-weight: 500;
    color: #737373;
  }
}
</style>
