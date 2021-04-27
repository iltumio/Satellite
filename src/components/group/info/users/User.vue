<template>
  <div class="server-info-user">
    <CircleIcon :address="user.address" :diameter="25" />
    <span class="server-info-user">
      {{ user.name }}
    </span>
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'User',
  props: [
    'user',
  ],
  components: {
    CircleIcon,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .server-info-user {
    padding: 0.25rem;
  }
  .circle-icon {
    width: 20px;
    height: 20px;
    float: left;
  }
  .server-info-user-name {
    font-size: 11pt;
  }
</style>
