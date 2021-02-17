<template src="./Calling.html"></template>

<script>
import config from '@/config/config';
import CircleIcon from '@/components/common/CircleIcon';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';

const dwellerCachingHelper = new DwellerCachingHelper(
  config.registryAddress,
  config.cacher.dwellerLifespan,
);

export default {
  name: 'Calling',
  props: ['active', 'callerId'],
  components: {
    CircleIcon,
  },
  data() {
    return {
      dweller: false,
    };
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
      this.$streamManager.addLocalStream(stream);
      this.$WebRTC.answer(this.$store.state.incomingCall, this.$streamManager.localStreams[0]);
      this.$store.commit('incomingCall', false);
      this.$store.commit('activeCall', this.$store.state.activeChat);
    },
    denyCall() {
      this.$WebRTC.hangup(this.$store.state.incomingCall);
      this.$store.commit('incomingCall', false);
    },
  },
  async mounted() {
    this.$WebRTC.subscribe(() => {
      this.denyCall();
    }, ['REMOTE-HANGUP']);
    this.$WebRTC.mediaSubscription(
      ['INCOMING-CALL'],
      async (event, identifier) => {
        this.dweller = await dwellerCachingHelper.getDweller(identifier);
      },
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Calling.less"></style>
