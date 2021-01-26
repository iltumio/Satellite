<template src="./Main.html"></template>

<script>
import config from '@/config/config';
import Friends from '@/classes/contracts/Friends.ts';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import InfoBar from '@/components/main/conversation/infobar/InfoBar';
import Chatbar from '@/components/main/conversation/chatbar/Chatbar';
import VoiceVideo from '@/components/main/conversation/voicevideo/VoiceVideo';
import Conversation from '@/components/main/conversation/conversation/Conversation';
import NoConversation from '@/components/main/conversation/conversation/NoConversation';
import UserInfo from '@/components/main/conversation/userinfo/UserInfo';
import Crypto from '@/classes/crypto/Crypto.ts';

export default {
  name: 'Main',
  components: {
    InfoBar,
    Chatbar,
    Conversation,
    VoiceVideo,
    NoConversation,
    UserInfo,
  },
  data() {
    return {
      mediaOpen: false,
      voice: false,
      playCallSoundTimer: null,
      subscribed: {},
      crypto: new Crypto(),
      dwellerCachingHelper: new DwellerCachingHelper(
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan,
      ),
    };
  },
  methods: {
    async fetchMessages(remoteAddress) {
      // this.$store.commit('loadingMessages');
      const friend = this.$store.state.friends.find(f => f.address === remoteAddress);
      if (!friend) return;
      const messages = await this.$database.messageManager.getMessages(friend.threadID);
      const key = this.crypto.getKey(this.$store.state.activeChat);
      const decrypted = await this.$database.messageManager.bulkDecrypt(messages, key);
      this.$store.commit('updateMessages', decrypted);
    },
    // TODO: This should be removed in the future, we should pull
    // the thread ID from the friend object all over the app instead.
    bindThreads() {
      const { friends } = this.$store.state;
      friends.forEach(async (f) => {
        const threadID = await this.$database.threadManager.makeIdentifier(
          this.$store.state.activeAccount,
          f.address,
        );
        this.$database.threadManager.storeThread(threadID, f.threadID);
      });
    },
    async subscribeToThreads() {
      this.$store.state.friends.forEach(async (friend) => {
        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, friend.address);
        const existingThread = this.$database.threadManager
          .fetchThread(id);
        if (existingThread) {
          if (!this.subscribed[friend.address]) {
            const threadID = await this.$database.threadManager.threadAt(id);
            const closer = await this.$database.messageManager.subscribe(threadID, async (update) => {
              const key = await this.crypto.getKey(this.$store.state.activeChat);
              if (update.instance.sender !== this.$store.state.activeChat) {
                this.$store.commit('markUnread', update.instance.sender);
              }
              if (key) {
                const decrypted = await this.$database.messageManager.decryptMessage(update.instance, key);
                this.$store.commit('appendMessage', decrypted);
              } else {
                this.$store.commit('appendMessage', update.instance);
              }
            });
            this.subscribed[friend.address] = closer;
          }
        }
      });
    },
    // Switch from one media stream to another
    switchTo(voice = false) {
      this.mediaOpen = true;
      this.voice = voice;
    },

    // TODO: Move all this somewhere more relevant...
    /** @method
     * Clear the usage of the audio devices
     * @name stopStream
     */
    stopStream() {
      if (!this.$audioStream) return;
      this.$audioStream.getAudioTracks().forEach((track) => {
        track.stop();
      });
      this.$audioStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.$audioStream = null;
    },
    async makeCall() {
      if (this.$store.state.activeCall) return;
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
      this.$WebRTC.call(this.$store.state.activeChat, this.$audioStream);
      this.$store.commit('activeCall', this.$store.state.activeChat);
      this.voice = true;
      this.mediaOpen = true;
    },
    callAnswered() {
      this.voice = true;
      this.mediaOpen = true;
    },
    hangup() {
      this.stopStream();
      this.$WebRTC.hangup(this.$store.state.activeChat);
      this.$store.commit('activeCall', false);
      this.voice = false;
      this.mediaOpen = false;
    },
    // Enter a voice or video call
    toggleMedia(voice = false) {
      this.voice = voice;
      this.mediaOpen = !this.mediaOpen;
      if (!this.mediaOpen) {
        this.voice = false;
      }
    },
    // Send a message in the chat, this will probably
    // be rewritten when the chat is functional
    async sendMessage(data, type) {
      if (this.$database.messageManager) {
        const msg = this.$database.messageManager.buildMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data: type === 'text' ?
              encodeURI(data) : data,
          },
        );
        this.$store.commit('appendMessage', msg);
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
    },
  },
  mounted() {
    let lastChat = this.$store.state.activeChat;
    this.fetchMessages(lastChat);
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'connectMediaStream') {
        // Connect to new peer.
        if (state.activeMediaStreamPeer) {
          this.voice = true;
        }
      } else if (mutation.type === 'activeChat') {
        if (lastChat !== mutation.payload) {
          lastChat = mutation.payload;
          this.$store.commit('loadingMessages');
          this.fetchMessages(mutation.payload);
        }
      }
    });
    const WebRTC = this.$WebRTC;
    WebRTC.subscribe(() => {
      this.hangup();
    }, ['REMOTE-HANGUP']);
    WebRTC.mediaSubscription(
      ['INCOMING-CALL', 'HANGUP', 'ANSWER', 'OUTGOING-CALL'],
      (event, identifier) => {
        switch (event) {
          case 'ANSWER':
            this.callAnswered(identifier);
            break;
          default:
            break;
        }
      },
    );
    this.subscribeToThreads();
    this.friendsContract = new Friends(config.friends[config.network.chain]);
    this.bindThreads();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Main.less"></style>
