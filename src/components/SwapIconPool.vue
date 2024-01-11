<script lang="ts">
import TokenIcons from '@/config/payIcons'
import { Plus, Minus, Right } from '@element-plus/icons-vue'

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
    type: {
      type: Number,
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
  components: { Plus, Minus, Right },
}
</script>

<template>
  <div class="flex justify-center items-center">
    <div
      class="tokenIcon flex justify-center items-center tokenIcon--flag"
      :style="{ background: type == 0 ? 'rgb(64, 180, 105)' : 'rgb(255, 90, 80)' }"
    >
      <el-icon color="#fff"><Plus v-if="type == 0" /><Minus v-if="type == 1" /></el-icon>
    </div>
    <el-icon style="font-size: 18px; margin: 0 6px"><Right /></el-icon>
    <img class="tokenIcon" :src="tokenSrc" />
  </div>
</template>

<style lang="scss" scoped>
.tokenIcon {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;

  &--top {
    border-color: #fff;
    margin-right: -10px;
    z-index: 1;
  }

  &--flag {
    background-color: rgb(255, 194, 0);
  }
}
</style>
