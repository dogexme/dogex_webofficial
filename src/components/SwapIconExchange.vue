<script lang="ts">
import { Right } from '@element-plus/icons-vue'
import { getTokenIcon } from '@/config/payIcons'

export default {
  components: {
    Right,
  },
  props: {
    iconA: {
      type: String,
      required: true,
    },
    iconB: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const iconASrc = computed(() => getTokenIcon(props.iconA))
    const iconBSrc = computed(() => getTokenIcon(props.iconB))
    return {
      iconASrc,
      iconBSrc,
    }
  },
}
</script>

<template>
  <div style="display: flex; align-items: center">
    <img class="tokenIcon" :src="iconASrc" />
    <el-icon style="font-size: 18px; margin: 0 6px"><Right /></el-icon>
    <img class="tokenIcon" :src="iconBSrc" />
  </div>
</template>

<style lang="scss" scoped>
.tokenIcon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>
