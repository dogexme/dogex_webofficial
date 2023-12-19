<script setup lang="ts">
import { useAppStore } from './store'

const appStore = useAppStore()

onMounted(async () => {
  appStore.getBlocksCountHandler()
  appStore.getMenus()
})
</script>
<template>
  <router-view></router-view>
</template>
<style lang="scss">
@import url('./reset.css');
@import url('./assets/font/iconfont.css');
@font-face {
  font-family: 'SistemnyjC';
  src: url('./assets/font/SistemnyjC.otf') format('opentype');
}

@font-face {
  font-family: 'FiraCode';
  src: url('./assets/font/FiraCode-Regular.ttf') format('truetype');
}

.el-pagination {
  --el-pagination-hover-color: #333 !important;
}
.el-pager {
  .is-active {
    border-radius: 4px;
    border: 1px solid #333;
  }
}
.el-notification__content {
  text-align: left !important;
}
.custom-dialog {
  --el-dialog-bg-color: transparant !important;
  background-color: transparent;
  box-shadow: none;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
    border-radius: 20px;
    overflow: hidden;
  }
  .el-dialog__headerbtn {
    top: 14px;
    right: 8px;
    width: 35px;
    height: 35px;
  }
  .el-dialog__close {
    color: #000;
  }
}

.messageBox-dialog {
  border-radius: 15px;
}

.loading-body {
  height: 100vh;
}

.swap-sub-btn {
  text-align: center;
  line-height: 55px;
  margin-top: 12px;
  border-radius: 20px;
  font-size: 18px;
  cursor: pointer;
  border: 2px solid #fff;
  background-color: #ffa21e;
  color: #fff;
  box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
  &:hover {
    opacity: 0.8;
  }
  &:active {
    background-color: #d28b28;
  }
  &--connect {
    background-color: rgb(238, 181, 15);
    color: #333;
  }
  &--disabled {
    cursor: not-allowed;
    background: #fcbb60;
    &:active {
      background: #fcbb60;
    }
  }
}

.el-alert--info.is-dark {
  background-color: var(--el-color-primary-light-3) !important;
}
</style>
