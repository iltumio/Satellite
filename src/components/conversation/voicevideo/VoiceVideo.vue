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
      localVideo: true, // this.$store.state.localVideo
      screenSharing: false,
      remoteVideo: true,
      localStream: null,
      remoteStream: null,
    }
  },
  mounted () {
    this.updateStreams()
    this.$streamManager.toggleLocalVideo(this.localVideo)
    

    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      // console.log('Web RTC event: ', event)
      // this.updateStreams()
    }, ['call-stream', 'call-ended', 'incoming-call', 'outgoing-call'])

    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      console.log('EVENT: call-stream')
      console.log(data)
      this.remoteStream = data[0]
    }, ['call-stream'])

    this.$WebRTC.subscribe(() => {
      this.$store.commit('incomingCall', false)
    }, ['call-ended'])
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
      this.$streamManager.killStreamsByType('local')

      const localVideo = !this.$store.state.localVideo
      this.localVideo = localVideo
      if (!localVideo) this.$sound.sounds.mute.play()
      if (localVideo) this.$sound.sounds.unmute.play()
      this.$store.commit('localVideo', localVideo)

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
      if (this.$store.state.localVideo) { 
        constraints.video = { facingMode: { ideal: "user" } } 
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.localStream = stream;
      // this.$streamManager.addLocalStream(stream)
      this.updateStream(stream)
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
      // this.$streamManager.addLocalStream(stream)
      this.updateStream(stream)
    },
    /** @method
     * Updates streams accross the Peer connection
     * @name updateStreams
     */
    async updateStream (stream) {
      this.$store.dispatch('updateStream', {
        friendAddress: this.$store.state.activeChat,
        stream
      })
      // this.updateStreams()
    },
    /** @method
     * Update local and remote streams in data
     * @name updateStreams
     */
    updateStreams () {
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
    checkStreams () {
      console.log('---------- checking ----------')
      for (let key in this.$streamManager.localStreams) {
        let stream = this.$streamManager.localStreams[key]
        this.localStream = stream
        for (let track of stream.getTracks()) { console.log('local: ', track.kind, track.enabled) }
        // console.log(stream)
      }
      for (let key in this.$streamManager.remoteStreams) {
        let stream = this.$streamManager.remoteStreams[key]
        this.remoteStream = stream
        for (let track of stream.getTracks()) { console.log('remote: ', track.kind, track.enabled) }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
