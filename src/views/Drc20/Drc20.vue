<script setup lang="ts">
import { Loading, CircleCloseFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const txid = ref('')
const loadingSearch = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockCount = ref(0)

async function search(txidValue: string) {
  if (txidValue) {
    txid.value = txidValue
  }
  const hash = txid.value.trim()
  if (!hash || loadingSearch.value) return
  router.push(`/drc20/item/${hash}`)
}
</script>
<template>
  <div id="home">
    <div class="nav-search">
      <form @submit.prevent class="nav-search_inputwrap">
        <i class="dog-icon dog-icon_search"></i>
        <input class="nav-search-input" type="text" maxlength="128" placeholder="Deploy Hash" v-model="txid" @keydown.enter="search('')" />
        <el-icon v-if="loadingSearch" class="loading-icon"><Loading /></el-icon>
        <el-icon v-if="!loadingSearch && txid.length" style="cursor: pointer" @click="txid = ''"><CircleCloseFilled /></el-icon>
      </form>
      <div class="blocks-number">
        <i class="dog-icon dog-icon_block"></i>
        Processed Blocks: <span v-if="blockCount">{{ blockCount }}</span>
      </div>
    </div>
    <DogCard v-if="route.name == 'drc20'" style="margin-top: 12px">
      <CastTable @search="search"></CastTable>
    </DogCard>
    <router-view v-else></router-view>
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
  width: 100%;
  box-sizing: border-box;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background: url(/src/assets/img/bg.png) no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 20px;

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
  margin-top: 12px;
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
