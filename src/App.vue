<script setup lang="ts">
import { collMap } from '@/services/nft'

const loading = ref(true)

onMounted(async () => {
  const res = await collMap()
  localStorage.setItem('nfts', JSON.stringify(res.data))
  loading.value = false
})
</script>
<template>
  <router-view v-if="!loading"></router-view>
</template>
<style lang="scss">
@import url('./reset.css');
@import url('./assets/font/iconfont.css');
</style>
