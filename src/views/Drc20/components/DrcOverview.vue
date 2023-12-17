<script setup lang="ts">
import { omitCenterString, numberFormat } from '@/utils'

const props = withDefaults(
  defineProps<{
    tickInfo?: any
  }>(),
  {
    tickInfo: () => ({}),
  }
)
</script>

<template>
  <div class="coll-info">
    <div class="coll-info_item" v-if="props.tickInfo.tick">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Logo</div>
      <div class="coll-info_item_value">
        <div class="coll-logo-wrap">
          <el-image
            class="coll-logo-img"
            :src="`https://raw.githubusercontent.com/dpalwallet/logoasserts/main/asserts/${props.tickInfo.tick == 'dogi' ? 'dogim' : props.tickInfo.tick}.png`"
            fit="cover"
          >
            <template #error>
              <div class="el-image__error">{{ props.tickInfo.tick }}</div>
            </template>
          </el-image>
        </div>
      </div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Tick</div>
      <div class="coll-info_item_value">{{ props.tickInfo.tick }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Lim</div>
      <div class="coll-info_item_value">{{ props.tickInfo.max && numberFormat(props.tickInfo.lim) }}</div>
    </div>
    <div class="coll-info_item">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Max</div>
      <div class="coll-info_item_value">{{ numberFormat(props.tickInfo.max) }}</div>
    </div>
    <div class="coll-info_item" v-if="props.tickInfo.mintVal !== undefined">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Mintval</div>
      <div class="coll-info_item_value">{{ numberFormat(props.tickInfo.mintVal) }}</div>
    </div>
    <div class="coll-info_item" v-if="props.tickInfo.holders !== undefined">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Holders</div>
      <div class="coll-info_item_value">{{ numberFormat(props.tickInfo.holders) }}</div>
    </div>
    <div class="coll-info_item" v-if="props.tickInfo.deployer">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Deployer</div>
      <div class="coll-info_item_value">
        <DogLink route :to="`/address/${props.tickInfo.deployer}`" is-copy :label="omitCenterString(props.tickInfo.deployer)" :value="props.tickInfo.deployer"></DogLink>
      </div>
    </div>
    <div class="coll-info_item" v-if="props.tickInfo.block">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Block</div>
      <div class="coll-info_item_value">{{ numberFormat(props.tickInfo.block) }}</div>
    </div>
    <div class="coll-info_item" v-if="props.tickInfo.txid">
      <div class="coll-info_item_label"><i class="dog-icon dog-icon_jiantou-right"></i>Txid</div>
      <div class="coll-info_item_value"><DogLink is-copy style="cursor: pointer" :label="omitCenterString(props.tickInfo.txid, 24)" :value="props.tickInfo.txid"></DogLink></div>
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
