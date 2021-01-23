<template src="./Sidebar.html"></template>

<script>
import ServerList from '@/components/serverlist/ServerList';
import QuickFriends from '@/components/sidebar/quickfriends/QuickFriends';
import User from '@/components/sidebar/user/User';
import Controls from '@/components/sidebar/controls/Controls';
import Vault74Registry from '@/utils/contracts/Vault74Registry.ts';
import DwellerContract from '@/utils/contracts/DwellerContract.ts';
import ServerContract from '@/utils/contracts/ServerContract.ts';

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
    getFriend(friends, address) {
      return friends.filter(f => f.address === address)[0];
    },
    async updateServers() {
      this.loadingServers = true;
      const dwellerContract = await Vault74Registry.getDwellerContract(this.$store.state.activeAccount);
      const serverAddresses = await DwellerContract.getServers(dwellerContract, this.$store.state.activeAccount);
      const fetchServers = [];

      serverAddresses.forEach(async (s) => {
        fetchServers.push(ServerContract.get(s, this.$store.state.activeAccount));
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
