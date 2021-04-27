<template src="./InfoBar.html"></template>

<script>
import DwellerID from '@/components/common/dwellerid/DwellerID'
import CircleIcon from '@/components/common/CircleIcon'

import { toggleFingerprint, requestScreenShare } from './methods.ts'

export default {
  name: 'InfoBar',
  props: ['toggleMedia', 'makeCall'],
  components: {
    DwellerID,
    CircleIcon
  },
  data () {
    return {
      idActive: false
    }
  },
  methods: {
    toggleFingerprint,
    requestScreenShare
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./InfoBar.less"></style>
