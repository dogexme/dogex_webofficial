<script setup lang="ts"></script>
<template>
  <div id="container">
    <DogNav></DogNav>
    <main class="content">
      <router-view></router-view>
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
      <span style="font-size: 12px">Copyright © 2023 dogex.me</span>
    </footer>
  </div>
</template>
<style lang="scss">
.content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  overflow: hidden;
}
#footer {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 130px;
  border-top: 1px solid #333;
  justify-content: center;
  align-items: center;
  &::before {
    content: '';
    top: 0;
    right: 0;
    position: absolute;
    display: block;
    height: 5px;
    width: 100%;
    background-color: #f5f5f5;
  }
}
.link-list {
  margin-bottom: 12px;
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
