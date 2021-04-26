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
      localVideo: this.$store.state.localVideo,
      remoteVideo: true,
      localStream: null,
      remoteStream: null
    }
  },
  mounted () {
    this.updateStreams()
    this.$streamManager.toggleLocalVideo(this.localVideo)

    this.$WebRTC.subscribe((event, identifier, { type, data }) => {
      console.log('Web RTC event: ', event)
      this.updateStreams()
    }, ['call-stream', 'call-ended', 'incoming-call', 'outgoing-call'])

    this.$WebRTC.subscribe(() => {
      console.log('REMOTE EVENT')
      
    }, ['stream-change'])

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
    toggleLocalVideo () {
      this.$WebRTC.streamChange()
      const localVideo = !this.$store.state.localVideo
      this.localVideo = localVideo
      if (!localVideo) this.$sound.sounds.mute.play()
      if (localVideo) this.$sound.sounds.unmute.play()
      this.$store.commit('localVideo', localVideo)
      this.$streamManager.toggleLocalVideo(localVideo)
    },
    /** @method
     * Update local and remote streams in data
     * @name toggleLocalVideo
     */
    updateStreams () {
      for (let key in this.$streamManager.localStreams) {
        let stream = this.$streamManager.localStreams[key]
        this.localStream = stream
        // console.log(stream)
      }
      for (let key in this.$streamManager.remoteStreams) {
        let stream = this.$streamManager.remoteStreams[key]
        this.remoteStream = stream
        // console.log(stream)
        // for (let track of stream.getTracks()) { console.log(track) }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
