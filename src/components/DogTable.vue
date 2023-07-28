<script setup lang="ts">
const props = defineProps({
  layout: {
    type: String,
    default: 'prev, pager, next',
  },
  defaultPageSize: {
    type: Number,
    default: 15,
  },
  total: {
    type: Number,
    default: 15,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['current-change'])
const containerRef = ref<HTMLElement>()

function scrollTo(x: number, y: number) {
  containerRef.value?.scrollTo(x, y)
}

defineExpose({
  scrollTo,
})
</script>
<template>
  <div class="table-wrapper">
    <div class="table-container" ref="containerRef">
      <table>
        <slot></slot>
      </table>
    </div>
    <el-pagination :current-page="currentPage" :layout="props.layout" :default-page-size="props.defaultPageSize" :total="props.total" @current-change="emit('current-change', $event)" />
  </div>
</template>

<style lang="scss">
.el-pagination {
  --el-pagination-hover-color: #333 !important;
}
.el-pager {
  .is-active {
    border-radius: 4px;
    border: 1px solid #333;
  }
}
.table-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-container {
  width: 100%;
  min-height: 400px;
  overflow: auto;
}

table {
  width: 100%;
  min-width: 960px;
  border-collapse: separate;
  padding-left: 25px;
  border-spacing: 0;
  font-size: 14px;
  border-spacing: 0 1em;
  td {
    padding: 12px;
  }
}

thead {
  font-weight: bold;
  height: 36px;
  vertical-align: top;
}

tbody > tr {
  height: 60px;
  position: relative;

  .table-index {
    position: relative;
    overflow: hidden;
    &::after {
      content: '';
      bottom: 0;
      right: 0;
      position: absolute;
      display: block;
      height: 5px;
      width: 100%;
      background-color: #f5f5f5;
    }
  }

  &::after {
    content: '';
    bottom: 1px;
    right: 10px;
    position: absolute;
    display: block;
    height: 5px;
    width: calc(100% - 50px);
    background-color: #f5f5f5;
  }
  td {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    &:first-child {
      width: 0;
      position: relative;
      border: none;
      .table-index {
        position: absolute;
        right: 0;
        top: 50%;
        width: 30px;
        line-height: 30px;
        transform: translateY(-15px);
        text-align: center;
        border-radius: 50% 0 0 50%;
        border: 1px solid #000;
        border-right: none;
      }
    }
    &:nth-child(2) {
      position: relative;
      border-left: 1px solid #000;
      border-radius: 10px 0 0 10px;
      overflow: hidden;
      &::after {
        content: '';
        left: 0;
        bottom: 0;
        position: absolute;
        display: block;
        height: 5px;
        width: 100px;
        background-color: #f5f5f5;
      }
    }
    &:last-child {
      position: relative;
      border-right: 1px solid #000;
      border-radius: 0 10px 10px 0;
      overflow: hidden;
      &::after {
        content: '';
        bottom: 0;
        right: 0;
        position: absolute;
        display: block;
        height: 5px;
        width: 100px;
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
