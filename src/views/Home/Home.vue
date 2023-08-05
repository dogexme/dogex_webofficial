<script setup lang="ts">
import { queryColl, getBlocksCount } from '@/services/nft'
import { Loading, CircleCloseFilled } from '@element-plus/icons-vue'
import { CollInfoType, CollInfo, RequestPageParams } from '@/types'
import AssetsTable from './components/AssetsTable'

defineOptions({
  name: 'home',
})

const curTabValue = ref<CollInfoType>('overview')
const txid = ref('')
const txidCopy = ref('')
const loadingSearch = ref(false)
const showContent = ref(false)
const isNotFount = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collInfo = ref<CollInfo>()
const blockCount = ref(0)
const table = ref()

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
  {
    label: 'Assets',
    value: 'assets',
  },
]

async function getOverview(params: RequestPageParams) {
  loadingSearch.value = true
  try {
    const res = await queryColl({ txid: params.txid! })
    if (res?.data.length) {
      collInfo.value = setCollectionLogo(Object.assign(res.data[0], { txid: params.txid }))
      console.log(collInfo.value)
      txidCopy.value = params.txid!
      isNotFount.value = false
    } else {
      isNotFount.value = true
    }
  } catch (e) {
    isNotFount.value = true
    throw e
  } finally {
    loadingSearch.value = false
  }
}

function handleNotFount() {
  isNotFount.value = true
}

async function changeTab(tabVal: CollInfoType) {
  if (!txidCopy.value || loadingSearch.value) return

  curTabValue.value = tabVal

  if (curTabValue.value == 'overview' || curTabValue.value == 'holders') {
    await getOverview({ txid: txidCopy.value })
  }

  nextTick(() => {
    if (table.value?.reload) {
      table.value?.reload()
    }
  })
}

async function search() {
  const hash = txid.value.trim()
  if (!hash || loadingSearch.value) return
  loadingSearch.value = true
  try {
    console.log(curTabValue.value)

    if (curTabValue.value == 'overview' || curTabValue.value == 'holders') {
      await getOverview({ txid: hash })
    }

    txidCopy.value = hash

    await nextTick(async () => {
      if (table.value?.reload) {
        await table.value?.reload()
      }
    })
  } finally {
    loadingSearch.value = false
    showContent.value = true
  }
}

function getBlocksCountHandler() {
  getBlocksCount().then((r) => {
    blockCount.value = r.data?.data?.[0]?.block || 0
    setTimeout(
      () => {
        getBlocksCountHandler()
      },
      1000 * 60 * 5
    )
  })
}

onMounted(() => {
  getBlocksCountHandler()
})
</script>
<template>
  <div id="home">
    <div class="nav-search" :class="[!showContent && 'nav-search--center']">
      <h1 class="home-title" v-if="!showContent">dogex.me</h1>
      <div class="nav-search_inputwrap">
        <i class="dog-icon dog-icon_search"></i>
        <input class="nav-search-input" type="text" maxlength="128" placeholder="Deploy Hash" v-model="txid" @keydown.enter="search" />
        <el-icon v-if="loadingSearch" class="loading-icon"><Loading /></el-icon>
        <el-icon v-if="!loadingSearch && txid.length" style="cursor: pointer" @click="txid = ''"><CircleCloseFilled /></el-icon>
      </div>
      <div class="blocks-number">
        <i class="dog-icon dog-icon_block"></i>
        Processed Blocks: <span v-if="blockCount">{{ blockCount }}</span>
      </div>
    </div>
    <div class="coll-wrapper" v-if="showContent">
      <DogTabs v-if="!isNotFount" v-model="curTabValue" :tabs="tabs" @change="changeTab">
        <DogTabsItem value="overview">
          <Overview v-loading="loadingSearch" :collInfo="collInfo"></Overview>
        </DogTabsItem>
        <DogTabsItem value="holders">
          <HolderTable ref="table" v-model:isLoading="loadingSearch" :collInfo="collInfo!" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></HolderTable>
        </DogTabsItem>
        <DogTabsItem value="transfers">
          <TransfersTable ref="table" v-model:isLoading="loadingSearch" :collInfo="collInfo!" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></TransfersTable>
        </DogTabsItem>
        <DogTabsItem value="assets">
          <AssetsTable ref="table" v-model:isLoading="loadingSearch" :collInfo="collInfo!" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></AssetsTable>
        </DogTabsItem>
      </DogTabs>
      <el-empty v-else></el-empty>
      <!-- <h2 style="margin-top: 30px; margin-bottom: 16px"></h2>
      <DogCard>
        <div class="content-json">
          <div class="content-num"></div>
          <div class="content-field"></div>
        </div>
      </DogCard> -->
    </div>
  </div>
</template>

<style lang="scss">
.el-empty {
  --el-empty-padding: 70px 0 !important;
}

#home {
  position: relative;
  box-sizing: border-box;
  min-height: 72.5vh;
}

.home-title {
  position: absolute;
  top: -100px;
  left: 50%;
  width: 250px;
  transform: translateX(-50%);
  font-family: SistemnyjC;
  text-align: center;
  margin: 0 auto;
  font-size: 42px;
}

.nav-search {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  box-sizing: border-box;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  transform: translateX(-50%) translateZ(0);
  transition: top 0.2s;
  background: url(/src/assets/img/bg.png) no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 20px;

  &--center {
    margin-top: 0;
    top: 50%;
    left: 50%;
    transition: top 0.2s;
    transform: translate(-50%, -50%) translateZ(0);
  }

  .nav-search-input {
    flex: 1;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    margin-right: 10px;
    margin-left: 10px;
    font-family: SistemnyjC;
  }

  .nav-search_inputwrap {
    position: relative;
    display: flex;
    align-items: center;
    align-self: center;
    width: 95%;
    max-width: 740px;
    height: 12vmin;
    max-height: 66px;
    background: #fff;
    padding: 0 24px;
    border-radius: 40px;
    box-sizing: border-box;
    border: 1px solid #333;
    outline: 3px solid #ddc2f9;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}

.blocks-number {
  display: inline-block;
  line-height: 35px;
  margin-top: 16px;
  align-self: center;
  border-radius: 6px;
  padding: 0 10px;
  background-color: #ddc2f9;
  font-weight: bold;
  span {
    color: rgb(53, 128, 127);
  }
}

.coll-wrapper {
  padding-top: 230px;
}

.loading-icon {
  animation: loading 1s infinite linear;
  @keyframes loading {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>
