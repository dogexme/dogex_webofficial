<script setup lang="ts">
import { CollInfoType } from '@/types'

const tables = reactive<any>({})
const isNotFount = ref(false)
const curTabValue = ref<CollInfoType>('overview')

const tabs = [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: 'Holders',
    value: 'holders',
  },
  {
    label: 'Transfers',
    value: 'transfers',
  },
]

async function changeTab(tabVal: CollInfoType) {
  // if (!txidCopy.value || loadingSearch.value) return
  curTabValue.value = tabVal
  reload()
}

function reload(isForce = false) {
  nextTick(() => {
    if (tables[curTabValue.value]?.reload) {
      if (isForce) {
        tables[curTabValue.value].setLoad(false)
      }
      tables[curTabValue.value].reload()
    }
  })
}
</script>
<template>
  <div class="coll-wrapper">
    <DogTabs v-if="!isNotFount" keep-dom v-model="curTabValue" :tabs="tabs" @change="changeTab">
      <DogTabsItem value="overview">
        <DrcOverview :ref="(ref) => (tables['holders'] = ref)"></DrcOverview>
      </DogTabsItem>
      <DogTabsItem value="holders">
        <DrcHolder :ref="(ref) => (tables['holders'] = ref)"></DrcHolder>
      </DogTabsItem>
      <DogTabsItem value="transfers">
        <DrcTransfers :ref="(ref) => (tables['transfers'] = ref)"></DrcTransfers>
      </DogTabsItem>
    </DogTabs>
    <el-empty v-else></el-empty>
  </div>
</template>
