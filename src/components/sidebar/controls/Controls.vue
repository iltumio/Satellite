<template src="./Controls.html"></template>

<script>
import Mousetrap from 'mousetrap';
import CircleIcon from '@/components/common/CircleIcon';
import config from '@/config/config';

const muteAudio = new Audio(`${config.ipfs.browser}${config.sounds.mute}`);
// eslint-disable-next-line
const unmuteAudio = new Audio(`${config.ipfs.browser}${config.sounds.unmute}`);

const deafenAudio = new Audio(`${config.ipfs.browser}${config.sounds.deafen}`);
const unDeafenAudio = new Audio(`${config.ipfs.browser}${config.sounds.undeafen}`);

export default {
  name: 'Controls',
  props: ['toggleSettings'],
  components: {
    CircleIcon,
  },
  data() {
    return {
      muted: false,
      deafened: false,
      tooltip: 'Copy Account',
      config,
    };
  },
  methods: {
    /** @method
     * parse the stored nettype to readable string
     * @name getNetwork
     */
    getNetwork() {
      switch (this.$store.state.web3Stats.nettype) {
        case 'private':
          return 'Testnet';
        case 'main':
          return 'Mainnet';
        default:
          return 'Unknown';
      }
    },
    /** @method
     * Jump to the active media stream location
     * @name jumpTo
     */
    jumpTo() {
      this.$store.commit('changeRoute', 'main');
      this.$store.commit('activeChat', this.$store.state.activeMediaStreamPeer);
    },
    /** @method
     * Set tooltip text to represent the fact
     * that we copied the addreass of the client
     * @name copied
     */
    copied() {
      const original = this.tooltip;
      this.tooltip = 'Copied!';
      setTimeout(() => {
        this.tooltip = original;
      }, 1000);
    },
    /** @method
     * Mute the active stream
     * @name copied
     */
    toggleMute() {
      this.muted = !this.muted;
      if (this.muted) muteAudio.play();
      if (!this.muted) unmuteAudio.play();
      this.$store.commit('muted', this.muted);
      this.$streamManager.toggleLocalStreams(this.muted);
    },
    /** @method
     * Mute the active stream &
     * mute remote audio
     * @name toggleDeafen
     */
    toggleDeafen() {
      this.deafened = !this.deafened;
      if (this.deafened) deafenAudio.play();
      if (!this.deafened) unDeafenAudio.play();
      this.$store.commit('deafened', this.deafened);
      this.$streamManager.toggleLocalStreams(this.muted || this.deafened);
      this.$streamManager.toggleRemoteStreams(this.deafened);
    },
  },
  mounted() {
    Mousetrap.bind('option+m', this.toggleMute);
    Mousetrap.bind('option+d', this.toggleDeafen);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Controls.less"></style>
