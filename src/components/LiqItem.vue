<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    item: any
    icon: string
    bg?: string
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'remove', pi: any): void
}>()

const pi = computed(() => props.item)
const LINE_NUM = 10
</script>

<template>
  <div class="liq-card_item relative flex box-border cursor-pointer p-3 rounded-xl mb-4" v-loading="pi.loading">
    <div class="flex items-center">
      <el-image style="width: 42px; height: 42px; border-radius: 12px" :src="icon"></el-image>
    </div>
    <div class="flex flex-col justify-around ml-5">
      <div>
        <span class="text-xs">Block No: </span>
        <span class="text-black text-sm">{{ pi.addBlockno }}</span>
      </div>
      <div class="flex flex-col whitespace-nowrap">
        <p class="m-0">
          <span class="text-xs">In: </span>
          <span class="text-sm text-black">{{ pi.in }}</span>
        </p>
        <p class="m-0">
          <span class="text-xs">Expect Out: </span>
          <span class="text-sm text-black">{{ pi.out }}</span>
        </p>
        <p class="m-0">
          <span class="text-xs">Position: </span>
          <span class="text-sm text-black" :style="{ color: bg }">{{ pi.outProportionFormat }}</span>
        </p>
      </div>
    </div>
    <el-tooltip content="Lines exceeding oversell cannot be removed." placement="left">
      <div class="prop-wrapper flex h-4" :style="{ color: bg }">
        <div
          class="prop-wrapper_item h-full"
          style="width: 2px; background-color: currentColor"
          :style="{ opacity: Math.max(LINE_NUM * pi.outProportion, 1) < n ? 0.5 : 1 }"
          v-for="n in LINE_NUM"
          :key="n"
        ></div>
      </div>
    </el-tooltip>
    <DogeButton
      class="remove-btn"
      type="warn"
      :disabled="pi.outProportion >= 1"
      @click="emit('remove', pi)"
      style="margin: 0; line-height: 1.5; background-color: rgb(186, 119, 255)"
      v-if="pi.isRemove"
      >Remove</DogeButton
    >
  </div>
</template>

<style lang="scss" scoped>
.liq-card_item {
  overflow: hidden;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 165, 0, 0.35);
  &:hover {
    box-shadow:
      inset 0 -5px 0 0 rgba(0, 0, 0, 0.1),
      4px 4px 10px 1px rgba(0, 0, 0, 0.1);

    .remove-btn {
      transform: translateX(0);
    }
  }
}

.remove-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  transform: translateX(calc(150%));
}

.prop-wrapper {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  &_item {
    margin-right: 1px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
