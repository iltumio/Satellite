<template src="./VoiceVideo.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'

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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./VoiceVideo.less"></style>
