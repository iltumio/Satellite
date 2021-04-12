<template src="./Group.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Group',
  components: {
    CircleIcon
  },
  data () {
    return {
      hovered: false,
      user: false,
      name: '',
      icon: ''
    }
  },
  props: ['group', 'unread', 'active'],
  methods: {
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>
