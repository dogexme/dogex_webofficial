<script setup lang="ts"></script>
<template>
  <div id="container">
    <DogNav></DogNav>
    <main class="content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['home']">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </main>
    <footer id="footer">
      <ul class="link-list">
        <li class="link-list_item">
          <a href="https://twitter.com/dpalofficial" target="_blank" class="nft link-list_item_a">&#xe652;</a>
        </li>
        <li class="link-list_item">
          <a href="https://github.com/dpalwallet" target="_blank" class="nft link-list_item_a">&#xe691;</a>
        </li>
        <!-- <li class="link-list_item">
          <a href="https://discord.com/dpalwallet" target="_blank" class="nft link-list_item_a">&#xebf8;</a>
        </li> -->
        <li class="link-list_item">
          <a href="https://t.me/dpalwallet" target="_blank" class="nft link-list_item_a">&#xec25;</a>
        </li>
      </ul>
      <span style="font-size: 16px; margin-top: 24px">Copyright © 2023 dogex.me</span>
    </footer>
  </div>
</template>
<style lang="scss">
.content {
  width: 100%;
  max-width: 1280px;
  min-height: 72.5vh;
  box-sizing: border-box;
  padding: 12px 12px 0;
  margin: 0 auto;
  overflow: hidden;
}
#footer {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 14.444444444444443vmin;
  min-height: 116px;
  border-top: 1px solid #333;
  justify-content: center;
  align-items: center;
  margin-top: 5.55vmin;
}
.link-list {
  &_item {
    display: inline-block;
    margin: 0 12px;
    &_a {
      font-size: 18px !important;
      color: #333 !important;
    }
  }
}
</style>
