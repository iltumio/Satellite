<template src="./CircleIcon.html"></template>

<script>
import Jazzicon from 'vue-jazzicon'

import config from '@/config/config'

export default {
  name: 'CircleIcon',
  components: {
    [Jazzicon.name]: Jazzicon
  },
  props: [
    'image',
    'color',
    'verified',
    'icon',
    'diameter',
    'bordered',
    'address',
    'action'
  ],
  methods: {
    actionHandler () {
      if (this.action) this.action()
    },
    isVerified (address) {
      return config.verified_addresses.includes(address)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./CircleIcon.less"></style>
