<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentPage?: number
    defaultPageSize?: number
    total?: number
    totalText?: string
    jumpPage?: string | number
  }>(),
  {
    defaultPageSize: 15,
    currentPage: 1,
    total: 0,
    jumpPage: '',
  }
)
const emit = defineEmits(['current-change', 'update:currentPage', 'update:jumpPage'])
const currentPage = computed({
  get() {
    return props.currentPage
  },
  set(page) {
    emit('update:currentPage', page)
  },
})

const jumpPage = computed({
  get() {
    return props.jumpPage
  },
  set(jumpPage) {
    emit('update:jumpPage', jumpPage)
  },
})
const pages = computed(() => Math.ceil(props.total / props.defaultPageSize))

watch(currentPage, (page) => {
  emit('current-change', page)
})

function handlerJumpPage() {
  if (!/^-?\d+$/.test(String(jumpPage.value))) {
    return
  }

  let jumpNumber = +jumpPage.value

  if (jumpNumber <= 0) {
    jumpNumber = 1
  }

  if (jumpNumber > pages.value) {
    jumpNumber = pages.value
  }

  jumpPage.value = currentPage.value = jumpNumber
}
</script>

<template>
  <div class="dog-page">
    <div class="dog-page_total">{{ props.totalText }}</div>
    <div class="dog-page_control">
      <div class="dog-page_control_item dog-page_control_first" @click="currentPage > 1 && (currentPage = 1)" :class="[currentPage == 1 && 'dog-page_control_item--disabled']">First</div>
      <div class="dog-page_control_item dog-page_control_prev" @click="currentPage > 1 && currentPage--" :class="[currentPage == 1 && 'dog-page_control_item--disabled']">&lt;</div>
      <div class="dog-page_control_item dog-page_control_input-item dog-page_control_page" style="cursor: none; padding: 0 8px">
        <input v-model="jumpPage" class="dog-page_control_input" :placeholder="`Page 1 of ${pages}`" type="text" @keydown.enter="handlerJumpPage" />
      </div>
      <div class="dog-page_control_item dog-page_control_next" @click="currentPage < pages && currentPage++" :class="[currentPage == pages && 'dog-page_control_item--disabled']">&gt;</div>
      <div class="dog-page_control_item dog-page_control_last" @click="currentPage < pages && (currentPage = pages)" :class="[currentPage == pages && 'dog-page_control_item--disabled']">Last</div>
    </div>
  </div>
</template>

<style lang="scss">
.dog-page {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dog-page_control {
  display: flex;
  &_input {
    width: 100%;
    height: 100%;
    border: none;
    outline: 0;
    background-color: transparent;
    padding: 0;
    &::placeholder {
      color: #000;
    }
  }
  &_item {
    line-height: 1;
    margin-left: 12px;
    padding: 5px 8px;
    border-radius: 8px;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #000;
    background-color: #fafafa;
    font-size: 14px;
    cursor: pointer;
    &:first-child {
      margin-left: 0;
    }
    &--disabled {
      box-shadow: none;
      border: solid 1px #ccc;
      background-color: #f5f5f5;
      cursor: no-drop;
    }
  }
  &_input-item {
    max-width: 103px;
    box-shadow: none;
    border: solid 1px #ccc;
    background-color: #f5f5f5;
  }
}
</style>
