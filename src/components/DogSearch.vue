<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    loading: boolean
    size: 'default' | 'small'
  }>(),
  {
    modelValue: '',
    loading: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const text = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emit('update:modelValue', val)
  },
})
</script>
<template>
  <form @submit.prevent class="nav-search_inputwrap">
    <i class="dog-icon dog-icon_search"></i>
    <input class="nav-search-input" type="text" maxlength="128" placeholder="Deploy Hash" v-model="text" />
    <el-icon v-if="loading" class="loading-icon"><Loading /></el-icon>
    <el-icon v-if="!loading && text.length" style="cursor: pointer" @click="text = ''"><CircleCloseFilled /></el-icon>
  </form>
</template>

<style lang="scss" scoped>
.nav-search-input {
  flex: 1;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  margin-right: 10px;
  margin-left: 10px;
  font-family: SistemnyjC;
}
.nav-search_inputwrap {
  position: relative;
  display: flex;
  align-items: center;
  align-self: center;
  width: 95%;
  max-width: 740px;
  height: 12vmin;
  max-height: 66px;
  background: #fff;
  padding: 0 24px;
  border-radius: 40px;
  box-sizing: border-box;
  border: 1px solid #333;
  outline: 3px solid #ddc2f9;
  box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
