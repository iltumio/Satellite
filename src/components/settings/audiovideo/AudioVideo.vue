<template src="./AudioVideo.html"></template>

<script>
import ToggleSwitch from '@/components/common/ToggleSwitch'

export default {
  name: 'AudioVideo',
  components: {
    ToggleSwitch
  },
  data () {
    return {
      love: 0, // shh, its secret
      devices: false,
      audioQuality: 320,
      audioDevices: [],
      videoDevices: [],
      echoCancellation: false,
      noiseSuppression: false
    }
  },
  async mounted () {
    const devices = await navigator.mediaDevices.enumerateDevices({
      audio: true,
      video: true
    })
    this.audioQuality = this.$store.state.audioQuality
    this.devices = devices
    devices.forEach(device => {
      if (device.kind === 'videoinput') this.videoDevices.push(device)
      if (device.kind === 'audioinput') this.audioDevices.push(device)
    })
    if (!this.$store.state.selectedVideoDevice) {
      this.$store.commit(
        'setVideoDevice',
        this.videoDevices[0].label || 'Default Webcam'
      )
    }
    if (!this.$store.state.selectedAudioDevice) {
      this.$store.commit(
        'setAudioDevice',
        this.audioDevices[0].label || 'Default Microphone'
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./AudioVideo.less"></style>
