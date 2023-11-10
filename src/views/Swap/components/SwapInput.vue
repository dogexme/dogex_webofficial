<script setup lang="ts">
import icons from '@/config/payIcons'
import { TokenSwapInfo, TokenInputName } from '@/services/types'

const props = withDefaults(
  defineProps<{
    title: string
    modelValue?: number | ''
    currentPool?: TokenSwapInfo
    min?: number
    name: TokenInputName
    loading?: boolean
    pools: any[]
    price: number
    disabled: boolean
    swapType: 'SWAP_A_B' | 'SWAP_B_A'
  }>(),
  {
    min: 0,
    modelValue: 0,
    loading: false,
    disabled: false,
  }
)
const emit = defineEmits<{
  (event: 'selectToken'): void
  (event: 'update:modelValue', amount: number | ''): void
  (event: 'focus'): void
  (event: 'changePool', poolid: string): void
}>()

const currentPool = computed(() => {
  return props.currentPool
})

const amount = computed({
  get() {
    return props.modelValue
  },
  set(amount: number | '') {
    emit('update:modelValue', amount)
  },
})

function formattedValue() {
  // 移除非数字字符
  let value = amount.value.toString()

  const decimalIndex = value.indexOf('.')
  if (decimalIndex !== -1) {
    value = value.slice(0, decimalIndex + props.price + 1)
  }

  amount.value = value == '' ? value : +value
}

function changePool(poolid: string) {
  emit('changePool', poolid)
}
</script>

<template>
  <div class="swap-pair_item">
    <div style="display: flex; justify-content: space-between">
      <span class="swap-pair_item_title">{{ props.title }}</span>
      <el-link href="https://github.com/dpalwallet/swordpool" style="font-size: 12px" target="_blank" v-if="props.name == 'rev'">
        <img class="token-icon" src="/logo.png" alt="" style="width: 16px; height: 16px" />
        Swordpool Rule
      </el-link>
      <div class="swap-pair_select" v-if="props.swapType == 'SWAP_B_A' && props.name == 'pay'" @click="emit('selectToken')">Select></div>
    </div>
    <section class="swap-pair_main">
      <div class="swap-pair_inputwrap">
        <input
          type="number"
          class="swap-pair_input"
          @input="formattedValue"
          v-model="amount"
          :min="props.min"
          :step="1"
          :style="[props.loading ? { color: '#a5a5a5' } : {}]"
          placeholder="Please enter the amount"
          @focus="emit('focus')"
          :disabled="props.disabled"
          title=""
        />
      </div>
      <el-dropdown trigger="click" :disabled="props.loading" @command="changePool" @visible-change="(isVisible) => isVisible && emit('focus')" v-if="props.pools.length && currentPool">
        <div class="swap-pair_token">
          <img class="token-icon" v-if="currentPool?.tokenB && icons[currentPool.tokenB]" :src="icons[currentPool.tokenB]" alt="" />{{ currentPool?.tokenB
          }}<span class="nft" style="font-size: 12px">&#xeb6d;</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in pools" :key="item.poolid" :command="item.poolid" :disabled="item.status != 0">
              <img class="token-icon" v-if="item?.tokenB && icons[item.tokenB]" :src="icons[item.tokenB]" alt="" />{{ item?.tokenB }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="swap-pair_token" style="cursor: default" v-else><img class="token-icon" :src="icons.doge" alt="" />doge</div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.swap-pair {
  &_item {
    padding: 12px;
    border: 1px solid #b7b7b7;
    border-radius: 10px;
    background-color: #fff;
  }
  &_item_title {
    font-size: 13px;
  }
  &_select {
    color: #333;
    cursor: pointer;
    &:hover {
      color: #ffa21e;
    }
  }
  &_main {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  &_inputwrap {
    flex: 1;
    margin-right: 12px;
  }
  &_input {
    width: 100%;
    border: none;
    outline: 0;
    font-size: 32px;
    background-color: transparent;
    padding: 0;
    &::placeholder {
      font-size: 18px;
    }
    /* chrome */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    /* 火狐浏览器 */
    &[type='number'] {
      appearance: textfield;
    }
  }
  &_token {
    display: flex;
    align-items: center;
    border: 1px solid #333;
    padding: 4px 8px;
    border-radius: 15px;
    font-size: 14px;
    cursor: pointer;
    outline: 0;
  }
  &_amount {
    display: flex;
    justify-content: space-between;
  }
}
.token-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
