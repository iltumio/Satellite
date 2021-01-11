<template src="./ServerList.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon';
import Vault74Registry from '@/utils/Vault74Registry.ts';
import DwellerContract from '@/utils/DwellerContract.ts';
import ServerContract from '../../utils/ServerContract.ts';

export default {
  name: 'ServerList',
  props: ['toggleCreateServer'],
  components: {
    CircleIcon,
  },
  data() {
    return {
      servers: [],
    };
  },
  mounted() {
    this.updateServers();
  },
  methods: {
    async updateServers() {
      const dwellerContract = await Vault74Registry.getDwellerContract(this.$store.state.activeAccount);
      const serverAddresses = await DwellerContract.getServers(dwellerContract, this.$store.state.activeAccount);
      const fetchServers = [];

      serverAddresses.forEach(async (s) => {
        fetchServers.push(ServerContract.get(s, this.$store.state.activeAccount));
      });

      const servers = await Promise.all(fetchServers);

      this.servers = servers;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ServerList.less"></style>
