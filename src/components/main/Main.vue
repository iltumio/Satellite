<template src="./Main.html"></template>

<script>
import config from '@/config/config'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts'
import InfoBar from '@/components/conversation/infobar/InfoBar'
import Chatbar from '@/components/conversation/chatbar/Chatbar'
import VoiceVideo from '@/components/conversation/voicevideo/VoiceVideo'
import Conversation from '@/components/conversation/conversation/Conversation'
import NoConversation from '@/components/conversation/conversation/NoConversation'
import LoadingConvorsation from '@/components/conversation/conversation/LoadingConvorsation'
import UserInfo from '@/components/conversation/userinfo/UserInfo'
import Crypto from '@/classes/crypto/Crypto.ts'

import MobileUtils from '@/utils/Mobile.ts'
import { isCallActive } from '@/utils/CallUtils.ts'

import { Howl } from 'howler'

const newMessage = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
  loop: false,
  volume: 0.8,
  html5: true
})

export default {
  name: 'Main',
  components: {
    InfoBar,
    Chatbar,
    Conversation,
    LoadingConvorsation,
    VoiceVideo,
    NoConversation,
    UserInfo
  },
  data () {
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
      )
    }
  },
  methods: {
    // Imported from library
    isCallActive,
    async fetchMessages (address) {
      this.$store.dispatch('fetchMessages', { address })
    },
    // async subscribeToThreads() {

    //   // Iterate over all friends
    //   // TODO: In the future we may want to do this in a more repsonsible way.
    //   // this.$store.state.friends.forEach(async (friend) => {
    //   //   this.$store.dispatch('subscribeToThread', {friend});
    //   // });
    // },
    // Switch from one media stream to another
    switchTo (voice = false) {
      this.mediaOpen = true
      this.voice = voice
    },
    async makeCall () {
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
          deviceId: 'default'
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      this.$store.dispatch('call', {
        friendAddress: this.$store.state.activeChat,
        stream
      })

      // this.$streamManager.addLocalStream(stream)
      // this.$WebRTC.connectIfNotConnected(this.$store.state.activeChat)
      // this.$WebRTC.call(
      //   this.$store.state.activeChat,
      //   this.$streamManager.localStreams[0]
      // )
      // if (this.$store.state.deafened) {
      //   this.$streamManager.toggleLocalStreams()
      //   this.$streamManager.toggleRemoteStreams()
      // } else if (this.$store.state.muted) {
      //   this.$streamManager.toggleLocalStreams()
      // }
      // this.$store.commit('addActiveCall', this.$store.state.activeChat)
      this.voice = true
      this.mediaOpen = true
      // this.sendMessage(Date.now(), 'call');
    },
    callAnswered () {
      this.voice = true
      this.mediaOpen = true
    },
    hangup () {
      // const id = this.$store.state.incomingCall || this.$store.state.activeCall;
      // this.$WebRTC.hangupCall(this.$store.state.activeChat);
      this.$store.dispatch('hangupCall', {
        friendAddress: this.$store.state.activeChat
      })
    },
    onHangup (identifier) {
      this.$store.commit('removeActiveCall', identifier)
      this.voice = false
      this.mediaOpen = false
    },
    // Enter a voice or video call
    toggleMedia (voice = false) {
      this.voice = voice
      this.mediaOpen = !this.mediaOpen
      if (!this.mediaOpen) {
        this.voice = false
      }
    },
    // Send a message in the chat, this will probably
    // be rewritten when the chat is functional
    async sendMessage (data, type) {
      this.$store.dispatch('sendMessage', { data, type })
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler (direction) {
      if (this.isMobile()) {
        if (direction === 'right') {
          //toggle for mobileSidebar
          if (!localStorage.hasOwnProperty('userSwiped')) {
            this.$store.commit('setMobileSidebar', true)
          } else if (
            localStorage.hasOwnProperty('userSwiped') &&
            localStorage.getItem('userSwiped') === 'true'
          ) {
            //Logic to avoid users going from userInfo all the way to MobileSidebar in one swipe
            localStorage.setItem('userSwiped', false)
          } else {
          if (!localStorage.hasOwnProperty('userlastChat')) {
            localStorage.setItem('userlastChat', "friendChat")
          } 
          localStorage.setItem('userlastChat', "friendChat")
            this.$store.commit('setMobileSidebar', true)
          }
        }
        if (direction === 'left') {
          //toggle for userInfo
          localStorage.setItem('userSwiped', true)
          this.$store.commit('toggleUserInfo')
        }
      }
    }
  },
  mounted () {
    // @deprecated---------------------
    // let lastChat = this.$store.state.activeChat;
    // this.fetchMessages(lastChat);
    // this.$store.subscribe((mutation, state) => {
    //   switch (mutation.type) {
    //     case "addFriend":
    //       this.subscribeToThreads();
    //       break;
    //     case "connectMediaStream":
    //       // Connect to new peer.
    //       if (state.activeMediaStreamPeer) {
    //         this.voice = true;
    //       }
    //       break;
    //     case "activeChat":
    //       if (lastChat !== mutation.payload) {
    //         lastChat = mutation.payload;
    //         this.$store.commit("loadingMessages");
    //         this.fetchMessages(mutation.payload);
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // });
    // this.$store.dispatch("subscribeToAllThreads", {});
    //---------------------

    // @ts-ignore
    const WebRTC = this.$WebRTC
    WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        switch (event) {
          case 'call-stream':
            this.callAnswered()
            break
          case 'call-ended':
            this.onHangup(identifier)
            break
          default:
            break
        }
      },
      ['call-stream', 'call-ended']
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Main.less"></style>
