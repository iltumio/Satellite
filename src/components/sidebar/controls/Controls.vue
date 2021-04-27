<template src="./Controls.html"></template>

<script>
import Mousetrap from 'mousetrap'
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'
import StatusIndicator from '@/components/common/StatusIndicator'

export default {
  name: 'Controls',
  props: ['toggleSettings'],
  components: {
    CircleIcon,
    StatusIndicator
  },
  data () {
    return {
      tooltip: 'Copy Account',
      config,
      inCall: 'offline',
      usingMic: 'offline',
      usingCam: 'offline'
    }
  },
  methods: {
    /** @method
     * parse the stored nettype to readable string
     * @name getNetwork
     */
    getNetwork () {
      return config.network.chainName || 'Unknown'
    },
    /** @method
     * Jump to the active media stream location
     * @name jumpTo
     */
    jumpTo () {
      this.$store.commit('changeRoute', 'main')
      // this.$store.commit('activeChat', this.$store.state.activeMediaStreamPeer)
      this.$store.dispatch('setActiveChat', {
        friendAddress: this.$store.state.activeMediaStreamPeer
      })
    },
    /** @method
     * Set tooltip text to represent the fact
     * that we copied the addreass of the client
     * @name copied
     */
    copied () {
      const original = this.tooltip
      this.tooltip = 'Copied!'
      setTimeout(() => {
        this.tooltip = original
      }, 1000)
    },
    /** @method
     * Mute the active stream
     * @name copied
     */
    toggleMute () {
       // TODO: this is identical to the method in VoiceVideo break this out into a universal method
      const muted = !this.$store.state.muted
      if (muted) this.$sound.sounds.mute.play()
      if (!muted) this.$sound.sounds.unmute.play()
      this.$store.commit('muted', muted)
      this.$streamManager.toggleAllLocalStreams(muted, muted)
    },
    /** @method
     * Mute the active stream &
     * mute remote audio
     * @name toggleDeafen
     */
    toggleDeafen () {
      // TODO: this is identical to the method in VoiceVideo break this out into a universal method
      const deafened = !this.$store.state.deafened
      if (deafened) this.$sound.sounds.deafen.play()
      if (!deafened) this.$sound.sounds.undeafen.play()
      this.$store.commit('deafened', deafened)
      this.$streamManager.toggleAllLocalStreams(
        this.$store.state.muted || deafened,
        this.$store.state.muted || deafened
      )
      this.$streamManager.toggleRemoteStreams(deafened)
    }
  },
  mounted () {
    Mousetrap.bind('option+m', this.toggleMute)
    Mousetrap.bind('option+d', this.toggleDeafen)

    // @ts-ignore
    const WebRTC = this.$WebRTC
    WebRTC.subscribe(
      (event, identifier, { type, data }) => {
        switch (event) {
          case 'call-stream':
            this.inCall = 'online'
            this.usingMic = 'online'
            break
          case 'call-ended':
            this.inCall = 'offline'
            this.usingMic = 'offline'
            break
          case 'incoming-call':
            this.inCall = 'pending'
            break
          case 'outgoing-call':
            this.inCall = 'pending'
            this.usingMic = 'online'
            break
          default:
            break
        }
      },
      ['call-stream', 'call-ended', 'incoming-call', 'outgoing-call']
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Controls.less"></style>
