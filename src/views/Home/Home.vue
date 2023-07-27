<script setup lang="ts">
import { omitCenterString, dateFormat } from '@/utils'
import { queryAssetsByTxid, queryColl, queryHoldersByTxid, queryTransferByTxid } from '@/services/nft'
import { CircleCheck, Search, Loading, CircleCloseFilled, CopyDocument } from '@element-plus/icons-vue'
import { CollInfoType, CollInfo, RequestPageParams } from '@/types'
import clipboard3 from 'vue-clipboard3'

const { toClipboard } = clipboard3()
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
      data.value = res.data.data
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
      data.value = res.data.data
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
</script>
<template>
  <div id="home">
    <h1 class="home-title" v-if="!showContent">dogex.me</h1>
    <div class="nav-search" :class="[!showContent && 'nav-search--center']">
      <el-icon><Search /></el-icon>
      <input class="nav-search-input" type="text" maxlength="128" placeholder="Address / TxHash / Collection Name / .eth / .bit" v-model="txid" @keydown.enter="search" />
      <el-icon v-if="loadingSearch" class="loading-icon"><Loading /></el-icon>
      <el-icon v-if="!loadingSearch && txid.length" style="cursor: pointer" @click="txid = ''"><CircleCloseFilled /></el-icon>
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
                <img :src="collInfo.logo" class="coll-logo-img" alt="" />
                <el-icon color="#1E90FF" class="valid-icon"><CircleCheck /></el-icon>
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
              {{ collInfo.deployer }}<el-icon class="copy-icon" @click="toClipboard(collInfo.deployer)"><CopyDocument /></el-icon>
            </div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Holders</div>
            <div class="coll-info_item_value">{{ collInfo.holders }}</div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Buri</div>
            <div class="coll-info_item_value">{{ collInfo.buri }}</div>
          </div>
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
                  <td style="width: 300px">Holder</td>
                  <td>Count</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="d.nft_owner">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>
                    {{ d.nft_owner }}<el-icon v-if="d.nft_owner" class="copy-icon" @click="toClipboard(d.nft_owner)"><CopyDocument /></el-icon>
                  </td>
                  <td>{{ d.nft_count }}</td>
                </tr>
              </tbody>
            </template>
            <template v-if="curTabValue == 'transfers'">
              <thead>
                <tr>
                  <td></td>
                  <td>Txid</td>
                  <td>Sender</td>
                  <td>Receiver</td>
                  <td>op</td>
                  <td>Date</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="i">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>
                    {{ omitCenterString(d.txid, 18) }}<el-icon v-if="d.txid" class="copy-icon" @click="toClipboard(d.txid)"><CopyDocument /></el-icon>
                  </td>
                  <td>
                    {{ omitCenterString(d.sender, 18) }}<el-icon v-if="d.sender" class="copy-icon" @click="toClipboard(d.sender)"><CopyDocument /></el-icon>
                  </td>
                  <td>
                    {{ omitCenterString(d.receiver, 18) }}<el-icon v-if="d.receiver" class="copy-icon" @click="toClipboard(d.receiver)"><CopyDocument /></el-icon>
                  </td>
                  <td>{{ d.op }}</td>
                  <td>{{ d.date && dateFormat(new Date(d.date)) }}</td>
                </tr>
              </tbody>
            </template>
            <template v-if="curTabValue == 'assets'">
              <thead>
                <tr>
                  <td></td>
                  <td>Nft</td>
                  <td>Address</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="i">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td><img style="width: 60px; height: 60px; border-radius: 5px; display: block" v-if="d.baseuri" :src="`${d.baseuri}/${d.txid}/${d.tokenid}.png`" alt="" /></td>
                  <td>
                    {{ d.address }}<el-icon v-if="d.address" class="copy-icon" @click="toClipboard(d.address)"><CopyDocument /></el-icon>
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

#home {
  position: relative;
  box-sizing: border-box;
  padding: 20px 4%;
  min-height: 80vh;
}

.home-title {
  width: 200px;
  text-align: center;
  margin: 0 auto;
  margin-top: 150px;
  font-size: 42px;
}

.nav-search {
  position: fixed;
  top: 50px;
  left: 50%;
  z-index: 99;
  display: flex;
  align-items: center;
  max-width: 500px;
  width: 80%;
  background: #fff;
  padding: 12px 12px;
  border-radius: 40px;
  border: 1px solid #000;
  order: 1;
  margin: 0 auto;
  margin-top: 20px;
  transform: translateX(-50%) translateZ(0);
  transition: top 0.2s;

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
  }
}

.coll-wrapper {
  margin-top: 90px;
}

.coll-tab {
  .coll-tab-item--hover {
    background-color: rgb(220, 200, 244);
  }
  .coll-tab-item {
    display: inline-block;
    padding: 4px 12px;
    border: 1px solid #000;
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
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .valid-icon {
    position: absolute;
    right: -7px;
    bottom: -5px;
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

.copy-icon {
  margin-left: 12px;
  cursor: pointer;
}
</style>
