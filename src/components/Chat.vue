<template src="./Chat.html"></template>

<script>
import Mousetrap from 'mousetrap';
import Voice from '@/components/media/Voice';
import ScreenCapture from '@/components/media/ScreenCapture';
import Sidebar from '@/components/sidebar/sidebar/Sidebar';
import Main from '@/components/main/main/Main';
import Error from '@/components/main/popups/error/Error';
import Wallet from '@/components/wallet/Wallet';
import Files from '@/components/files/files/Files';
import FilesMobile from '@/components/files/files/FilesMobile';
import Friends from '@/components/friends/friends/Friends';
import MobileFriends from '@/components/friends/mobilefriends/MobileFriends';
import Settings from '@/components/main/settings/Settings';
import Web3 from '@/components/functional/web3/Web3';
import BalanceFetcher from '@/components/functional/web3/BalanceFetcher';
import Database from '@/components/functional/database/Database';
import Loading from '@/components/common/Loading';
import Achievement from '@/components/common/Achievement';
import Calling from '@/components/main/popups/calling/Calling';
import CreateServer from '@/components/servers/create/CreateServer';
import Context from '@/components/common/context/Context';
import Polling from '@/components/functional/Polling';
import Server from '@/components/server/Server';

import IPFS from 'ipfs-core';

import config from '@/config/config';
import Registry from '@/classes/contracts/Registry.ts';
import DwellerContract from '@/classes/contracts/DwellerContract.ts';
import ServerContract from '@/classes/contracts/ServerContract.ts';

import MobileUtils from '@/utils/Mobile.ts';

export default {
  name: 'chat',
  components: {
    Achievement,
    Polling,
    Sidebar,
    Main,
    Error,
    Wallet,
    Files,
    FilesMobile,
    Friends,
    MobileFriends,
    Settings,
    Web3,
    BalanceFetcher,
    Database,
    Loading,
    Voice,
    ScreenCapture,
    Calling,
    CreateServer,
    Context,
    Server
  },
  data() {
    return {
      msg: 'Chat',
      showCreateServer: false,
      windowBound: false,
      settingsOpen: false,
      network: '',
      account: 0x0,
      blockNumber: 0,
      showContext: false,
      contextCoordsX: 0,
      contextCoordsY: 0,
      loadingServers: false,
      servers: []
    };
  },
  computed: {
    mainRoute() {
      return this.$store.state.mainRoute;
    }
  },
  watch: {
    mainRoute() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false);
        }, 0);
      });
    }
  },
  methods: {
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile,
    checkMobile() {
      const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (width <= 768) {
        this.$store.commit('setSidebar', true);
      }
    },
    openContext(event) {
      event.preventDefault();
      this.contextCoordsX = event.clientX;
      this.contextCoordsY = event.clientY;
      this.showContext = true;
    },
    closeContext() {
      this.showContext = false;
    },
    closeCreateServer() {
      this.showCreateServer = false;
      this.updateServers();
    },
    toggleCreateServer() {
      this.showCreateServer = !this.showCreateServer;
    },
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
      if (this.settingsOpen) {
        this.$store.commit('changeRoute', 'main');
        this.$store.commit('setMobileSidebar', false);
      }

      else{
       this.$store.commit('setMobileSidebar', true);
      }


    },
    async updateServers() {
      this.loadingServers = true;
      const registry = new Registry(
        this.$ethereum,
        config.registry[config.network.chain]
      );
      const dwellerContractAddress = await registry.getDwellerContract(
        this.$store.state.activeAccount
      );
      const dwellerContract = new DwellerContract(
        this.$ethereum,
        dwellerContractAddress
      );
      const serverAddresses = await dwellerContract.getServers(
        this.$store.state.activeAccount
      );

      const fetchServers = serverAddresses.map(serverAddress => {
        const serverContract = new ServerContract(
          this.$ethereum,
          serverAddress
        );
        return serverContract.get(serverAddress);
      });
      const servers = await Promise.all(fetchServers);

      this.servers = servers;
      this.loadingServers = false;
    }
  },
  async mounted() {
    Mousetrap.bind('option+s', () => {
      this.settingsOpen = !this.settingsOpen;
    });
    Mousetrap.bind('esc', () => {
      this.settingsOpen = false;
      this.$store.commit('changeRoute', 'main');
    });
    const ipfs = await IPFS.create();
    window.ipfs = ipfs;
    const checkPeer = () => {
      if (this.$WebRTC.connection) {
        this.windowBound = true;
      } else {
        setTimeout(() => {
          checkPeer();
        }, 500);
      }
    };
    checkPeer();
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile, true);

    this.updateServers();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Chat.less"></style>
