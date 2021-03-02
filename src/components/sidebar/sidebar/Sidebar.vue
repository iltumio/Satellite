<template src="./Sidebar.html"></template>

<script>
import ServerList from '@/components/serverlist/ServerList';
import QuickFriends from '@/components/sidebar/quickfriends/QuickFriends';
import User from '@/components/sidebar/user/User';
import Controls from '@/components/sidebar/controls/Controls';
import Vault74Registry from '@/classes/contracts/Vault74Registry.ts';
import DwellerContract from '@/classes/contracts/DwellerContract.ts';
import ServerContract from '@/classes/contracts/ServerContract.ts';
import config from '@/config/config';

export default {
  name: 'Sidebar',
  props: ['toggleSettings', 'toggleCreateServer'],
  components: {
    ServerList,
    User,
    Controls,
    QuickFriends,
  },
  data() {
    return {
      route: 'chats',
      showQuickFriends: false,
      servers: [],
      loadingServers: false,
    };
  },
  mounted() {
    this.updateServers();
  },
  methods: {
    onClickClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false);
        }, 0);
      });
    },
    activeRequestCount(requests) {
      const activeRequests = requests.filter(fr => fr.active);
      return activeRequests.length;
    },
    getFriend(friends, address) {
      return friends.filter(f => f.address === address)[0];
    },
    async updateServers() {
      this.loadingServers = true;
      const registry = new Vault74Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContractAddress = await registry.getDwellerContract(this.$store.state.activeAccount);
      const dwellerContract = new DwellerContract(this.$ethereum, dwellerContractAddress);
      const serverAddresses = await dwellerContract.getServers(this.$store.state.activeAccount);


      const fetchServers = serverAddresses.map((serverAddress) => {
        const serverContract = new ServerContract(this.$ethereum, serverAddress);
        return serverContract.get(serverAddress);
      });
      const servers = await Promise.all(fetchServers);

      this.servers = servers;
      this.loadingServers = false;
    },
    isUnread(address) {
      return this.$store.state.unreads.includes(address);
    },
    toggleQuickFriends() {
      this.showQuickFriends = !this.showQuickFriends;
    },
    setRoute(route) {
      this.route = route;
    },
    setMainRoute(route) {
      this.$store.commit('changeRoute', route);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Sidebar.less"></style>
