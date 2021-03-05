<template src="./ServerList.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon';

export default {
  name: 'ServerList',
  props: ['toggleCreateServer', 'servers', 'loadingServers'],
  components: {
    CircleIcon,
  },
  methods: {
    openServer(server) {
      this.$store.commit('activeServer', server);
      this.$store.commit('changeRoute', 'server');
    },
    goHome() {
      this.$store.commit('changeRoute', 'main');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ServerList.less"></style>
