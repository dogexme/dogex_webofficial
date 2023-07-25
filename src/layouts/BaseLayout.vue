<script setup lang="ts"></script>
<template>
  <div>
    <DogNav></DogNav>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>
<style lang="scss">
.content {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
