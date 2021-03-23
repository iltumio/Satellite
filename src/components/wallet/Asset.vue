<template>
  <div class="columns is-mobile">
    <div class="column is-one-quarter">
      <img :src="`http://ipfs.io/ipfs/${icon}`" :alt="symbol">
    </div>
    <div class="column">
      <span class="name">{{name}}</span>
      <br>
      <span class="price">$20.32</span>
      <span class="change-24h green">+13%</span>
    </div>
    <div class="column breakdown">
      <span class="balance-token">0.023&nbsp;{{symbol}}</span>
      <br>
      <span class="balance-usd">$0.03</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asset',
  props: ['name', 'symbol', 'icon']
}
</script>

<style lang="less" scoped>
  .is-one-quarter {
    width: 60px !important;
  }
  img {
    width: 45px;
    height: 45px;
    max-width: unset !important;
    border-radius: 50%;
  }
  .breakdown {
    text-align: right;
  }
  .name, .balance-token {
    font-family: 'Space Mono', monospace;
    text-transform: uppercase;
    font-weight: bold;
  }
</style>