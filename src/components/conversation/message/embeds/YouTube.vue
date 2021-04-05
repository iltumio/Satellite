<template>
  <div>
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <br>
            <iframe width="373" height="210" :src="`https://www.youtube.com/embed/${link[5]}`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>

export default {
  name: 'YouTube',
  props: [
    'link',
  ],
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
