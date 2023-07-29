<script setup lang="ts">
import { omitCenterString, dateFormat } from '@/utils'
import { queryAssetsByTxid, queryColl, queryHoldersByTxid, queryTransferByTxid, getBlocksCount } from '@/services/nft'
import { Search, Loading, CircleCloseFilled } from '@element-plus/icons-vue'
import { CollInfoType, CollInfo, RequestPageParams } from '@/types'

const curTabValue = ref<CollInfoType>('overview')
const txid = ref('')
const txidCopy = ref('')
const loadingSearch = ref(false)
const showContent = ref(false)
const isError = ref(false)
const total = ref(0)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = ref<any[]>([])
const loadingPage = ref(false)
const collInfo = ref<Partial<CollInfo>>({})
const page = ref(1)
const tableRef = ref<HTMLElement>()
const blockCount = ref(0)

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

const tabsData = {
  holders: {
    async handler(params: RequestPageParams) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryHoldersByTxid(params)
      total.value = res.data.total
      const totalCount = res.data.data.reduce((p: number, n: { nft_count: number }) => p + n.nft_count, 0)
      data.value = res.data.data.map((d: { nft_count: number }) => ({ ...d, ratio: d.nft_count / totalCount }))
      console.log(data.value)
      isError.value = !res.data.total
    },
  },
  transfers: {
    async handler(params: RequestPageParams) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryTransferByTxid(params)
      total.value = res.data.total
      data.value = res.data.data.map((item: { content: string }) => Object.assign(item, JSON.parse(item.content)))
      console.log(data.value)
      isError.value = !res.data.total
    },
  },
  assets: {
    async handler(params: RequestPageParams) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryAssetsByTxid(params)
      total.value = res.data.total
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.value = setCollectionLogo(res.data.data.map((d: any) => Object.assign(d, { txid: params.txid })))
      isError.value = !res.data.total
      console.log(data.value)
    },
  },
  overview: {
    async handler(params: RequestPageParams) {
      const res = await queryColl({ txid: params.txid! })
      if (res?.data.length) {
        collInfo.value = setCollectionLogo(Object.assign(res.data[0], { txid: params.txid }))
        console.log(collInfo.value)
        txidCopy.value = params.txid!
        isError.value = false
      } else {
        isError.value = true
      }
    },
  },
}

async function getData(type: CollInfoType, params: RequestPageParams) {
  curTabValue.value = type
  const { handler } = tabsData[type]
  try {
    loadingPage.value = true
    await handler(params)
  } catch (e) {
    isError.value = true
    throw e
  } finally {
    window.scrollTo(0, 0)
    tableRef.value?.scrollTo(0, 0)
    loadingPage.value = false
  }
}

function nextPage(pageNumber: number) {
  page.value = pageNumber
  getData(curTabValue.value, {
    page: pageNumber,
    pageSize: 15,
    txid: txidCopy.value,
  })
}

function changeTab(tabVal: CollInfoType) {
  if (curTabValue.value == tabVal) return
  curTabValue.value = tabVal
  if (!txidCopy.value) return
  page.value = 1
  getData(curTabValue.value, { txid: txidCopy.value })
}

async function search() {
  const hash = txid.value.trim()
  if (!hash || loadingSearch.value) return
  loadingSearch.value = true
  try {
    await getData(curTabValue.value, { txid: hash })
    txidCopy.value = hash
  } catch {
    txidCopy.value = txid.value = ''
  } finally {
    loadingSearch.value = false
    showContent.value = true
  }
}

