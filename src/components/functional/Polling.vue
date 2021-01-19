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
      this.friendsTimer = setInterval(() => {
        console.log('fetching friends');
      }, config.polling.friends);
    },
    requests() {
      this.requestsTimer = setInterval(() => {
        console.log('fetching friend requests');
      }, config.polling.requests);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
