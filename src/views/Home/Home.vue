<script setup lang="ts">
import { dateFormat } from '@/utils'
import { queryColl, getBlocksCount } from '@/services/nft'
import { Search, Loading, CircleCloseFilled } from '@element-plus/icons-vue'
import { CollInfoType, CollInfo, RequestPageParams } from '@/types'

const curTabValue = ref<CollInfoType>('overview')
const txid = ref('1ba28f9aeebb6831fb4f2ecc8484acdcce96c10d12ee203ac1b5fbe769c6dfff')
const txidCopy = ref('')
const loadingSearch = ref(false)
const showContent = ref(false)
const isNotFount = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collInfo = ref<Partial<CollInfo>>({})
const page = ref(1)
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
  } catch {
    isNotFount.value = true
  } finally {
    loadingSearch.value = false
  }
}

function handleNotFount() {
  isNotFount.value = true
}

function changeTab() {
  if (!txidCopy.value) return
  page.value = 1
  if (curTabValue.value == 'overview') {
    getOverview({ txid: txidCopy.value })
  }
}

async function search() {
  const hash = txid.value.trim()
  if (!hash || loadingSearch.value) return
  page.value = 1
  loadingSearch.value = true
  try {
    if (curTabValue.value == 'holders' || curTabValue.value == 'overview') {
      await getOverview({ txid: hash })
    }
    if (table.value?.reload) {
      table.value?.reload()
    }
    txidCopy.value = hash
  } catch {
    txidCopy.value = txid.value = ''
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
        <el-icon><Search /></el-icon>
        <input class="nav-search-input" type="text" maxlength="128" placeholder="Deploy Hash" v-model="txid" @keydown.enter="search" />
        <el-icon v-if="loadingSearch" class="loading-icon"><Loading /></el-icon>
        <el-icon v-if="!loadingSearch && txid.length" style="cursor: pointer" @click="txid = ''"><CircleCloseFilled /></el-icon>
      </div>
      <div class="blocks-number">
        Processed Blocks: <span>{{ blockCount }}</span>
      </div>
    </div>
    <div class="coll-wrapper" v-if="showContent">
      <DogTabs v-if="!isNotFount" v-model="curTabValue" :tabs="tabs" @change="changeTab">
        <DogTabsItem value="overview">
          <div class="coll-info" v-loading="loadingSearch">
            <div class="coll-info_item">
              <div class="coll-info_item_label">Logo</div>
              <div class="coll-info_item_value">
                <div class="coll-logo-wrap" v-if="collInfo.logo">
                  <el-image class="coll-logo-img" :src="collInfo.logo" fit="cover" />
                  <DogValidSvgIcon class="valid-icon" style="fill: rgb(29, 155, 240); width: 16px; height: 16px"></DogValidSvgIcon>
                </div>
              </div>
            </div>
            <div class="coll-info_item">
              <div class="coll-info_item_label">Tick</div>
              <div class="coll-info_item_value">{{ collInfo.tick }}</div>
            </div>
            <div class="coll-info_item">
              <div class="coll-info_item_label">Max</div>
              <div class="coll-info_item_value">{{ collInfo.max }}</div>
            </div>
            <div class="coll-info_item">
              <div class="coll-info_item_label">Mintval</div>
              <div class="coll-info_item_value">{{ collInfo.mintval }}</div>
            </div>
            <div class="coll-info_item">
              <div class="coll-info_item_label">Deployer</div>
              <div class="coll-info_item_value">
                <DogLink is-copy :label="collInfo.deployer" :value="collInfo.deployer"></DogLink>
              </div>
            </div>
            <div class="coll-info_item">
              <div class="coll-info_item_label">Holders</div>
              <div class="coll-info_item_value">{{ collInfo.holders }}</div>
            </div>
            <!-- <div class="coll-info_item">
            <div class="coll-info_item_label">Buri</div>
            <div class="coll-info_item_value">{{ collInfo.buri }}</div>
          </div> -->
            <div class="coll-info_item">
              <div class="coll-info_item_label">Date</div>
              <div class="coll-info_item_value">{{ collInfo.date && dateFormat(new Date(collInfo.date)) }}</div>
            </div>
          </div>
        </DogTabsItem>
        <DogTabsItem value="holders">
          <HolderTable ref="table" :collInfo="collInfo" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></HolderTable>
        </DogTabsItem>
        <DogTabsItem value="transfers">
          <TransfersTable ref="table" :collInfo="collInfo" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></TransfersTable>
        </DogTabsItem>
        <DogTabsItem value="assets">
          <AssetsTable ref="table" :collInfo="collInfo" :txid="txidCopy" :tabVal="curTabValue" :error="handleNotFount"></AssetsTable>
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
  padding: 20px;
  min-height: 80vh;
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
  width: calc(100% - 40px);
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 20px;
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
    border: none;
    outline: none;
    font-size: 14px;
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
    max-width: 500px;
    box-sizing: border-box;
    background: #fff;
    padding: 12px 12px;
    border-radius: 40px;
    border: 1px solid #333;
    outline: 3px solid rgb(221, 194, 249);
    overflow: hidden;
    &::after {
      content: '';
      bottom: 0;
      right: 0;
      position: absolute;
      display: block;
      height: 5px;
      width: 100%;
      background-color: #f5f5f5;
    }
  }
}

.blocks-number {
  display: inline-block;
  margin-top: 24px;
  align-self: center;
  border-radius: 6px;
  padding: 8px 10px;
  background-color: rgb(221, 194, 249);
  font-weight: bold;
  span {
    color: rgb(53, 128, 127);
  }
}

.coll-wrapper {
  margin-top: 230px;
}

.coll-tab {
  margin-bottom: 20px;
  .coll-tab-item {
    display: inline-block;
    padding: 4px 10px 5px 8px;
    border-radius: 8px;
    box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #000;
    background-color: #fafafa;
    font-size: 14px;
    margin-right: 12px;
    cursor: pointer;
    &:hover {
      @extend .coll-tab-item--hover;
    }
  }
  .coll-tab-item--hover {
    background-color: #ddc2f9;
  }
}

.coll-info {
  &_item {
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
  }
  &_item_label {
    display: flex;
    align-items: center;
    flex: 1;
    &--link {
      cursor: pointer;
      // color: rgb(220, 200, 244);
    }
  }
  &_item_value {
    flex: 1;
    word-break: break-all;
  }
}

.coll-logo-wrap {
  position: relative;
  display: inline-flex;
  .coll-logo-img {
    --size: 48px;
    width: var(--size);
    height: var(--size);
    border-radius: 5px;
  }
  .valid-icon {
    position: absolute;
    right: -8px;
    bottom: -7px;
  }
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
