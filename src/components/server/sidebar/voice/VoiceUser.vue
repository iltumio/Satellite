<template>
  <div class="voice-user">
    <CircleIcon :address="user.address" :diameter="25" /> <span class="voice-user-name">{{user.name}}</span>
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'VoiceUser',
  props: ['user'],
  components: {
    CircleIcon,
  },
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .voice-user {
    margin-left: 1rem;
    padding: 0.25rem;
  }
  .circle-icon {
    width: 20px;
    height: 20px;
    float: left;
  }
  .voice-user-name {
    padding-left: 5px;
    font-size: 11pt;
  }
</style>
