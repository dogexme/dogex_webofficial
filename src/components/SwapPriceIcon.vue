<script lang="ts">
import { getTokenIcon } from '@/config/payIcons'

export default {
  props: {
    tokenName: {
      type: String,
      required: true,
    },
    price: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const icon = computed(() => getTokenIcon(props.tokenName))
    const price = computed(() => props.price)
    return {
      icon,
      price,
    }
  },
}
</script>

<template>
  <div style="display: inline-flex; align-items: center">
    {{ price }}
    <img class="tokenIcon" :src="icon" />
  </div>
</template>

<style lang="scss" scoped>
.tokenIcon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 6px;
}
</style>
