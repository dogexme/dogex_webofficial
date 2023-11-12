<script setup lang="ts">
import { CircleCloseFilled, Loading } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    loading?: boolean
  }>(),
  {
    modelValue: '',
    loading: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search'): void
  (event: 'clear'): void
}>()

const text = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    emit('update:modelValue', val)
  },
})

function search() {
  if (props.loading) {
    return
  }
  text.value = text.value.trim()
  emit('search')
}

function clear() {
  text.value = ''
  emit('clear')
}
</script>
<template>
  <form @submit.prevent class="nav-search_inputwrap">
    <i class="dog-icon dog-icon_search" style="width: 12px; height: 12px"></i>
    <input class="nav-search-input" type="text" maxlength="128" placeholder="Address" v-model="text" @keydown.enter="search" />
    <el-icon v-if="props.loading" class="loading-icon"><Loading /></el-icon>
    <el-icon v-if="!props.loading && text.length" style="cursor: pointer" @click="clear"><CircleCloseFilled /></el-icon>
  </form>
</template>

<style lang="scss" scoped>
.nav-search_inputwrap {
  display: flex;
  align-items: center;
  align-self: center;
  width: 340px;
  height: 32px;
  background: #fff;
  padding: 0 12px;
  border-radius: 15px;
  box-sizing: border-box;
  border: 1px solid #333;
  box-shadow: inset 0 -2px 0 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  @media screen and (max-width: 600px) {
    width: 280px;
  }
}

.nav-search-input {
  flex: 1;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 12px;
  margin: 0 8px;
}
</style>
