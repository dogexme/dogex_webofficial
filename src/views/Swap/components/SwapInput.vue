<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    modelValue?: number
    currentPool?: object
  }>(),
  {
    modelValue: 0,
  }
)
const emit = defineEmits(['update:modelValue', 'focus', 'selectToken'])

const amount = computed({
  get() {
    return props.modelValue
  },
  set(amount: number) {
    emit('update:modelValue', amount)
  },
})
</script>

<template>
  <div class="swap-pair_item">
    <span class="swap-pair_item_title">{{ props.title }}</span>
    <section class="swap-pair_main">
      <div class="swap-pair_inputwrap">
        <input type="number" class="swap-pair_input" v-model.number="amount"  :min="0" :step="1" placeholder="请输入金额" @focus="emit('focus')" />
      </div>
      <div class="swap-pair_token" @click="emit('selectToken')">
        Doge<span class="nft" style="font-size: 12px">&#xeb6d;</span>
      </div>
    </section>
    <!-- <section class="swap-pair_amount">
      <span class="swap-pair_amount_real">$1.5554</span>
      <span class="swap-pair_amount_wallet">余额：0</span>
    </section> -->
  </div>
</template>

<style lang="scss" scoped>
.swap-pair {
  &_item {
    padding: 12px;
    border: 2px solid #333;
    border-radius: 10px;
    background-color: #fff;
  }
  &_item_title {
    font-size: 13px;
  }
  &_main {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  &_inputwrap {
    flex: 1;
  }
  &_input {
    width: 100%;
    border: none;
    outline: 0;
    font-size: 32px;
    background-color: transparent;
    padding: 0;
    margin-right: 12px;
    /* chrome */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    /* 火狐浏览器 */
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }
  &_token {
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
</style>
