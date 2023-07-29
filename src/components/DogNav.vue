<script setup lang="ts"></script>

<template>
  <div class="nav-place">
    <nav class="nav">
      <div class="nav-wrap">
        <div class="logo-wrap">
          <!-- <span class="nav-logo"></span> -->
          <a href="/" class="nav-title">dogex.me</a>
        </div>
        <!-- <input type="checkbox" id="show-search-bar" /> -->
        <!-- <label for="show-search-bar" class="nav-search-icon">显示</label> -->
        <!-- <div class="nav-search-wrap">
          <div class="nav-search">
            <input type="text" placeholder="Search for transactions, addresses, blocks and embedded text data..." class="nav-search-input" />
          </div>
        </div> -->
        <ul class="nav-active">
          <li class="nav-active-item">
            <a href="/">Home</a>
          </li>
          <li class="nav-active-item nav-active-item--weblink">
            <a href="https://dpalwallet.io" target="_blank">Dpalwallet</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #333;
  z-index: 9999;
  &::after {
    content: '';
    bottom: 0;
    right: 0;
    position: absolute;
    display: block;
    height: 5px;
    width: 100%;
    background-color: #f5f5f5;
  }
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
  border: 1px solid #000;
  margin: 0 6px;
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
