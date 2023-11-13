<script setup lang="ts">
import { collMap } from '@/services/nft'

const loading = ref(true)
let timer = 0

async function loadCollMap() {
  try {
    const res = await collMap()
    localStorage.setItem('nfts', JSON.stringify(res.data))
    loading.value = false
    document.body.removeChild(document.getElementById('loading-container')!)
    document.body.classList.remove('loading-body')
    clearTimeout(timer)
  } catch {
    timer = window.setTimeout(loadCollMap, 1000)
  }
}

onMounted(async () => {
  document.body.classList.add('loading-body')
  loadCollMap()
})
</script>
<template>
  <router-view v-if="!loading"></router-view>
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
</style>
