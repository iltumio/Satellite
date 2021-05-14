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
      activeCall: false
    }
  },
  mounted () {
    this.updateStreams()
    this.$streamManager.toggleLocalStreams(
      this.$store.state.muted,
      this.localVideo
    )
    this.$streamManager.toggleRemoteStreams(
      this.$store.state.deafened,
      this.remoteVideo
    )

    this.$WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        this.updateStreams()
      },
      ['call-stream', 'call-ended', 'incoming-call', 'outgoing-call']
    )

    this.$WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        this.$WebRTC.streamUpdate(this.$store.state.activeChat, this.localVideo)
        this.remoteStream = data[0]
        this.activeCall = true
      },
      ['call-stream']
    )

    this.$WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        this.remoteVideo = data
      },
      ['stream-update']
    )

    this.$WebRTC.subscribe(() => {
      this.$store.commit('incomingCall', false)
      this.activeCall = false
    }, ['call-ended'])

    this.$WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        if (this.activeCall) {
          // let friend = this.$store.state.friends.find(
          //   f => f.address === this.$store.state.incomingCall
          // )
          this.$store.commit('incomingCall', false)
          // this.$WebRTC.answerCall(friend.address, this.localStream);
          // this.$store.dispatch('answerCall', { friend, stream: this.localStream })
        }
      },
      ['incoming-call']
    )

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
      const localVideo = !this.$store.state.localVideo
      this.localVideo = localVideo
      this.$store.commit('localVideo', localVideo)

      localVideo
        ? this.$sound.sounds.unmute.play()
        : this.$sound.sounds.mute.play()

      this.$streamManager.toggleLocalVideo(localVideo)
      this.$WebRTC.streamUpdate(this.$store.state.activeChat, localVideo)
    },

    async toggleScreenSharing () {
      this.screenSharing = !this.screenSharing
      let displayMediaOptions = {
        video: { cursor: 'always' },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      }
      const stream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      )
      // let newTrack = stream.getVideoTracks()[0]
      // let localTrack = this.localStream.getVideoTracks()[0]
      // this.$WebRTC.removeStream(this.$store.state.activeChat, this.localStream)
      // this.$WebRTC.addStream(this.$store.state.activeChat, stream)
      // this.$WebRTC.replaceTrack(this.$store.state.activeChat, localTrack, newTrack, stream)
      // this.localStream = stream;
      // this.$streamManager.addLocalStream(stream)
      // this.$WebRTC.addStream(stream)
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
