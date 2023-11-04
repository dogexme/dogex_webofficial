<script setup lang="ts">
import { numberFormat } from '@/utils'
import NP from 'number-precision'

const props = withDefaults(
  defineProps<{
    tokenInfo?: any
  }>(),
  {
    tokenInfo: () => ({}),
  }
)
</script>

<template>
  <div class="coll-info">
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Tick</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.tick }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Supply</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.max && numberFormat(props.tokenInfo.max) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Lim</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.lim && numberFormat(props.tokenInfo.lim) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Mint Out</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.mint_val && numberFormat(props.tokenInfo.mint_val) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Progress</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.mint_over && NP.round(props.tokenInfo.mint_over, 2) * 100 }}%</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Holder</div>
      <div class="coll-info_item_value">{{ props.tokenInfo.holder_count && numberFormat(props.tokenInfo.holder_count) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coll-info {
  &_item {
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
  }
  &_item_label {
    display: flex;
    align-items: center;
    flex: 1;
    &--link {
      cursor: pointer;
      // color: rgb(220, 200, 244);
    }
  }
  &_item_value {
    flex: 1;
    word-break: break-all;
  }
}

.coll-logo-wrap {
  position: relative;
  display: inline-flex;
  .coll-logo-img {
    --size: 48px;
    width: var(--size);
    height: var(--size);
    border-radius: 5px;
  }
}

.dog-icon_jiantou-right {
  margin-right: 5px;
}
</style>
