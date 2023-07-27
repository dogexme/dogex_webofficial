<script setup lang="ts">
import { omitCenterString } from '@/utils'
import { queryAssetsByTxid, queryColl, queryHoldersByTxid, queryTransferByTxid } from '@/services/nft'
import { CircleCheck, Search, Loading, CircleCloseFilled } from '@element-plus/icons-vue'

const curTabValue = ref<ParamsKey>('overview')
const txid = ref('')
const txidCope = ref('')
const loadingSearch = ref(false)
const showContent = ref(false)
const isError = ref(false)
const total = ref(0)
const data = ref<any[]>([])
const loadingPage = ref(false)

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
    async handler(params: Partial<PageResult & { txid: string }>) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryHoldersByTxid(params)
      total.value = res.data.total
      data.value = res.data.data
    },
  },
  transfers: {
    async handler(params: Partial<PageResult & { txid: string }>) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryTransferByTxid(params)
      total.value = res.data.total
      data.value = res.data.data
    },
  },
  assets: {
    async handler(params: Partial<PageResult & { txid: string }>) {
      if (!params.page || !params.pageSize) {
        Object.assign(params, { page: 1, pageSize: 15 })
      }
      const res = await queryAssetsByTxid(params)
      total.value = res.data.total
      data.value = setCollectionLogo(res.data.data.map((d) => Object.assign(d, { txid: params.txid })))
      console.log(data.value)
    },
  },
  overview: {
    async handler(params: Partial<PageResult & { txid: string }>) {
      const res = await queryColl(params)
      if (res?.data.length) {
        collInfo.value = setCollectionLogo(Object.assign(res.data[0], { txid: params.txid }))
        console.log(collInfo.value)
        txidCope.value = params.txid!
      }
    },
  },
}

const collInfo = ref<Partial<CollInfo>>({})

async function getData(type: ParamsKey, params: Partial<PageResult & { txid: string }>) {
  curTabValue.value = type
  const { handler } = tabsData[type]
  try {
    await handler(params)
    loadingPage.value = true
  } finally {
    loadingPage.value = false
  }
}

function nextPage(page: number) {
  getData(curTabValue.value, {
    page,
    pageSize: 15,
    txid: txidCope.value,
  })
}

function changeTab(tabVal: ParamsKey) {
  curTabValue.value = tabVal
  if (!txidCope.value) return
  getData(curTabValue.value, { txid: txidCope.value })
}

async function search() {
  const hash = txid.value.trim()
  if (!hash || loadingSearch.value) return
  loadingSearch.value = true
  try {
    await getData(curTabValue.value, { txid: hash })
    isError.value = false
  } catch {
    isError.value = true
    txid.value = ''
  } finally {
    loadingSearch.value = false
    showContent.value = true
  }
}
</script>
<template>
  <div id="home">
    <div class="nav-search" :class="[!showContent && 'nav-search--center']">
      <el-icon><Search /></el-icon>
      <input class="nav-search-input" type="text" maxlength="128" placeholder="Address / TxHash / Collection Name / .eth / .bit" v-model="txid" @keydown.enter="search" />
      <el-icon v-if="loadingSearch" class="loading-icon"><Loading /></el-icon>
      <el-icon v-if="!loadingSearch && txid.length" style="cursor: pointer" @click="txid = ''"><CircleCloseFilled /></el-icon>
    </div>
    <div class="coll-wrapper" v-if="showContent">
      <ul class="coll-tab">
        <li class="coll-tab-item" :class="[curTabValue == t.value && 'coll-tab-item--hover']" v-for="t in tabs" :key="t.value" @click="changeTab(t.value as ParamsKey)">
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
            <div class="coll-info_item_value">{{ collInfo.deployer }}</div>
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
            <div class="coll-info_item_value">{{ collInfo.date }}</div>
          </div>
        </div>
        <div class="coll-info" v-else>
          <DogTable :total="total" @current-change="nextPage">
            <template v-if="curTabValue == 'holders'">
              <thead>
                <tr>
                  <td></td>
                  <td>Holder</td>
                  <td>Count</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="d.nft_owner">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>{{ omitCenterString(d.nft_owner) }}</td>
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
                  <td>Buri</td>
                  <td>Date</td>
                </tr>
              </thead>
              <tbody v-if="data.length">
                <tr v-for="(d, i) in data" :key="i">
                  <td>
                    <span class="table-index">{{ i + 1 }}</span>
                  </td>
                  <td>{{ omitCenterString(d.txid) }}</td>
                  <td>{{ omitCenterString(d.sender) }}</td>
                  <td>{{ omitCenterString(d.receiver) }}</td>
                  <td>{{ d.op }}</td>
                  <td>{{ d.buri }}</td>
                  <td>{{ d.date }}</td>
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
                  <td>{{ omitCenterString(d.address) }}</td>
                </tr>
              </tbody>
            </template>
          </DogTable>
        </div>
      </div>
    </div>
    <el-empty v-if="isError"></el-empty>
  </div>
</template>

<style lang="scss">
#home {
  position: relative;
  box-sizing: border-box;
  padding: 20px 6%;
  min-height: 80vh;
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
    cursor: pointer;
    &:hover {
      @extend .coll-tab-item--hover;
    }
  }

  @media screen and (max-width: 480px) {
    & {
      display: flex;
    }
    .coll-tab-item {
      flex: 1;
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
</style>
