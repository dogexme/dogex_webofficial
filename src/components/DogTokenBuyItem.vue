<script setup lang="ts">
import { omitCenterString } from '@/utils'
const props = defineProps<{
  imgSrc?: string
  tokenId?: string | number
  owner?: string
  baseUrl?: string
}>()

const emit = defineEmits(['click-buy'])
</script>
<template>
  <div class="dog-token-item dog-token-item--hover">
    <div class="dog-token-item_img">
      <el-image class="dog-token-item_imgitem" :src="props.imgSrc">
        <template #error>
          <div class="el-image__error dog-token-item_error">#{{ props.tokenId }}</div>
        </template>
      </el-image>
    </div>
    <div class="dog-token-item_row">
      <span class="dog-token-item_label">Token ID: </span>
      <span class="dog-token-item_value">#15</span>
    </div>
    <div class="dog-token-item_row">
      <span class="dog-token-item_label">Hash: </span>
      <span class="dog-token-item_value"
        ><DogLink
          is-copy
          :label="omitCenterString('1ba28f9aeebb6831fb4f2ecc8484acdcce96c10d12ee203ac1b5fbe769c6dfff', 10)"
          :value="'1ba28f9aeebb6831fb4f2ecc8484acdcce96c10d12ee203ac1b5fbe769c6dfff'"
        ></DogLink
      ></span>
    </div>
    <div class="dog-token-item_row dog-token-item--amount">
      <span class="dog-token-item_label">1ÐOGE</span>
      <span class="dog-token-item_label">$1.588</span>
    </div>
    <div class="dog-token-item_buyBtn" @click="emit('click-buy', props)">Buy</div>
  </div>
</template>

<style lang="scss" scoped>
.dog-token-item {
  padding: 12px;
  border-radius: 8px;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #000;
  background-color: #fff;
  font-size: 12px;
  &--hover {
    transition: all 0.5s;
    &:hover {
      border-color: #da70d6;
    }
  }
  &--amount {
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    margin: 10px 0px;
    display: flex;
    justify-content: space-between;
  }
  &_row {
    line-height: 2;
    word-break: break-all;
  }
  &_label {
    font-weight: 500;
    color: #737373;
  }
  &_img {
    position: relative;
    width: 100%;
    padding-top: 100%;
    margin-bottom: 10px;
  }
  &_placeholder {
    background-color: red;
  }
  &_imgitem {
    position: absolute;
    border-radius: 8px;
    inset: 0;
  }
  &_buyBtn {
    line-height: 35px;
    color: #fff;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    background-color: #da70d6;
    transition: all 0.2s;
    &:hover {
      background-color: #ee7bea;
    }
  }
}
</style>
