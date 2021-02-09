<template>
    <span class="loading-indicator" :style="`width: ${size}px; height: ${size}px`">
      <img src="https://gateway.pinata.cloud/ipfs/QmcWWAQeGdRaEPKRRYFgFXp8FFLRFn1a7DCdMiRcpAMe3D" class="ring"/>
      <img src="https://gateway.pinata.cloud/ipfs/QmWCaaSbpD66aaKabTeW5cckEp9VzkCR6GHitkgiJXYQnh" class="center"/>
    </span>
</template>

<script>
export default {
  name: 'Loader',
  props: ['size'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading-indicator {
    position: relative;
    display: inline-block;
  }
  .ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
  }
  .center {
    position: absolute;
    width: 75%;
    height: 75%;
    top: 12.5%;
    left: 12.5%;
  }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

</style>
