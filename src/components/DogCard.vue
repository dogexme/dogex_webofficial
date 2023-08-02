<template>
  <div class="dog-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.dog-card {
  padding: 30px 20px 29px;
  border-radius: 8px;
  box-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #000;
  background-color: #fff;
}
</style>
