<template src="./Group.html"></template>

<script>
import InfoBar from './infobar/InfoBar'
import Chatbar from './chatbar/Chatbar'
import LoadingConvorsation from '@/components/conversation/conversation/LoadingConvorsation'
import Info from './info/Info'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Group',
  components: {
    Chatbar,
    LoadingConvorsation,
    Info,
    InfoBar
  },
  methods: {
    isMobile: MobileUtils.isMobile,

    swipeHandler (direction) {
      if (this.isMobile()) {  
        if (direction === 'right') {
          //toggle for mobileSidebar
          if (!localStorage.hasOwnProperty('groupInfoSwiped')) {
            this.$store.commit('setMobileSidebar', true)
          } else if (
            localStorage.hasOwnProperty('groupInfoSwiped') &&
            localStorage.getItem('groupInfoSwiped') === 'true'
          ) {
            //Logic to avoid users going from groupInfo all the way to MobileSidebar in one swipe
            localStorage.setItem('groupInfoSwiped', false)
          } else {
          if (!localStorage.hasOwnProperty('userlastChat')) {
            localStorage.setItem('userlastChat', "groupChat")
          } 
            localStorage.setItem('userlastChat', "groupChat")
            this.$store.commit('setMobileSidebar', true)
          }
        }
        if (direction === 'left') {
          //toggle for groupInfo
          localStorage.setItem('groupInfoSwiped', true)
          this.$store.commit('toggleGroupInfo');
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>