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
    return {
      audioStream: null,
    };
  },
  mounted() {
    // @ts-ignore
    const WebRTC = this.$WebRTC;
    WebRTC.subscribe((event, identifier) => {
      this.callEnded(identifier);
    }, ['REMOTE-HANGUP']);
    // WebRTC.mediaSubscription(
    //   ['INCOMING-CALL', 'HANGUP', 'STREAM-RECIEVED', 'OUTGOING-CALL', 'ANSWER'],
    //   (event, identifier, mediaStream) => {
    //     switch (event) {
    //       case 'OUTGOING-CALL':
    //         this.outgoingCall(identifier);
    //         break;
    //       case 'INCOMING-CALL':
    //         this.incomingCall(identifier);
    //         break;
    //       case 'HANGUP':
    //         this.callEnded(identifier);
    //         break;
    //       case 'STREAM-RECIEVED':
    //         this.streamRecived(identifier, mediaStream);
    //         break;
    //       case 'ANSWER':
    //         this.callAnswered(identifier);
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    // );
  },
  methods: {
    /** @method
     * Stream the audio to the DOM
     * @name playRemoteStream
     * @argument e source object to play audio to
     */
    playRemoteStream(e) {
      this.audioStream = new Audio();
      this.audioStream.muted = false;
      this.audioStream.srcObject = e;
      this.audioStream.play();
    },
    incomingCall(from) {
      callingSound.play();
      this.$store.commit('incomingCall', from);
    },
    outgoingCall() {
      callingSound.play();
    },
    callEnded() {
      hangupSound.play();
      callingSound.stop();
      this.audioStream = null;
    },
    callAnswered() {
      connectedSound.play();
      callingSound.stop();
    },
    streamRecived(from, mediaStream) {
      connectedSound.play();
      callingSound.stop();
      this.playRemoteStream(mediaStream);
      this.$streamManager.addRemoteStream(mediaStream);
    },
  },
};
</script>
