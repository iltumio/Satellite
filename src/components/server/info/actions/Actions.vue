<template>
  <div class="server-actions">
    <span class="label">Quick Actions</span>
    <div style="clear: both;"></div>
    <CircleIcon icon="fas fa-share-alt" color="#6183bb"/>
    <CircleIcon icon="fas fa-file-upload" color="#6183bb" />
    <CircleIcon icon="fas fa-search" color="#6183bb" />
    <CircleIcon icon="fas fa-info" color="#6183bb" />
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'Actions',
  components: {
    CircleIcon,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .circle-icon {
    cursor: pointer;
    float: left;
    font-size: 11pt;
    padding: 0;
    width: 40px;
    height: 40px;
    margin: 0.5rem;
  }
</style>
