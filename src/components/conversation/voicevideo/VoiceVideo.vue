<template src="./VoiceVideo.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'
import MobileUtils from '@/utils/Mobile.ts'

const muteAudio = new Audio(`${config.ipfs.browser}${config.sounds.mute}`)

const unmuteAudio = new Audio(`${config.ipfs.browser}${config.sounds.unmute}`)

const deafenAudio = new Audio(`${config.ipfs.browser}${config.sounds.deafen}`)
const unDeafenAudio = new Audio(
  `${config.ipfs.browser}${config.sounds.undeafen}`
)

export default {
  name: 'VoiceVideo',
  props: ['mediaOpen', 'voice', 'disconnect', 'switchTo'],
  components: {
    CircleIcon
  },
  data () {
    return {
      config
    }
  },
  methods: {
    isMobile: MobileUtils.isMobile,
    /** @method
     * Mute the active stream
     * @name copied
     */
    toggleMute () {
      const muted = this.$store.state.muted
      if (!muted) muteAudio.play()
      if (muted) unmuteAudio.play()
      this.$store.commit('muted', !muted)
      this.$streamManager.toggleLocalStreams(muted)
    },
    /** @method
     * Mute the active stream &
     * mute remote audio
     * @name toggleDeafen
     */
    toggleDeafen () {
      const deafened = !this.$store.state.deafened
      if (deafened) deafenAudio.play()
      if (!deafened) unDeafenAudio.play()
      this.$store.commit('deafened', deafened)
      this.$streamManager.toggleLocalStreams(this.$store.state.muted || deafened)
      this.$streamManager.toggleRemoteStreams(deafened)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
