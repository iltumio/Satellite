<template>
  <h1 class="heading">
    {{text}}
  </h1>
</template>

<script>
export default {
  name: 'PrimaryHeading',
  props: [
    'text',
  ],
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="less">
  .heading {
    font-family: 'Space Mono', monospace;  
    font-size: 20pt;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }
</style>
