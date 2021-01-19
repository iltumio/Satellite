<template>
  <div class="columns">
    <button v-if="open" class="modal-close is-large" aria-label="close" v-on:click="toggleSettings"></button>
    <div class="column is-one-third settings-left noselect" style="max-width: 300px;" v-if="open">
      <h1 id="logo">{{$t('settings.logo')}}</h1>
      <aside class="menu">
        <p class="menu-label">
          {{$t('settings.h_general')}}
        </p>
        <ul class="menu-list">
          <li v-on:click="setRoute('personalize')">
            <a :class="`${route == 'personalize' ? 'active' : ''}`">{{$t('settings.h_personalize')}}</a>
          </li>
          <li v-on:click="setRoute('profile')">
            <a :class="`${route == 'profile' ? 'active' : ''}`">{{$t('settings.h_profile')}}</a>
          </li>
          <li v-on:click="setRoute('audiovideo')">
            <a :class="`${route == 'audiovideo' ? 'active' : ''}`">{{$t('settings.h_audiovideo')}}</a>
          </li>
          <li v-on:click="setRoute('keybinds')">
            <a :class="`${route == 'keybinds' ? 'active' : ''}`">{{$t('settings.h_keybinds')}}</a>
          </li>
          <li v-on:click="setRoute('accounts-devices')">
            <a :class="`${route == 'accounts-devices' ? 'active' : ''}`">{{$t('settings.h_accounts')}}</a>
          </li>
        </ul>
        <p class="menu-label">
          {{$t('settings.h_networks')}}
        </p>
        <ul class="menu-list">
          <li v-on:click="setRoute('encryption')">
            <a :class="`${route == 'encryption' ? 'active' : ''}`">{{$t('settings.h_encryption')}}</a>
          </li>
          <li v-on:click="setRoute('storage')">
            <a :class="`${route == 'storage' ? 'active' : ''}`">{{$t('settings.h_storage')}}</a>
          </li>
          <li v-on:click="setRoute('network')">
            <a :class="`${route == 'network' ? 'active' : ''}`">{{$t('settings.h_network')}}</a>
          </li>
        </ul>
        <p class="menu-label">
          {{$t('settings.h_information')}}
        </p>
        <ul class="menu-list">
          <li v-on:click="setRoute('contracts')">
            <a :class="`${route == 'contracts' ? 'active' : ''}`">{{$t('settings.h_contracts')}}</a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column settings-right">
      <Personalize 
        v-if="route == 'personalize'" 
        :settings="settings"
        :setSetting="setSetting"/>
      <Keybinds 
        v-if="route == 'keybinds'" 
        :settings="settings"/>
      <Profile 
        v-if="route == 'profile'" 
        :settings="settings"
        :address="address"/>
      <AudioVideo 
        v-if="route == 'audiovideo'" 
        :settings="settings"/>
      <Accounts 
        v-if="route == 'accounts-devices'" 
        :settings="settings"/>
      <Network 
        v-if="route == 'network'" 
        :settings="settings"/>
      <Encryption 
        v-if="route == 'encryption'" 
        :settings="settings"/>
      <Storage 
        v-if="route == 'storage'" 
        :settings="settings"/>
      <Contracts 
        v-if="route == 'contracts'"/>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Personalize from '@/components/main/settings/personalize/Personalize';
import Profile from '@/components/main/settings/profile/Profile';
import Keybinds from '@/components/main/settings/keybinds/Keybinds';
import Accounts from '@/components/main/settings/accounts/Accounts';
import Network from '@/components/main/settings/network/Network';
import Storage from '@/components/main/settings/storage/Storage';
import Encryption from '@/components/main/settings/encryption/Encryption';
import AudioVideo from '@/components/main/settings/audiovideo/AudioVideo';
import Contracts from '@/components/main/settings/contracts/Contracts';

export default {
  name: 'Settings',
  computed: {
    ...mapState(['settings']),
  },
  components: {
    Personalize,
    Profile,
    Keybinds,
    Accounts,
    Network,
    Encryption,
    Storage,
    AudioVideo,
    Contracts,
  },
  props: ['toggleSettings', 'open', 'address'],
  data() {
    return {
      route: 'personalize',
    };
  },
  methods: {
    ...mapMutations(['setSetting']),
    setRoute(route) {
      this.route = route;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .close {
      position: fixed;
      top: 1rem;
      right: 1rem;
      font-size: 16pt;
      padding: 0.5rem;
      line-height: 0;
      height: 30px;
      width: 30px;
      border: none;
    }
    .close i {
      margin: 0;
      line-height: 0;
    }
    #logo {
      font-family: 'Major Mono Display', monospace;
      font-size: 20pt;
      padding-top: 0;
      padding-bottom: 2rem;
    }
    .columns {
      height: 100%;
      position: relative;
      margin-left: 0;
      margin-right: 0;
      margin-top: 0;
    }
    .settings-left {
      padding: 3rem;
      padding-top: 1rem;
      background: #fff;
      height: 100%;
    }
    .settings-right {
      padding: 3rem;
      padding-right: 3rem;
      padding-top: 1rem;
      height: 100%;
      overflow-y: scroll;
    }
    .menu {
      height: 90%;
      overflow-y: scroll;
      scrollbar-width: thin;
    }
    .menu a:hover {
      color: #00d0a1;
    }
    .active {
      background: #ccc;
      color: black;
    }
</style>
