<template></template>

<script>
// import config from '@/config/config';
// import { Howl } from 'howler';

export default {
  name: 'ScreenCapture',
  data() {
    return {
    };
  },
  methods: {
    // Sends messages to remote peer and the message broker.
    async sendMessage(data, type) {
      if (this.$database.messageManager) {
        const msg = this.$database.messageManager.buildMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data,
          },
        );

        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
        const threadExists = await this.$database.threadManager.fetchThread(id);
        if (threadExists) {
          const threadID = await this.$database.threadManager.threadAt(id);
          // If we have their public key, we will encrypt their message
          this.$database.messageManager
            .addMessageDeterministically(threadID, msg, this.$store.state.activeChat);
        }
      }
      const peer = this.$WebRTC.find(this.$store.state.activeChat);
      if (peer && peer.isAlive) {
        peer.send(
          'message',
          {
            type: type || 'text',
            data,
          },
        );
      }
    },
    async startCapture(displayMediaOptions) {
      let captureStream = null;
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
      return captureStream;
    },
    getContext() {
      return {
        video: {
          cursor: this.$store.state.captureStream,
        },
        audio: {
          echoCancellation: this.$store.state.echoCancellation,
          latency: 0,
          noiseSuppression: this.$store.state.noiseSuppression,
          sampleRate: this.$store.state.audioQuality * 1000,
          sampleSize: this.$store.state.audioSamples,
          volume: 1.0,
        },
      };
    },
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'screenShareRequest') {
        this.startCapture(this.getContext());
      }
    });
  },
};
</script>
