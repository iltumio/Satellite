<template src="./TopNav.html"></template>

<script>
import Package from '../../../../package.json'

export default {
  name: 'TopNav',
  props: ['backAction', 'title', 'toggleSettings', 'leftText'],
  data () {
    return {
      updateNeeded: false,
      updating: false,
      updateInterval: false,
    }
  },
  methods: {
    checkUpdate () {
      fetch(
        'https://raw.githubusercontent.com/Satellite-im/Satellite/master/package.json',
        {
          cache: 'no-cache'
        }
      )
        .then(response => response.json())
        .then(data => {
          const localVersion = Package.version
          const remoteVersion = data.version
          if (localVersion !== remoteVersion) {
            this.updateNeeded = true
          }
        })
    },
    doUpdate () {
      this.updating = true
      setTimeout(() => {
        window.location.reload(true)
      }, 2000)
    }
  },
  mounted () {
    this.checkUpdate()
    this.updateInterval = setInterval(() => {
      this.checkUpdate()
    }, 15000)
  },
  beforeUnmount() {
    clearInterval(this.updateInterval)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./TopNav.less"></style>
