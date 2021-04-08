<template src="./Main.html"></template>

<script>
import config from "@/config/config";
// import Friends from '@/classes/contracts/Friends.ts';
import DwellerCachingHelper from "@/classes/DwellerCachingHelper.ts";
import InfoBar from "@/components/main/conversation/infobar/InfoBar";
import Chatbar from "@/components/main/conversation/chatbar/Chatbar";
import VoiceVideo from "@/components/main/conversation/voicevideo/VoiceVideo";
import Conversation from "@/components/main/conversation/conversation/Conversation";
import NoConversation from "@/components/main/conversation/conversation/NoConversation";
import LoadingConvorsation from "@/components/main/conversation/conversation/LoadingConvorsation";
import UserInfo from "@/components/main/conversation/userinfo/UserInfo";
import Crypto from "@/classes/crypto/Crypto.ts";

import MobileUtils from '@/utils/Mobile.ts';

import { Howl } from 'howler';

const newMessage = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
  loop: false,
  volume: 0.8,
  html5: true,
});

export default {
  name: "Main",
  components: {
    InfoBar,
    Chatbar,
    Conversation,
    LoadingConvorsation,
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
        this.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan
      ),
    };
  },
  methods: {
    async fetchMessages(address) {
      this.$store.dispatch('fetchMessages', {address});
    },
    bindThreads() {
      // TODO: remove all references to bind threads
      // this.$store.dispatch('bindAllThreads');
    },
    async subscribeToThreads() {
      this.$store.dispatch('subscribeToAllThreads', {});
      // Iterate over all friends
      // TODO: In the future we may want to do this in a more repsonsible way.
      // this.$store.state.friends.forEach(async (friend) => {
      //   this.$store.dispatch('subscribeToThread', {friend});
      // });
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
      if (!this.$streamManager) return;
      this.$streamManager.killStreams();
    },
    async makeCall() {
      if (this.$store.state.activeCall) {
        this.hangup();
      }
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
      // this.$WebRTC.connectIfNotConnected(this.$store.state.activeChat);
      this.$WebRTC.call(
        this.$store.state.activeChat,
        this.$streamManager.localStreams[0]
      );
      if (this.$store.state.deafened) {
        this.$streamManager.toggleLocalStreams();
        this.$streamManager.toggleRemoteStreams();
      } else if (this.$store.state.muted) {
        this.$streamManager.toggleLocalStreams();
      }
      this.$store.commit("activeCall", this.$store.state.activeChat);
      this.voice = true;
      this.mediaOpen = true;
      // this.sendMessage(Date.now(), 'call');
    },
    callAnswered() {
      this.voice = true;
      this.mediaOpen = true;
    },
    hangup() {
      this.stopStream();
      const id = this.$store.state.incomingCall || this.$store.state.activeCall;
      this.$WebRTC.hangupCall(id);
      this.$store.commit("activeCall", false);
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
      this.$store.dispatch('sendMessage', {data, type});
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler(direction) {
      if (this.isMobile()) {
        if (direction === "right") {
          //toggle for mobileSidebar
          if (!localStorage.hasOwnProperty("userSwiped")) {
            this.$store.commit("setMobileSidebar", true);
          } else if (
            localStorage.hasOwnProperty("userSwiped") &&
            localStorage.getItem("userSwiped") === "true"
          ) {
            //Logic to avoid users going from userInfo all the way to MobileSidebar in one swipe
            localStorage.setItem("userSwiped", false);
          } else {
            this.$store.commit("setMobileSidebar", true);
          }
        }
        if (direction === "left") {
          //toggle for userInfo
          localStorage.setItem("userSwiped", true);
          this.$store.commit("toggleUserInfo");
        }
      }
    },
  },
  mounted() {
    let lastChat = this.$store.state.activeChat;
    this.fetchMessages(lastChat);
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "addFriend":
          this.subscribeToThreads();
          break;
        case "connectMediaStream":
          // Connect to new peer.
          if (state.activeMediaStreamPeer) {
            this.voice = true;
          }
          break;
        case "activeChat":
          if (lastChat !== mutation.payload) {
            lastChat = mutation.payload;
            this.$store.commit("loadingMessages");
            this.fetchMessages(mutation.payload);
          }
          break;
        default:
          break;
      }
    });
    const WebRTC = this.$WebRTC;
    WebRTC.subscribe(() => {
      this.hangup();
    }, ["REMOTE-HANGUP"]);
    // WebRTC.mediaSubscription(
    //   ["INCOMING-CALL", "HANGUP", "ANSWER", "OUTGOING-CALL"],
    //   (event, identifier) => {
    //     switch (event) {
    //       case "ANSWER":
    //         this.callAnswered(identifier);
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // );
    this.subscribeToThreads();
    // this.friendsContract = new Friends(config.friends[config.network.chain]);
    this.bindThreads();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Main.less"></style>
