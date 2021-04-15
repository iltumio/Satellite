<template>
  <div class="group group-wrapper">
    <div class="main">
      <InfoBar />
      <LoadingConvorsation />
      <Chatbar :handleNewMessage="() => {}" />
    </div>
    <div class="right-bar">
      <Info />
    </div>
  </div>
</template>

<script>
import InfoBar from './infobar/InfoBar'
import Chatbar from './chatbar/Chatbar'
import LoadingConvorsation from '@/components/conversation/conversation/LoadingConvorsation'
import Info from './info/Info'

export default {
  name: 'Group',
  components: {
    Chatbar,
    LoadingConvorsation,
    Info,
    InfoBar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.group {
  width: 100%;
  height: 100%;
  position: relative;
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
</style>
