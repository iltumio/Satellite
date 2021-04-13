<template src="./Calling.html"></template>

<script>
import config from "@/config/config";
import CircleIcon from "@/components/common/CircleIcon";
import DwellerCachingHelper from "@/classes/DwellerCachingHelper.ts";

export default {
  name: "Calling",
  props: ["active", "callerId"],
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
          deviceId: "default"
        },
      };
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.$streamManager.addLocalStream(stream);

      const friend = this.$store.state.friends.find(
        (f) => f.address === this.$store.state.incomingCall
      );

      this.$store.dispatch("answerCall", { friend, stream });
    },
    denyCall() {
      this.$WebRTC.hangupCall(this.$store.state.incomingCall);
      this.$store.commit("incomingCall", false);
    },
    getFriendInfo(address) {
      return this.$store.state.friends
        ? this.$store.state.friends.find((f) => f.address === address)
        : null;
    },
  },
  async mounted() {
    this.dwellerCachingHelper = new DwellerCachingHelper(
      this.$ethereum,
      config.registryAddress,
      config.cacher.dwellerLifespan
    );

    this.$WebRTC.subscribe(() => {
      this.$store.commit("incomingCall", false);
    }, ["call-ended"]);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Calling.less"></style>
