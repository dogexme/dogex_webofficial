<script setup lang="ts">
const route = useRoute()
const { address } = route.params as { address: string }
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
function changeTab(val: string) {
  if (loading.value) return
  curTabValue.value = val
}
</script>
<template>
  <DogPageHeader isBack title="Address"></DogPageHeader>
  <DogTabs v-model="curTabValue" :tabs="tabs" @change="changeTab">
    <DogTabsItem value="assets" key="assets">
      <AddressAssetsTable :address="address" v-model:isLoading="loading"></AddressAssetsTable>
    </DogTabsItem>
    <DogTabsItem value="transfer" key="transfer">
      <AddressTransferTable :address="address"></AddressTransferTable>
    </DogTabsItem>
  </DogTabs>
</template>
