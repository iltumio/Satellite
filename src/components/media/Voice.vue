<template></template>

<script>
// @ts-ignore
import config from '@/config/config';
import { Howl } from 'howler';

const callingSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.call}`],
  loop: true,
  volume: 1.0,
  html5: true,
});

const hangupSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.hangup}`],
  volume: 1.0,
  html5: true,
});

const connectedSound = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.connected}`],
  volume: 1.0,
  html5: true,
});

export default {
  name: 'Voice',
  data() {
    return {};
  },
  mounted() {
    // @ts-ignore
    const WebRTC = this.$WebRTC;
    WebRTC.mediaSubscription(
      ['INCOMING-CALL', 'HANGUP', 'ANSWER', 'OUTGOING-CALL'],
      (event, identifier) => {
        switch (event) {
          case 'OUTGOING-CALL':
            this.outgoingCall(identifier);
            break;
          case 'INCOMING-CALL':
            this.incomingCall(identifier);
            break;
          case 'HANGUP':
            this.callEnded(identifier);
            break;
          case 'ANSWER':
            this.callAnswered(identifier);
            break;
          default:
            break;
        }
      },
    );
  },
  methods: {
    incomingCall(from) {
      callingSound.play();
      console.log('incomingCall', from);
    },
    outgoingCall(to) {
      callingSound.play();
      console.log('outgoingCall', to);
    },
    callEnded(from) {
      hangupSound.play();
      callingSound.stop();
      console.log('callEnded', from);
    },
    callAnswered(from) {
      connectedSound.play();
      callingSound.stop();
      console.log('callAnswered', from);
    },
  },
};
</script>
