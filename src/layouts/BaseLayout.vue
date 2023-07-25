<script setup lang="ts"></script>
<template>
  <div>
    <DogNav></DogNav>
    <main class="content">
      <router-view></router-view>
    </main>
    <footer id="footer">大苏打撒旦</footer>
  </div>
</template>
<style lang="scss">
.content {
  max-width: 1280px;
  margin: 0 auto;
}
#footer {
  border-top: 1px solid #000;
}
</style>
