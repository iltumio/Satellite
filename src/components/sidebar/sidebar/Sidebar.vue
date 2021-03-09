<template src="./Sidebar.html"></template>

<script>
// import config from '@/config/config';
import ServerList from '@/components/serverlist/ServerList';
import QuickFriends from '@/components/sidebar/quickfriends/QuickFriends';
import User from '@/components/sidebar/user/User';
import Controls from '@/components/sidebar/controls/Controls';
// import Registry from '@/classes/contracts/Registry.ts';
// import DwellerContract from '@/classes/contracts/DwellerContract.ts';
// import ServerContract from '@/classes/contracts/ServerContract.ts';
// Servers
import ServerSidebar from '@/components/server/sidebar/Sidebar';

export default {
  name: 'Sidebar',
  props: ['toggleSettings', 'toggleCreateServer', 'loadingServers', 'servers'],
  components: {
    ServerList,
    User,
    Controls,
    QuickFriends,
    ServerSidebar,
  },
  data() {
    return {
      route: 'chats',
      showQuickFriends: false,
    };
  },
  mounted() {
    // this.updateServers();
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
