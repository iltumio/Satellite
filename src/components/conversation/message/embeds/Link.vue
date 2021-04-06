<template>
  <div>
    <ExternalLink :link="message.data.link" :text="message.data.link" />
    <article class="media">
      <div class="media-content">
        <img :src="message.data.preview" />
        <div class="content">
          <p>
            <strong>{{ message.data.title }}</strong
            ><br />
            <ExternalLink :link="message.data.link" :text="message.data.link" />
            <br />
            {{ message.data.text }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import ExternalLink from '@/components/common/ExternalLink'

export default {
  name: 'Link',
  props: ['message'],
  components: {
    ExternalLink
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.media {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
  padding: 1rem;
  max-width: 400px;
  color: #666;
}
img {
  border-radius: 4px;
}
</style>
