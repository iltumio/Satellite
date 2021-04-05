<template src="./Group.html"></template>

<script>
import Channel from '../channel/Channel'

export default {
  name: 'Group',
  props: ['group', 'channels', 'setActiveChannel'],
  components: {
    Channel
  },
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>
