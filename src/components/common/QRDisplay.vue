<template>
  <div>
    <button class="modal-close is-large" aria-label="close" v-on:click="close"></button>
    <div class="modal-background"></div>
    <span class="qr-display">
      <h4 class="label">Your Friend Scans Me</h4>
      <h2 class="username">{{ $store.state.username }}</h2>
      <vue-qrcode :value="data" />
      <br>
      <button class="is-button button is-small is-primary"><i class="fas fa-download"></i></button>
    </span>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode';

export default {
  name: 'QRDisplay',
  props: ['data', 'close'],
  components: {
    VueQrcode,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.username {
  font-family: 'Space Mono', monospace;
  font-size: 18pt;
  margin-bottom: 0.5rem;
}
.modal-background {
  z-index: 10;
}
.qr-display {
  text-align: center;
  padding-top: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: calc(100% - 6rem);
  /* margin: 0 auto; */
  margin-left: 3rem;
  margin-top: 3rem;
  height: 240px;
  z-index: 10;
}
img {
  width: calc(100% - 4rem);
}
.button {
  width: calc(100% - 4rem);
}
</style>