onMounted(() => {
  getBlocksCount().then((r) => {
    blockCount.value = r.data?.data?.[0]?.block || 0
  })
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
    <div class="coll-wrapper" v-loading="loadingPage" v-if="showContent">
      <ul class="coll-tab">
        <li class="coll-tab-item" :class="[curTabValue == t.value && 'coll-tab-item--hover']" v-for="t in tabs" :key="t.value" @click="changeTab(t.value as CollInfoType)">
          {{ t.label }}
        </li>
      </ul>
      <div class="coll-content" :style="[curTabValue != 'overview' ? { border: 'none', padding: 0 } : {}]" v-if="!isError">
        <div class="coll-info" v-if="curTabValue == 'overview'">
          <div class="coll-info_item">
            <div class="coll-info_item_label">Logo</div>
            <div class="coll-info_item_value">
              <div class="coll-logo-wrap" v-if="collInfo.logo">
                <el-image class="coll-logo-img" :src="collInfo.logo" fit="cover" />
                <DogValidSvgIcon class="valid-icon" style="fill: rgb(29, 155, 240); width: 24px; height: 24px"></DogValidSvgIcon>
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
        <div class="coll-info" v-else>
          <DogTable ref="tableRef" :current-page="page" :total="total" @current-change="nextPage">
            <template v-if="curTabValue == 'holders'">
              <thead>
                <tr>
                  <td></td>
                  <td style="width: 350px">Holder</td>
                  <td>Count</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="d.nft_owner">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>
                    <DogLink is-copy :label="d.nft_owner" :value="d.nft_owner"></DogLink>
                  </td>
                  <td>
                    <div v-if="d.nft_count">
                      {{ d.nft_count }}
                      <span style="color: #606266">{{ `(${+(d.ratio * 100).toFixed(2)}%)` }}</span>
                      <el-progress style="width: 120px; margin-top: 5px" :stroke-width="5" :percentage="+(d.ratio * 100)" :show-text="false" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-if="curTabValue == 'transfers'">
              <thead>
                <tr>
                  <td></td>
                  <td>Txid</td>
                  <td>Protocol</td>
                  <td>Op</td>
                  <td>Sender</td>
                  <td>Receiver</td>
                  <td>Date</td>
                  <td>Content</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="i">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>
                    <DogLink is-copy :to="`https://chain.so/tx/DOGE/${d.txid}`" :label="omitCenterString(d.txid, 24)" :value="d.txid"></DogLink>
                  </td>
                  <td>
                    <el-tag v-if="d.p" type="info" effect="plain">
                      {{ d.p }}
                    </el-tag>
                  </td>
                  <td>{{ d.op }}</td>
                  <td>
                    <DogLink is-copy :label="omitCenterString(d.sender)" :value="d.sender"></DogLink>
                  </td>
                  <td>
                    <DogLink is-copy :label="omitCenterString(d.receiver)" :value="d.receiver"></DogLink>
                  </td>
                  <td>{{ d.date && dateFormat(new Date(d.date)) }}</td>
                  <td>{{ d.content }}</td>
                </tr>
              </tbody>
            </template>
            <template v-if="curTabValue == 'assets'">
              <thead>
                <tr>
                  <td></td>
                  <td>Nft</td>
                  <td>Tokenid</td>
                  <td>Address</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="i">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>
                    <el-image style="width: 60px; height: 60px; border-radius: 5px" :src="`${d.baseuri}/${d.txid}/${d.tokenid}.png`" fit="cover" />
                  </td>
                  <td>
                    {{ d.tokenid && `#${d.tokenid}` }}
                  </td>
                  <td>
                    <DogLink is-copy :label="d.address" :value="d.address"></DogLink>
                  </td>
                </tr>
              </tbody>
            </template>
          </DogTable>
        </div>
      </div>
      <el-empty v-else></el-empty>
    </div>
  </div>
</template>

<style lang="scss">
.el-empty {
  --el-empty-padding: 70px 0 !important;
}

.el-tag {
  --el-tag-border-color: #333 !important;
  --el-color-info: #333;
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
  width: 200px;
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
  width: 90%;
  padding: 50px 10px;
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
    width: 100%;
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
  .coll-tab-item--hover {
    background-color: rgb(220, 200, 244);
  }
  .coll-tab-item {
    display: inline-block;
    padding: 4px 12px;
    border: 1px solid #333;
    border-radius: 10px;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    &:hover {
      @extend .coll-tab-item--hover;
    }
  }
}

.coll-content {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 6px;
}

.coll-info {
  &_item {
    display: flex;
    line-height: 2;
    font-size: 14px;
  }
  &_item_label {
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
    --size: 75px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
  }
  .valid-icon {
    position: absolute;
    right: -12px;
    bottom: -6px;
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
