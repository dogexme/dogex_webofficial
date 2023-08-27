<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible) {
    emit('update:modelValue', isVisible)
  }
})

onMounted(() => {

})

</script>
<template>
  <el-dialog title="选择代币" v-model="visible" align-center append-to-body>

  </el-dialog>
</template>
<style lang="scss"></style>
