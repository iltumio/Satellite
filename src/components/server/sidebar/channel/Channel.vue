<template src="./Channel.html"></template>

<script>
import VoiceUser from '../voice/VoiceUser';

export default {
  name: 'Channel',
  props: [
    'channel',
    'setActiveChannel',
  ],
  components: {
    VoiceUser,
  },
  methods: {
    getChannelClass() {
      return (this.$store.state.channel &&
        this.$store.state.channel.id === this.channel.id) ? 'active' : '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Channel.less"></style>
