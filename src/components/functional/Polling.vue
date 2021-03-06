<template></template>
<script>
import config from '@/config/config';

export default {
  name: 'polling',
  mounted() {
    this.friends();
    this.requests();
  },
  data() {
    return {
      friendsTimer: null,
      requestsTimer: null,
    };
  },
  methods: {
    friends() {
      // this.friendsTimer = setInterval(() => {
      //   this.$store.commit('fetchFriends', this.$store.state.activeAccount);
      // }, config.polling.friends);
      // this.friendsTimer();
    },
    requests() {
      this.requestsTimer = setInterval(() => {
        // Fetching
      }, config.polling.requests);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
