<script setup lang="ts">
import { omitCenterString } from '@/utils'
import { queryAssetsByTxid, queryColl, queryHoldersByTxid, queryTransferByTxid } from '@/services/nft'
import { CircleCheck, Search, Loading } from '@element-plus/icons-vue'

type ParamsKey = 'overview' | 'holders' | 'transfers' | 'assets'

const route = useRoute()
const { type } = route.params as { type: ParamsKey }
const curTabValue = ref(type)
const txid = ref('')
const loading = ref(false)
const showContent = ref(false)
const isError = ref(false)

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
    data: ref([]),
    async getData(params: PageResult & { txid: string }) {
      const r = await queryHoldersByTxid(params)
      console.log(r)
    },
    total: ref(0),
  },
  transfers: {
    data: ref([]),
    async getData(params: PageResult & { txid: string }) {
      const r = await queryTransferByTxid(params)
      console.log(r)
    },
    total: ref(0),
  },
  assets: {
    data: ref([]),
    async getData(params: PageResult & { txid: string }) {
      const r = await queryAssetsByTxid(params)
      console.log(r)
    },
    total: ref(0),
  },
}

const collInfo = ref<Partial<CollInfo>>({})

function changeTab(val: ParamsKey) {
  curTabValue.value = val
}

function change(page: number) {
  console.log(curTabValue.value)
  tabsData[curTabValue.value]?.getData({
    page,
    pageSize: 15,
    txid: txid.value.trim(),
  })
}

async function search() {
  const hash = txid.value.trim()
  if (!hash || loading.value) return
  loading.value = true
  try {
    const res = await queryColl(hash)
    if (res?.data.length) {
      collInfo.value = setCollectionLogo(Object.assign(res.data[0], { txid: hash }))
      console.log(collInfo.value)
    }
  } catch {
    isError.value = true
  } finally {
    loading.value = false
    showContent.value = true
  }
}

// onMounted(() => {
//   tabsData[curTabValue.value]?.getData({})
// })
</script>
<template>
  <div id="home">
    <div class="nav-search" :class="[!showContent && 'nav-search--center']">
      <el-icon><Search /></el-icon>
      <input class="nav-search-input" type="text" maxlength="128" placeholder="Address / TxHash / Collection Name / .eth / .bit" v-model="txid" @keydown.enter="search" />
      <el-icon v-if="loading" class="loading-icon"><Loading /></el-icon>
    </div>
    <div class="coll-wrapper" v-if="showContent && !isError">
      <ul class="coll-tab">
        <li class="coll-tab-item" :class="[curTabValue == t.value && 'coll-tab-item--hover']" v-for="t in tabs" :key="t.value" @click="changeTab(t.value as ParamsKey)">
          <router-link :to="`/home/${t.value}`">{{ t.label }}</router-link>
        </li>
      </ul>
      <div class="coll-content" :style="[curTabValue != 'overview' ? { border: 'none', padding: 0 } : {}]">
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
        <div class="coll-info" v-if="curTabValue == 'holders'">
          <DogTable :total="1000" @current-change="change">
            <thead>
              <tr>
                <td></td>
                <td>Holder</td>
                <td>Count</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="table-index">1</span>
                </td>
                <td>{{ omitCenterString('DCrMPftYWb3AD3MArHkwf89AKXJTEkPBnQ') }}</td>
                <td>12321321</td>
              </tr>
            </tbody>
          </DogTable>
        </div>
        <div class="coll-info" v-if="curTabValue == 'transfers'">
          <DogTable :total="1000" @current-change="change">
            <thead>
              <tr>
                <td></td>
                <td>Txid</td>
                <td>Sender</td>
                <td>Receiver</td>
                <td>op</td>
                <td>Buri</td>
                <td>Content</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="_ in 10">
                <td><span class="table-index">1</span></td>
                <td>{{ omitCenterString('72725120f2fa1b5b2986e09f24cdb581a4a364b15d330fccdf88383d7fc099cc') }}</td>
                <td>{{ omitCenterString('DCrMPftYWb3AD3MArHkwf89AKXJTEkPBnQ') }}</td>
                <td>{{ omitCenterString('DCrMPftYWb3AD3MArHkwf89AKXJTEkPBnQ') }}</td>
                <td>mint</td>
                <td>link</td>
                <td>Content</td>
                <td>2023-07-24T16:45:42.000Z</td>
              </tr>
            </tbody>
          </DogTable>
        </div>
        <div class="coll-info" v-if="curTabValue == 'assets'">
          <DogTable :total="1000" @current-change="change">
            <thead>
              <tr>
                <td></td>
                <td>Txid</td>
                <td>Sender</td>
                <td>Receiver</td>
                <td>op</td>
                <td>Buri</td>
                <td>Content</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="_ in 10">
                <td><span class="table-index">1</span></td>
                <td>{{ omitCenterString('72725120f2fa1b5b2986e09f24cdb581a4a364b15d330fccdf88383d7fc099cc') }}</td>
                <td>{{ omitCenterString('DCrMPftYWb3AD3MArHkwf89AKXJTEkPBnQ') }}</td>
                <td>{{ omitCenterString('DCrMPftYWb3AD3MArHkwf89AKXJTEkPBnQ') }}</td>
                <td>mint</td>
                <td>link</td>
                <td>Content</td>
                <td>2023-07-24T16:45:42.000Z</td>
              </tr>
            </tbody>
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
  padding: 20px 6%;
  min-height: 80vh;
}

.nav-search {
  position: absolute;
  top: 0;
  left: 50%;
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
    top: 50%;
    left: 50%;
    transition: top 0.2s;
  }

  .nav-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 14px;
    flex: 1;
    text-indent: 10px;
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
