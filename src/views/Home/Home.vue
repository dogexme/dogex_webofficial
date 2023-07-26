<script setup lang="ts">
import { omitCenterString } from '@/utils'
const route = useRoute()
const { type } = route.params
const curTabValue = ref(type)
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

function changeTab(val: string) {
  curTabValue.value = val
  console.log(val)
}

function change(page: number) {
  console.log(page)
}
</script>
<template>
  <div id="home">
    <div class="nav-search">
      <input type="text" placeholder="Address / TxHash / Collection Name / .eth / .bit" class="nav-search-input" />
    </div>
    <div class="coll-wrapper">
      <ul class="coll-tab">
        <li class="coll-tab-item" :class="[curTabValue == t.value && 'coll-tab-item--hover']" v-for="t in tabs" :key="t.value" @click="changeTab(t.value)">
          <router-link :to="`/home/${t.value}`">{{ t.label }}</router-link>
        </li>
      </ul>
      <div class="coll-content" :style="[curTabValue != 'overview' ? { border: 'none', padding: 0 } : {}]">
        <div class="coll-info" v-if="curTabValue == 'overview'">
          <div class="coll-info_item">
            <div class="coll-info_item_label">Logo</div>
            <div class="coll-info_item_value">
              <img src="/logo.png" width="35" alt="" />
            </div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Hash</div>
            <div class="coll-info_item_value">12312321</div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Max</div>
            <div class="coll-info_item_value">12312321</div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Buri</div>
            <div class="coll-info_item_value">12312321</div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Mintval</div>
            <div class="coll-info_item_value">12312321</div>
          </div>
          <div class="coll-info_item">
            <div class="coll-info_item_label">Holder</div>
            <div class="coll-info_item_value">12312321</div>
          </div>
        </div>
        <div class="coll-info" v-if="curTabValue == 'holders'">
          <DogTable :total="1000">
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
          <DogTable :total="1000">
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
  </div>
</template>

<style lang="scss">
#home {
  padding: 20px 6%;
  min-height: 80vh;
}

.nav-search {
  max-width: 500px;
  background: #fff;
  padding: 12px 12px;
  border-radius: 40px;
  border: 1px solid #000;
  order: 1;
  margin: 0 auto;
  .nav-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 14px;
  }
}

.coll-wrapper {
  margin-top: 50px;
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
    width: 400px;
    &--link {
      cursor: pointer;
      // color: rgb(220, 200, 244);
    }
  }
}
</style>
