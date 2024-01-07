<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    item: any
    icon: string
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'remove', pi: any): void
}>()

const pi = computed(() => props.item)
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
      </div>
    </div>
    <DogeButton class="remove-btn" type="warn" @click="emit('remove', pi)" style="margin: 0; line-height: 1.5; background-color: rgb(186, 119, 255)" v-if="pi.status == 1">Remove</DogeButton>
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
</style>
