<template></template>

<script>
// @ts-ignore
import config from "@/config/config";
import { Howl } from "howler";

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
  name: "Voice",
  data() {
    return {
      audioStream: null,
    };
  },
  mounted() {
    // @ts-ignore
    const WebRTC = this.$WebRTC;
    WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        switch(event) {
          case 'incoming-call':
            this.incomingCall(identifier)
            break;
          case 'outgoing-call':
            this.outgoingCall(identifier)
            break;
          case 'call-ended':
            this.callEnded(identifier);
            break;
          case 'call-stream':
            this.streamRecived(identifier, data[0]);
            break;
          default:
            break;
        }

      },
      ["call-ended", "call-stream","incoming-call", "outgoing-call"]
    );
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
      this.$store.commit("incomingCall", from);
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
