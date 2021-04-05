<template>
  <div id="payment">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <i class="fas fa-phone-volume logo"></i>
            <strong class="amount">{{
              $t('conversation.message.call.started')
            }}</strong><br />
            <small>{{ $t('conversation.message.call.incoming') }}</small><br />
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Call',
  props: ['message'],
  data () {
    return {
      name: false
    }
  },
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
