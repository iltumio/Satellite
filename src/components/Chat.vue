<template>
  <!--@contextmenu="openContext"-->
  <div id="wrapper">
    <Context
      v-if="showContext"
      :x="contextCoordsX"
      :y="contextCoordsY"
      :close="closeContext"
    />
    <Error />
    <Database
      v-if="
        $store.state.p2pOnline ||
          $store.state.dwellerAddress !==
            '0x0000000000000000000000000000000000000000'
      "
    />
    <Voice
      v-if="
        $store.state.p2pOnline &&
          $store.state.dwellerAddress !==
            '0x0000000000000000000000000000000000000000'
      "
    />
    <ScreenCapture
      v-if="
        windowBound &&
          $store.state.p2pOnline &&
          $store.state.dwellerAddress !==
            '0x0000000000000000000000000000000000000000'
      "
    />

    <!-- 
      Whenever the account is connected starts a background task that 
      continuously fetches the balance
     -->
    <BalanceFetcher v-if="$store.state.web3connected" />

    <Web3 v-if="!$store.state.web3connected" />
    <Loading
      v-else-if="
        !$store.state.friendsLoaded ||
          !$store.state.p2pOnline ||
          $store.state.dwellerAddress ===
            '0x0000000000000000000000000000000000000000' ||
          !$store.state.dwellerAddress ||
          $store.state.starting
      "
    />
    <div v-else>
      <Achievement v-if="false" achievement="addFriend" />
      <CreateServer v-if="showCreateServer" :close="closeCreateServer" />
      <Calling
        :active="$store.state.incomingCall"
        :callerId="$store.state.incomingCall"
      />
      <!--<Polling />-->

      <div
        :class="
          `columns wrapper ${
            $store.state.sidebarOpen ? '' : 'wrapper-closed'
          } ${settingsOpen ? 'settings-open' : ''}`
        "
      >
        <!--Main Chat-->
        <div
          class="column is-one-third sidebar-wrapper"
          :class="{ show: $store.state.sidebarMobileOpen }"
          v-if="$store.state.sidebarOpen"
        >
          <Sidebar
            :toggleSettings="toggleSettings"
            :toggleCreateServer="toggleCreateServer"
            :servers="servers"
            :loadingServers="loadingServers"
          />
        </div>
        <div class="column chat-wrapper">
          <Main :class="$store.state.mainRoute == 'main' ? 'show' : 'hidden'" />
          <Server v-if="$store.state.mainRoute == 'server'" />
          <Files v-if="$store.state.mainRoute == 'files'" />
          <Friends
            v-if="
              $store.state.mainRoute == 'friends' &&
              $store.state.web3connected &&
              !isMobile()
            "
          />
          <MobileFriends
            v-if="
              $store.state.mainRoute == 'friends' &&
              $store.state.web3connected &&
              isMobile()
            "
          />
        </div>
      </div>
      <div
        :class="`settings ${settingsOpen ? 'settings-open-container' : ''}`"
        v-if="settingsOpen"
      >
        <Settings :toggleSettings="toggleSettings" :open="settingsOpen" />
      </div>
      <div class="footer">
        <p>
          <i
            :class="
              `fas fa-heartbeat ${$store.state.p2pOnline ? 'green' : 'red'}`
            "
          ></i>
          P2P
          <span class="spacer"></span>
          <i class="fas fa-info-circle"></i>
          {{ $store.state.status }}
          <span class="spacer"></span>
          <span v-if="$store.state.accounts">
            <i class="fab fa-ethereum"></i>
            <b>{{ $t('footer.network') }}:</b>
            {{ $store.state.web3Stats.nettype.name.toUpperCase() }}
            <span class="spacer"> </span>
            <i class="fas fa-hashtag"></i>
            <b>{{ $t('footer.block_number') }}:</b>
            {{ $store.state.web3Stats.blockNumber }}
            <span class="spacer"> </span>
            <i class="fas fa-info-circle"></i>
            <b>{{ $t('footer.account') }}:</b> {{ $store.state.accounts[0] }}
          </span>
          <span v-else>
            {{ $t('footer.connecting') }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';
import Voice from '@/components/media/Voice';
import ScreenCapture from '@/components/media/ScreenCapture';
import Sidebar from '@/components/sidebar/sidebar/Sidebar';
import Main from '@/components/main/main/Main';
import Error from '@/components/main/popups/error/Error';
import Files from '@/components/files/files/Files';
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

export default {
  name: 'chat',
  components: {
    Achievement,
    Polling,
    Sidebar,
    Main,
    Error,
    Files,
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
    isMobile() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
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
      if (this.settingsOpen) this.$store.commit('changeRoute', 'main');
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
<style scoped>
.hidden {
  display: none;
}
.show {
  display: block;
}
#wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* min-width: 900px; */
}
.settings {
  position: absolute;
  top: 0;
  z-index: 3;
  right: -100vw;
  left: 100vw;
  bottom: 0;
  background: #e7ebee;
}
.sidebar-wrapper {
  max-width: 320px;
  height: 100%;
}
.chat-wrapper {
  height: 100%;
}
.settings-open-container {
  right: 0;
  left: 0;
  z-index: 99;
}
.fas {
  font-size: 8pt;
}
.wrapper {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 3.8rem;
  margin: 0;
  border-left: 1px solid #e7ebee;
}
.wrapper-closed {
  left: 0;
}
.settings-open {
  left: -100vw;
  right: 100vw;
  max-width: 100vw;
}
.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: calc(100% - 2rem);
  padding: 0.3rem 1.75rem;
  border-top: 1px solid #e7ebee;
  background: #fff;
  font-size: 10pt;
  color: #666;
}
.column {
  margin: 0;
  padding: 0;
}
.spacer {
  width: 15px;
  height: 100%;
  display: inline-block;
}
.fa-moon {
  cursor: pointer;
}
.red {
  color: #e74c3c;
}
.green {
  color: #00d0a1;
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    position: fixed;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s;
    transform: translateX(-100%);
  }

  .sidebar-wrapper.show {
    transform: translateX(0);
  }

  .footer {
    display: none;
  }
}
</style>
