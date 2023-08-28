<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean,
  list: TokenSwapInfo[]
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible) {
    emit('update:modelValue', isVisible)
  }
})

</script>
<template>
  <el-dialog title="选择代币" width="500px" v-model="visible" align-center append-to-body>
    <div style="min-height: 350px">
      <el-button v-for="t in props.list" @click="emit('change', t)">{{ t.tokenB }}</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss"></style>
