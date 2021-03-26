<template>
  <div id="sticker">
    <img :src="`http://ipfs.io/ipfs/${message.data}`" class="embeded-sticker" />
    <br>
    <span class="verified"><i class="fas fa-badge-check"></i> {{$t('stickers.verified-sticker')}}</span>
  </div>
</template>

<script>

export default {
  name: 'Sticker',
  props: [
    'message',
  ],
  data() {
    return {
      name: false,
    };
  },
  mounted() {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .embeded-sticker {
    max-width: 200px;
  }
  .media {
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eee;
    padding: 0 1rem 0.5rem 1rem;
    max-width: 300px;
    color: #666;
    position: relative;
    border-left: 4px solid #00d0a1;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  .media:hover .logo {
    color: #000;
  }
  .media-content {
    padding: 0.3rem;
    font-size: 10pt;
  }
  .content {
    padding-left: 5rem;
  }
  .logo {
    font-size: 26pt;
    position: absolute;
    left: 2rem;
    top: 0.9rem;
  }
  .amount {
    color: #00d0a1;
    font-size: 15pt;
  }
  img {
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .verified {
      width: 100%;
      text-align: center;
      display: block;
    }
  }
</style>
