<script setup lang="ts">
import { omitCenterString } from '@/utils'
import { EpPropMergeType } from 'element-plus/lib/utils/index.js'

type DrawerDirection = EpPropMergeType<StringConstructor, 'ltr' | 'rtl' | 'ttb' | 'btt', unknown>

const isShowDrawer = ref(false)
const activePath = ref('/')
const drawerDirection = ref<DrawerDirection>('ltr')
const { connectDpal, address, isInstall } = useDoge()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selectItem() {
  isShowDrawer.value = false
}

function triggerDrawer(direction: DrawerDirection) {
  isShowDrawer.value = !isShowDrawer.value
  drawerDirection.value = direction
}

connectDpal()
</script>

<template>
  <div class="nav-place">
    <nav class="nav">
      <div class="nav-wrap">
        <div class="logo-wrap">
          <a class="nav-more" href="javascript:void(0)" @click="triggerDrawer('ltr')">&#xe66c;</a>
          <!-- <span class="nav-logo"></span> -->
          <a href="/" class="nav-title">dogex.me</a>
          <div class="nav-active-item nav-protocol-tag">DRC721</div>
        </div>
        <el-menu class="nav-menu" @select="selectItem" router :default-active="activePath" mode="horizontal" background-color="#fff" text-color="#333" active-text-color="#333">
          <el-menu-item index="/">
            <router-link to="/">Home</router-link>
          </el-menu-item>
        </el-menu>
        <ul class="nav-active">
          <!-- <li class="nav-active-item">
            <a href="/home" @click="connectDpal">Home</a>
          </li> -->
          <li class="nav-active-item nav-active-item--weblink" v-if="!address">
            <a href="javascript:void(0)" @click="connectDpal" v-if="isInstall">Dpalwallet</a>
            <a href="https://dpalwallet.io" target="_blank" v-else>Dpalwallet</a>
          </li>
          <li style="margin-left: 12px" v-if="address">
            <el-tooltip popper-class="nav-popper" :hide-after="0" effect="dark" content="Click to address" placement="bottom">
              <router-link :to="`/address/${address}`" style="display: flex; align-items: center">{{ address }} <el-avatar style="margin-left: 12px" :size="24" src="/logo.png" /></router-link>
            </el-tooltip>
          </li>
        </ul>
        <a class="nav-active-more" @click="triggerDrawer('rtl')" href="javascript:void(0)">&#xeb10;</a>
      </div>
    </nav>
    <el-drawer append-to-body :show-close="false" :with-header="false" size="70%" v-model="isShowDrawer" :direction="drawerDirection" modal-class="nav-drawer">
      <el-menu v-if="drawerDirection == 'ltr'" @select="selectItem" router :default-active="activePath" background-color="#fff" text-color="#333" active-text-color="#333" mode="vertical">
        <el-menu-item index="/">
          <router-link to="/">Home</router-link>
        </el-menu-item>
      </el-menu>
      <el-menu v-else background-color="#fff" text-color="#333" active-text-color="#333" mode="vertical" @select="selectItem">
        <el-menu-item v-if="address" index="address"
          ><router-link :to="`/address/${address}`" style="display: flex; align-items: center"
            >{{ omitCenterString(address) }} <el-avatar style="margin-left: 12px" :size="24" src="/logo.png" /></router-link
        ></el-menu-item>
        <el-menu-item v-else index="dpalwallet">
          <a href="javascript:void(0)" @click="connectDpal" v-if="isInstall">Dpalwallet</a>
          <a href="https://dpalwallet.io" target="_blank" v-else>Dpalwallet</a>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.el-menu--horizontal {
  --el-menu-item-height: 31px;
  margin-left: 15px;
  border: none;
  flex: 1;
}

.nav-protocol-tag {
  padding: 2px 8px;
  font-weight: bold;
  font-size: 16px;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #333;
  box-shadow: inset 0 -4px 0 0 rgba(0, 0, 0, 0.1);
}
.nav-logo {
  --size: 29px;
  display: inline-block;
  background: url('/logo.png');
  background-size: 100%;
  width: var(--size);
  height: var(--size);
}
#show-search-bar {
  display: none;
}
.nav-place {
  height: 58px;
}
.nav-more {
  font-family: nft;
  font-size: 28px;
  display: none;
  @media screen and (max-width: 876px) {
    display: block;
  }
}
.nav-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px;
}
.nav-search {
  width: 500px;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  order: 1;
  .nav-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 14px;
  }
}
.nav-search-icon {
  display: none;
}
.nav-active {
  display: flex;
  align-items: center;
  order: 2;
}
.nav-active-item {
  position: relative;
  display: inline-block;
  border-radius: 20px;
  border: 1px solid #333;
  margin: 0 3px;
  overflow: hidden;
  a {
    display: block;
    padding: 4px 12px;
  }
  &::after {
    content: '';
    bottom: 0;
    right: 0;
    position: absolute;
    display: block;
    height: 3px;
    width: 100%;
    background-color: #f5f5f5;
  }
  &--weblink {
    background-color: currentColor;
    color: rgb(238, 181, 15);
    &::after {
      background-color: rgb(218, 167, 14) !important;
    }
  }
}

.nav-active-more {
  font-family: nft;
  display: none;
  font-size: 26px;
}
.logo-wrap {
  display: flex;
  align-items: center;
  order: 0;
}

.nav-title {
  font-family: SistemnyjC;
  margin-left: 20px;
  font-weight: bold;
  font-size: 24px;
}

@media screen and (max-width: 876px) {
  .nav-menu {
    display: none;
  }
  .nav-active {
    display: none;
  }
  .nav-active + .nav-active-more {
    display: block;
  }
}

@media screen and (max-width: 1280px) {
  .nav-wrap {
    flex-wrap: wrap;
    overflow: hidden;
  }
  #show-search-bar:checked ~ .nav-search-wrap {
    height: 35px;
  }
  .nav-search {
    width: unset;
  }
  .nav-search-wrap {
    order: 3;
    flex-basis: 100%;
    height: 0;
    transition: height 0.2s;
    overflow: hidden;
  }
  .nav-search-icon {
    display: block;
    order: 1;
    margin-left: auto;
  }
}
</style>
