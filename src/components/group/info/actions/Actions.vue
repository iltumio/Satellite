<template>
  <div class="server-actions">
    <span class="label">{{ $t('servers.server-quick-actions') }}</span>
    <div style="clear: both;"></div>
    <CircleIcon icon="fas fa-share-alt" color="#0984e3" />
    <CircleIcon icon="fas fa-file-upload" color="#0984e3" />
    <CircleIcon icon="fas fa-search" color="#0984e3" />
    <CircleIcon icon="fas fa-info" color="#0984e3" />
  </div>
</template>

<script>
import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'Actions',
  components: {
    CircleIcon
  }
}
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
