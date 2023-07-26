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
</style>
