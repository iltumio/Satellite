<template></template>

<script>
import MessageBroker from '@/classes/MessageBroker.ts';
// import config from '@/config/config';
// import { Howl } from 'howler';

export default {
  name: 'ScreenCapture',
  data() {
    return {
      messageBroker: new MessageBroker(
        this.$store.state.activeAccount,
        (data) => {
          this.$store.commit('updateMessages', data);
        },
      ),
    };
  },
  methods: {
    // Sends messages to remote peer and the message broker.
    async sendMessage(data, type) {
      if (window.Vault74.messageBroker) {
        const msg = window.Vault74.messageBroker.sentMessage(
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
          const message = {
            _id: msg.id,
            sender: msg.sender,
            to: this.$store.state.activeChat,
            at: msg.at,
            type: msg.type,
            payload: msg.payload,
          };
          // If we have their public key, we will encrypt their message
          this.$database.messageManager
            .addMessageDeterministically(threadID, message, this.$store.state.activeChat);
        }
      }
      window.Vault74.Peer2Peer.send(
        this.$store.state.activeChat,
        'message',
        {
          type: type || 'text',
          data,
        },
      );
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
