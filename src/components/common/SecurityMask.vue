<template>
  <div id="security-mask">
    <h2>{{ $t('security-mask.content-redacted') }}</h2>
    <p>{{ $t('security-mask.content-hidden-message') }}<br /></p>
  </div>
</template>

<script>
export default {
  name: 'SecurityMask'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fa-user-secret {
  font-size: 72pt;
  margin-bottom: 1rem;
}
#security-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  background: #000;
  text-align: center;
  padding-top: 50%;
  color: #ccc;
}
h2 {
  font-family: 'Space Mono', monospace;
  font-size: 18pt;
}
</style>
