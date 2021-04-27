<template>
  <div class="bordered group" v-touch:swipe="swipeHandler" v-touch-options="{swipeTolerance: 75}">
    <div :class="`${($store.state.showGroupInfo) ? 'main-user-info main-user-info-open' : 'main-user-info'}`">
      <InfoBar />
      <LoadingConvorsation />
      <Chatbar :handleNewMessage="() => {}" />
    </div>

    <div v-if="this.$store.state.showGroupInfo"  :class="`${this.$store.state.showGroupInfo ? 'right-bar close-btn ' : 'right-bar right-bar-close'}`">
      <Info />
    </div>
  </div>
</template>

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
<style scoped lang="less">
.group {
  padding-top: 0;
  background: #f8f9fb;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.bordered {
  border-left: 1px solid #e7ebee;
}

.main-user-info {
  width: 100%;
  height: 100%;
  float: left;
  position: relative;
  background: #101016 !important;
}
.main-user-info-open {
  width: calc(100% - 16rem);
}

.main {
  width: calc(100% - 16rem);
  height: 100%;
  float: left;
  position: relative;
  background: #101016 !important;
}
.divider {
  width: 100%;
}
.right-bar {
  width: 16rem;
  height: 100%;
  float: right;
  padding: 1rem;
}
  
@media (max-width: 768px) {
  .main {
    width: 100vw;
    height: 100%;
    float: left;
    position: relative;
    background: #101016 !important;
  }

  .main-user-info {
    width: 100%;
    height: 100%;
    float: left;
    position: relative;
    background: #101016 !important;
}

.main-user-info-open {
  width: 100vw;
}

.right-bar {
  width: 100vw;
  height: 100%;
  float: right;
  padding: 1rem;
  }

.right-bar-close {
  position: absolute;
  }
}
</style>
