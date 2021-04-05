<template>
  <div class="columns is-mobile">
    <div class="column is-one-quarter">
      <img :src="`http://ipfs.io/ipfs/${icon}`" :alt="symbol" />
    </div>
    <div class="column">
      <span class="name">{{ name }}</span>
      <br />
      <span class="price"
        >${{ (parseFloat(balance) * parseFloat(usd)).toFixed(2) }}</span
      >
      <span class="change-24h green">{{ changePercent24Hr }}%</span>
    </div>
    <div class="column breakdown">
      <span class="balance-token"
        >{{ parseFloat(balance).toFixed(2) }}&nbsp;{{ symbol }}</span
      >
      <br />
      <span class="balance-usd">${{ parseFloat(usd).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asset',
  props: ['name', 'symbol', 'icon', 'balance', 'usd', 'changePercent24Hr']
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
.name,
.balance-token {
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  font-weight: bold;
}
</style>
