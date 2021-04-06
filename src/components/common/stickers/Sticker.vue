<template>
  <div class="inner-sticker">
    <img :src="`http://ipfs.io/ipfs/${sticker}`" alt="" />
    <br />
    <span :class="`sticker-name ${signature ? 'signature' : ''}`" v-if="name">
      <i class="fas fa-signature" v-if="signature"></i> &nbsp;
      {{ name }}
    </span>
    <span class="sticker-name" v-else-if="price"
      >{{ $t('stickers.buy-button-text') }}: {{ price }} MATIC</span
    >
  </div>
</template>

<script>
export default {
  name: 'Sticker',
  props: ['sticker', 'name', 'price', 'signature']
}
</script>

<style lang="less" scoped>
img {
  max-height: 100%;
}
.sticker-name {
  display: block;
  background: #0984e3;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #fff;
  max-width: 100%;
  margin: 0 auto;
  margin-top: 0.5rem;
}

.sticker-name.signature {
  background: #1abc9c;
}

.sticker-name:hover {
  cursor: pointer;
}

.inner-sticker {
  display: inline-block;
  height: 125px;
  width: 100%;
}

.inner-sticker:hover {
  cursor: pointer;
}
</style>
