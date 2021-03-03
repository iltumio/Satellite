<template>
  <div class="server-actions">
    <span class="label">Files</span>
    <div style="clear: both;"></div>
    <File />
  </div>
</template>

<script>
import File from './File';

export default {
  name: 'Files',
  components: {
    File,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
