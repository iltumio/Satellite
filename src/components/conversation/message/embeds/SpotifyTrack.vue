<template>
  <div>
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <br>
            <iframe :src="embedify(link)" width="373" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>

export default {
  name: 'SpotifyTrack',
  props: [
    'link',
  ],
  methods: {
    embedify(link) {
      return link[0].replace('/track/', '/embed/track/');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .media {
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eee;
    padding: 0 1rem 0.5rem 1rem;
    max-width: 408px;
  }
  img {
    border-radius: 4px;
  }
</style>
