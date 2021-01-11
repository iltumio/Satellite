<template>
  <div id="app" :class="this.$store.state.theme">
    <div class="notification is-warning" v-if="showWarning">
      <button class="delete" v-on:click="hideWarning"></button>
      <span v-html="$t('alpha_release.warning')"></span>
    </div>
    <main id="main" class="theme" v-if="decrypted">
      <transition appear mode="out-in" name="slide-fade">
        <router-view></router-view>
      </transition>
    </main>
    <Unlock class="theme" v-else :decrypted="decrypt"/>
  </div>
</template>

<script>
import 'bulma/css/bulma.css';
import config from '@/config/config';
import Peer2Peer from '@/classes/Peer2Peer';
import MessageBroker from '@/classes/MessageBroker.ts';
import Unlock from '@/components/unlock/Unlock';
import PeerDataHandler from '@/classes/PeerDataHandler.ts';
// import { getLang } from '@/utils/i18n';

// const newMessageSound = new Audio(`${config.ipfs.browser}${config.sounds.newMessage}`);


export default {
  name: 'app',
  components: {
    Unlock,
  },
  data() {
    return {
      decrypted: false,
      showWarning: !(localStorage.getItem('alpha-warning') === 'false'),
      peerDataHandler: null,
    };
  },
  methods: {
    decrypt() {
      this.decrypted = true;
      this.checkAccount();
    },
    hideWarning() {
      localStorage.setItem('alpha-warning', false);
      this.showWarning = false;
    },
    initP2P() {
      window.Vault74.Peer2Peer = window.Vault74.Peer2Peer ||
        new Peer2Peer(
          this.$store.state.activeAccount,
          (peer, type, data) => {
            this.peerDataHandler.dispatch(peer, type, data);
          },
        );
      if (this.$store.state.friends) {
        window.Vault74.Peer2Peer.createChannels(this.$store.state.friends);
      }
      this.peerInit = true;
    },
    checkAccount() {
      if (this.$store.state.activeAccount) {
        window.Vault74.messageBroker = new MessageBroker(
          this.$store.state.activeAccount,
          (data) => {
            this.$store.commit('updateMessages', data);
          },
        );
        window.Vault74.warn('No account found yet, rechecking soon.');
        // Attach to peers
        this.initP2P();
        return;
      }
      setTimeout(this.checkAccount, config.peer.timeout);
    },
  },
  mounted() {
    this.peerDataHandler = new PeerDataHandler(this.$store);
    this.$store.commit('ICEConnected', false);
    this.$store.commit('dwellerAddress', false);
    this.$store.commit('activeCaller', false);
    this.$store.commit('clearFriends');
    this.$store.commit('clear');
    // Reset media call data
    this.$store.commit('connectMediaStream', false);
    this.$store.commit('clearTypingUsers');
    // Connect when a new friend is added
    // we have active chats with.
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addFriend') {
        // Connect to new peer.
        window.Vault74.Peer2Peer.createChannels(state.friends);
      }
    });

    // Set i18n locale based on the user preferred language
    if (this.$store.state.settings.language) {
      this.$i18n.locale = this.$store.state.settings.language;
    }

    // ----- Lazy Load of languages from IPFS (currently disabled)
    // Check preferred lang and switch
    // If something goes wrong during the lazy load the language
    // state will be reverted back to the default value
    //
    // getLang(this.$store.state.settings.language).then((messages) => {
    //   this.$i18n.setLocaleMessage(this.$store.state.settings.language, messages);
    //   this.$i18n.locale = this.$store.state.language;
    // }).catch((error) => {
    //   console.error(error);
    //   this.$store.commit('setLanguage', config.defaultLanguage);
    // });
    // -----------------------------------------------------------
  },
};
</script>

<style scoped lang="less">

#app {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  min-width: 990px;
}
</style>

<style lang="less" src="@/assets/styles/app.less"></style>
<style lang="less">
.dark {
  @import "assets/styles/true_dark.less";
}
.ice {
  @import "assets/styles/ice.less";
}
.tokyo {
  @import "assets/styles/tokyo.less";
}
.zenburn {
  @import "assets/styles/zenburn.less";
}
.notification {
  z-index: 10;
  margin: 1rem;
}
</style>