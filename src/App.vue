<script setup lang="ts">
import { collMap } from '@/services/nft'

const loading = ref(true)

async function loadCollMap() {
  try {
    const res = await collMap()
    localStorage.setItem('nfts', JSON.stringify(res.data))
    loading.value = false
  } catch {
    loadCollMap()
  }
}

onMounted(async () => {
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

.nav-popper,
.nav-drawer {
  z-index: 10000 !important;
}
</style>
