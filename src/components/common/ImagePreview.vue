<template>
    <div class="modal is-active">
      <div class="modal-background" v-on:click="close"></div>
      <div class="modal-content">
        <p class="image">
          <img :src="src" alt="">
          <a :href="src" target="_blank">{{$t('global.view_full_size')}}</a>
        </p>
      </div>
      <button class="modal-close is-large" aria-label="close" v-on:click="close"></button>
    </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: [
    'src',
    'close',
  ],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .image {
      max-height: 90%;
    }
</style>
