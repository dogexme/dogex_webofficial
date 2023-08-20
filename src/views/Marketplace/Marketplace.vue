<script setup lang="ts">
const curTabValue = ref('tokens')
const router = useRouter()
const tabs = [
  {
    label: 'Tokens',
    value: 'tokens',
  },
  {
    label: 'Domains',
    value: 'domains',
  },
  {
    label: 'Colletions',
    value: 'colletions',
  },
]

function changeTab(val: string) {
  curTabValue.value = val
  router.push({
    name: 'marketplace',
    query: {
      category: val
    }
  })
}
</script>

<template>
  <DogTabs v-model="curTabValue" :tabs="tabs" @change="changeTab" keep-dom>
    <DogTabsItem value="tokens">
      <router-view></router-view>
    </DogTabsItem>
    <DogTabsItem value="domains">
      <router-view></router-view>
    </DogTabsItem>
    <DogTabsItem value="colletions">
      <router-view></router-view>
    </DogTabsItem>
  </DogTabs>
</template>
./MarketTokenTable
