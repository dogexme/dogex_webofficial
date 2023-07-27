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
          <a href="https://github.com/" target="_blank" class="nftfont link-list_item_a">&#xe691;</a>
        </li>
        <li class="link-list_item">
          <a href="https://twitter.com/" target="_blank" class="nftfont link-list_item_a">&#xe652;</a>
        </li>
        <li class="link-list_item">
          <a href="" target="_blank" class="nftfont link-list_item_a">&#xe652;</a>
        </li>
        <li class="link-list_item">
          <a href="" target="_blank" class="nftfont link-list_item_a">&#xe652;</a>
        </li>
      </ul>
      <span style="font-size: 12px">Copyright © 2023 Dogescan</span>
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
  display: flex;
  flex-direction: column;
  height: 100px;
  border-top: 1px solid #000;
  justify-content: center;
  align-items: center;
}
.link-list {
  margin-bottom: 12px;
  &_item {
    display: inline-block;
    margin: 0 12px;
    &_a {
      font-size: 16px !important;
    }
  }
}
</style>
