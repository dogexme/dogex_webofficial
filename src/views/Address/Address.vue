<script setup lang="ts">
import AssetsTable from './components/AssetsTable'
const curTabValue = ref('assets')
const loading = ref(false)
const tabs = [
  {
    label: 'Assets',
    value: 'assets',
  },
  {
    label: 'Transfer',
    value: 'transfer',
  },
]
function changeTab() {}
</script>
<template>
  <DogTabs v-model="curTabValue" :tabs="tabs" @change="changeTab">
    <DogTabsItem value="assets">
      <AssetsTable address="DRGssUYww69oKMJHeXBJZjB46cCkEhwxia" v-model:isLoading="loading"></AssetsTable>
    </DogTabsItem>
  </DogTabs>
</template>
