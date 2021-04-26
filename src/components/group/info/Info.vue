<template src="./Info.html"></template>

<script>
import Actions from './actions/Actions'
import Users from './users/Users'
import Files from './files/Files'
import MobileUtils from '@/utils/Mobile.ts'


export default {
  name: 'Info',
  components: {
    Actions,
    Users,
    Files
  },
    methods: {
    isMobile: MobileUtils.isMobile,

    toggleGroupInfo () {
      this.$store.commit('toggleGroupInfo');
    },
    swipeHandler (direction) {
      if (this.isMobile()) {
         if (direction === 'right') {
          this.$store.commit('toggleGroupInfo');
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Info.less"></style>
