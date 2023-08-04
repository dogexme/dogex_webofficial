<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: string
    size?: string
    show?: boolean
  }>(),
  {
    color: 'rgb(29, 155, 240)',
    size: '16px',
    show: false,
  }
)
</script>
<template>
  <div class="dog-coll-valid">
    <slot></slot>
    <DogValidSvgIcon v-if="props.show" class="valid-icon" :style="{ fill: props.color, width: props.size, height: props.size }"></DogValidSvgIcon>
  </div>
</template>

<style lang="scss">
.dog-coll-valid {
  position: relative;
  display: inline-flex;
  .valid-icon {
    position: absolute;
    right: -8px;
    bottom: -7px;
  }
}
</style>
