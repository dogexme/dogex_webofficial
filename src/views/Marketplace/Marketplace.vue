<script setup>
import MarketTokenTable from './components/MarketTokenTable'

const curTabValue = ref('tokens')
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

function changeTab(val) {
  curTabValue.value = val
}
</script>

<template>
  <DogTabs v-model="curTabValue" :tabs="tabs" @change="changeTab">
    <DogTabsItem value="tokens">
      <MarketTokenTable />
    </DogTabsItem>
    <DogTabsItem value="domains"> 2 </DogTabsItem>
    <DogTabsItem value="colletions"> 3 </DogTabsItem>
  </DogTabs>
</template>
