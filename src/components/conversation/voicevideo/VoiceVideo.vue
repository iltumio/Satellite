<template src="./VoiceVideo.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'
import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'VoiceVideo',
  props: ['mediaOpen', 'voice', 'disconnect', 'switchTo'],
  components: {
    CircleIcon
  },
  data () {
    return {
      config,
      localStream: null,
      remoteStream: null,
      localVideo: this.$store.state.localVideo,
      remoteVideo: this.$store.state.remoteVideo,
      screenSharing: false,
    }
  },
  mounted () {
    console.log('VoiceVideo.vue : mounted()')
    this.updateStreams()
    
    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      console.log('Event: ', event)
      this.updateStreams()
    }, ['call-stream', 'call-ended', 'incoming-call', 'outgoing-call'])

    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      console.log('Event: ', event)
      this.$WebRTC.streamUpdate(this.$store.state.activeChat, this.localVideo)
      // this.remoteStream = data[0]
    }, ['call-stream'])

    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      console.log('Event: ', event)
      this.remoteVideo = data
    }, ['stream-update'])

    this.$WebRTC.subscribe(() => {
      this.$store.commit('incomingCall', false)
    }, ['call-ended'])

    this.$WebRTC.streamUpdate(this.$store.state.activeChat, this.localVideo)
  },
  methods: {
    isMobile: MobileUtils.isMobile,
    /** @method
     * Mute the active stream
     * @name copied
     */
    toggleMute () {
      const muted = this.$store.state.muted
      if (!muted) this.$sound.sounds.mute.play()
      if (muted) this.$sound.sounds.unmute.play()
      this.$store.commit('muted', !muted)
      this.$streamManager.toggleLocalStreams(muted, this.localVideo)
    },

    /** @method
     * Mute the active stream &
     * mute remote audio
     * @name toggleDeafen
     */
    toggleDeafen () {
      const deafened = !this.$store.state.deafened
      if (deafened) this.$sound.sounds.deafen.play()
      if (!deafened) this.$sound.sounds.undeafen.play()
      this.$store.commit('deafened', deafened)
      this.$streamManager.toggleLocalStreams(
        this.$store.state.muted || deafened,
        this.localVideo
      )
      this.$streamManager.toggleRemoteStreams(deafened, this.remoteVideo)
    },

    /** @method
     * Toggle personal video stream
     * @name toggleLocalVideo
     */
    async toggleLocalVideo () {
      console.log('VoiceVideo.vue : toggleLocalVideo()')

      const localVideo = !this.$store.state.localVideo
      this.localVideo = localVideo
      this.$store.commit('localVideo', localVideo)
      
      localVideo ? this.$sound.sounds.unmute.play() : this.$sound.sounds.mute.play()

      this.$streamManager.toggleLocalVideo(localVideo)
      this.$WebRTC.streamUpdate(this.$store.state.activeChat, localVideo)
    },

    async toggleScreenSharing () {
      this.screenSharing = !this.screenSharing
      let displayMediaOptions = {
        video: { cursor: "always" },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      }
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      this.localStream = stream;
      this.$streamManager.addLocalStream(stream)
      this.$WebRTC.addStream(stream)
    },

    /** @method
     * Update local and remote streams in data
     * @name updateStreams
     */
    updateStreams () {
      console.log('VoiceVideo.vue : updateStreams()')
      for (let key in this.$streamManager.localStreams) {
        let stream = this.$streamManager.localStreams[key]
        this.localStream = stream
      }
      for (let key in this.$streamManager.remoteStreams) {
        let stream = this.$streamManager.remoteStreams[key]
        this.remoteStream = stream
      }
    },

    /** @method
     * Kills all streams throigh stream manager
     * @name updateStreams
     */
    killAllStreams () {
      this.$streamManager.killAllStreams()
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
