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
    openGroup () {
      console.log('opening group', this.group)
      this.$store.commit('activeGroup', this.group)
      this.$store.commit('changeRoute', 'group')
      this.$store.commit('setMobileSidebar', false)
    },
    isMobile: MobileUtils.isMobile
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>
