<template>
  <div id="payment">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <i class="fas fa-comment-alt logo"></i>
            <strong class="amount">{{$t('conversation.message.offline_chat.heading')}}</strong><br />
            <small>{{$t('conversation.message.offline_chat.text',{name: $store.state.friends.filter(f => f.address === $store.state.activeChat)[0].name})}}</small><br>
          </p>
        </div>
        <div class="content-alt">
          <button
            v-if="!doesExist"
            v-on:click="storeThread"
            class="button is-primary is-small"
            style="width: 100%;">{{$t('conversation.message.offline_chat.enable')}}</button>
          <button
            v-else
            disabled
            class="button is-success is-small"
            style="width: 100%;">{{$t('conversation.message.offline_chat.enabled')}}</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'OfflineChat',
  props: [
    'message',
  ],
  data() {
    return {
      doesExist: this.doesThreadExist(),
    };
  },
  methods: {
    doesThreadExist() {
      const id = this.$database.threadManager
        .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
      const threadID = this.$database.threadManager
        .fetchThread(id);
      if (!threadID) return false;
      const matches = this.$database.threadManager
        .threadMatches(id, this.message.data.threadID);
      return matches;
    },
    storeThread() {
      const id = this.$database.threadManager
        .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
      this.$database.threadManager.storeThread(id, this.message.data.threadID);
      this.doesExist = this.doesThreadExist();
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
    max-width: 450px;
    color: #666;
    position: relative;
    border-left: 4px solid #00d0a1;
    margin-bottom: 0.5rem;
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
  .content-alt {
    padding: 0;
    width: 100%;
  }
  .logo {
    font-size: 28pt;
    position: absolute;
    left: 2rem;
    top: 0.75rem;
  }
  .amount {
    color: #00d0a1;
    font-size: 15pt;
  }
  img {
    border-radius: 4px;
  }
</style>
