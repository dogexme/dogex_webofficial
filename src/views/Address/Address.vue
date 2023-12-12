<script setup lang="ts">
import router from '@/router'

type AssetsType = 'nft' | 'token'
const route = useRoute()
const { address } = route.params as { address: string }
const { type = 'token' } = route.query as { type: AssetsType }
const curTabValue = ref<AssetsType>(type)
const tabsRef = reactive<Partial<{ [k in AssetsType]: { load: () => void } }>>({})
const loading = ref(false)

const tabs = [
  {
    label: 'DRC',
    value: 'token',
  },
  {
    label: 'Nfts',
    value: 'nft',
  },
]

function changeTab(val: AssetsType) {
  if (loading.value) return
  curTabValue.value = val
  tabsRef[curTabValue.value]?.load()
  router.replace({ name: 'address', query: { type: val } })
}

onMounted(() => {
  tabsRef[curTabValue.value]?.load()
})
</script>
<template>
  <DogPageHeader isBack :title="address"></DogPageHeader>
  <DogTabs v-model="curTabValue" :tabs="tabs" @change="changeTab" keepDom>
    <DogTabsItem value="nft" key="nft">
      <AddressNfts :ref="(r: any) => (tabsRef.nft = r)" :address="address"></AddressNfts>
    </DogTabsItem>
    <DogTabsItem value="token" key="token">
      <AddressTokens :ref="(r: any) => (tabsRef.token = r)" :address="address"></AddressTokens>
    </DogTabsItem>
  </DogTabs>
</template>
