<script setup lang="ts">
type MenuTabs = 'tokens'

const tables = reactive<any>({})
const isNotFount = ref(false)
const curTabValue = ref<MenuTabs>('tokens')
const route = useRoute()
const loading = ref(false)

const tabs = [
  {
    label: 'Tokens',
    value: 'tokens',
  },
  // {
  //   label: 'Transfers',
  //   value: 'transfers',
  // },
]

const address = computed(() => route.params.address as string)

async function changeTab(tabVal: MenuTabs) {
  if (loading.value) return
  curTabValue.value = tabVal
  nextTick(reload)
}

function reload() {
  tables[curTabValue.value]?.reload?.()
}

onMounted(() => {
  reload()
})
</script>
<template>
  <div class="coll-wrapper" v-loading="loading">
    <DogPageHeader isBack :title="address"></DogPageHeader>
    <DogTabs v-if="!isNotFount" keep-dom v-model="curTabValue" :tabs="tabs" @change="changeTab">
      <DogTabsItem value="tokens">
        <DrcAddressTrans :ref="(ref) => (tables['tokens'] = ref)" :address="address"></DrcAddressTrans>
      </DogTabsItem>
    </DogTabs>
    <el-empty v-else></el-empty>
  </div>
</template>
