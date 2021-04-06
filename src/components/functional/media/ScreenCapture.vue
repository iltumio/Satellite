<template></template>

<script>
export default {
  name: 'ScreenCapture',
  data () {
    return {}
  },
  methods: {
    // Sends messages to remote peer and the message broker.
    async sendMessage (data, type) {
      this.$store.dispatch('sendMessage', { data, type })
    },
    async startCapture (displayMediaOptions) {
      let captureStream = null
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(
          displayMediaOptions
        )
      } catch (err) {
        console.error(`Error: ${err}`)
      }
      return captureStream
    },
    getContext () {
      return {
        video: {
          cursor: this.$store.state.captureStream
        },
        audio: {
          echoCancellation: this.$store.state.echoCancellation,
          latency: 0,
          noiseSuppression: this.$store.state.noiseSuppression,
          sampleRate: this.$store.state.audioQuality * 1000,
          sampleSize: this.$store.state.audioSamples,
          volume: 1.0
        }
      }
    }
  },
  mounted () {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'screenShareRequest') {
        this.startCapture(this.getContext())
      }
    })
  }
}
</script>
