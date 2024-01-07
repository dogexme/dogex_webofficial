<script lang="ts">
import TokenIcons from '@/config/payIcons'

export default {
  props: {
    iconA: {
      type: String,
      required: true,
    },
    iconB: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const iconASrc = computed(() => TokenIcons[props.iconA])
    const iconBSrc = computed(() => TokenIcons[props.iconB])
    const imgs = ref<any[]>([])
    const tokenSrc = ref<any>('')

    if (props.token == props.iconA) {
      imgs.value = [iconASrc.value, iconBSrc.value]
      tokenSrc.value = iconASrc.value
    } else {
      imgs.value = [iconBSrc.value, iconASrc.value]
      tokenSrc.value = iconBSrc.value
    }

    return {
      iconASrc,
      iconBSrc,
      imgs,
      tokenSrc,
    }
  },
}
</script>

<template>
  <div class="flex justify-center items-end">
    <img class="tokenIcon" :class="[tokenSrc == s && 'tokenIcon--top']" :src="s" v-for="s in imgs" :key="s" />
  </div>
</template>

<style lang="scss" scoped>
.tokenIcon {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  &--top {
    border-color: #fff;
    margin-right: -10px;
    z-index: 1;
  }
}
</style>
