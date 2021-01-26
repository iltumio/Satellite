<template src="./Calling.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'Calling',
  props: ['active', 'callerId'],
  components: {
    CircleIcon,
  },
  methods: {
    async acceptCall() {
      const constraints = {
        audio: {
          autoGainControl: false,
          channelCount: 2,
          echoCancellation: this.$store.state.echoCancellation,
          latency: 0,
          noiseSuppression: this.$store.state.noiseSuppression,
          sampleRate: this.$store.state.audioQuality * 1000,
          sampleSize: this.$store.state.audioSamples,
          volume: 1.0,
        },
      };
      const stream = await this.$WebRTC.getMediaStream(constraints);
      this.$audioStream = stream;
      this.$WebRTC.answer(this.$store.state.incomingCall, stream);
      this.$store.commit('incomingCall', false);
      this.$store.commit('activeCall', this.$store.state.activeChat);
    },
    denyCall() {
      this.$WebRTC.hangup(this.$store.state.incomingCall);
      this.$store.commit('incomingCall', false);
    },
  },
  mounted() {
    this.$WebRTC.subscribe(() => {
      this.denyCall();
    }, ['REMOTE-HANGUP']);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Calling.less"></style>
