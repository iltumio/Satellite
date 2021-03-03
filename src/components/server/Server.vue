<template>
  <div class="server server-wrapper">
    <div class="main">
      <LoadingConvorsation />
      <Chatbar :handleNewMessage="() => {}"/>
    </div>
    <div class="right-bar">
      <Info />
    </div>
  </div>
</template>

<script>
import Chatbar from './chatbar/Chatbar';
import LoadingConvorsation from '@/components/main/conversation/conversation/LoadingConvorsation';
import Info from './info/Info';

export default {
  name: 'Server',
  components: {
    Chatbar,
    LoadingConvorsation,
    Info,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .server {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .main {
    width: calc(100% - 16rem);
    height: 100%;
    float: left;
    position: relative;
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
