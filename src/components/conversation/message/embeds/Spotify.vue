<template>
  <div>
    <article class="media">
      <div class="media-content">
        <div class="content">
          <iframe :src="embedify(link)" width="373" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
      </div>
    </article>
  </div>
</template>

<script>

export default {
  name: 'Spotify',
  props: [
    'link',
  ],
  methods: {
    embedify(link) {
      return link[0].replace('/playlist/', '/embed/playlist/');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
  @media (max-width: 768px) {
    .media {
      padding: 0;
      border-radius: 0;

      .content {
        margin-bottom: -0.5rem;
      }
    }
  }
</style>
