<script setup lang="ts">
import { CollInfo } from '@/types'
import { dateFormat, omitCenterString, numberFormat } from '@/utils'

const props = withDefaults(
  defineProps<{
    collInfo?: Partial<CollInfo>
  }>(),
  {
    collInfo: () => ({}),
  }
)
</script>

<template>
  <div class="coll-info">
    <div class="coll-info_item" v-if="props.collInfo.logo">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Logo</div>
      <div class="coll-info_item_value">
        <div class="coll-logo-wrap">
          <DogCollValid :show="collInfo.valid == 0">
            <el-image class="coll-logo-img" :src="props.collInfo.logo" fit="cover" />
          </DogCollValid>
        </div>
      </div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Tick</div>
      <div class="coll-info_item_value">{{ props.collInfo.tick }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Max</div>
      <div class="coll-info_item_value">{{ props.collInfo.max && numberFormat(props.collInfo.max) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Mintval</div>
      <div class="coll-info_item_value">{{ props.collInfo.mintval && numberFormat(props.collInfo.mintval) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Deployer</div>
      <div class="coll-info_item_value">
        <DogLink
          route
          :to="`/address/${props.collInfo.deployer}`"
          is-copy
          :label="omitCenterString(props.collInfo.deployer)"
          :value="props.collInfo.deployer"
        ></DogLink>
      </div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Holders</div>
      <div class="coll-info_item_value">{{ props.collInfo.holders && numberFormat(props.collInfo.holders) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Date</div>
      <div class="coll-info_item_value">{{ props.collInfo.date && dateFormat(new Date(props.collInfo.date)) }}</div>
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
