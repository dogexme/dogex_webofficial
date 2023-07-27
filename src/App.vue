<script setup lang="ts">
import { collMap } from '@/services/nft'

const loading = ref(false)

onMounted(async () => {
  const res = await collMap()
  localStorage.setItem('nfts', JSON.stringify(res.data))
  loading.value = true
})
</script>
<template>
  <router-view v-if="loading"></router-view>
</template>
<style lang="scss">
@import url('./reset.css');

@font-face {
  font-family: 'nft';
  src:
    url('./assets/font/iconfont.woff2?t=1690466046653') format('woff2'),
    url('./assets/font/iconfont.woff?t=1690466046653') format('woff'),
    url('./assets/font/iconfont.ttf?t=1690466046653') format('truetype');
}

.nftfont {
  font-family: 'nft' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
