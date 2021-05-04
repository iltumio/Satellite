<<<<<<< HEAD
<template src="./Settings.html"></template>
=======
<template>
  <div
    class="columns"
    v-touch:swipe="swipeHandler"
    v-touch-options="{ swipeTolerance: 75 }"
  >
    <div class="nav-settings">
      <a href="#" @click.prevent="isShowSidebar = true">
        <i class="fas fa-bars"></i>
      </a>
    </div>
    <button
      v-if="open"
      class="modal-close is-large"
      aria-label="close"
      v-on:click="toggleSettings"
    ></button>
    <div
      class="column is-one-third settings-left noselect"
      :class="{ show: isShowSidebar }"
      style="max-width: 300px;"
      v-if="open"
    >
      <h1 id="logo">{{ $t('settings.logo') }}</h1>
      <aside class="menu">
        <p class="menu-label">
          {{ $t('settings.h_general') }}
        </p>
        <ul class="menu-list">
          <li v-on:click="setRoute('personalize')">
            <a :class="`${route == 'personalize' ? 'active' : ''}`">{{
              $t('settings.h_personalize')
            }}</a>
          </li>
          <li v-on:click="setRoute('profile')">
            <a :class="`${route == 'profile' ? 'active' : ''}`">{{
              $t('settings.h_profile')
            }}</a>
          </li>
          <li v-on:click="setRoute('audiovideo')">
            <a :class="`${route == 'audiovideo' ? 'active' : ''}`">{{
              $t('settings.h_audiovideo')
            }}</a>
          </li>
          <li class="no-mobile" v-on:click="setRoute('keybinds')">
            <a :class="`${route == 'keybinds' ? 'active' : ''}`">{{
              $t('settings.h_keybinds')
            }}</a>
          </li>
          <li v-on:click="setRoute('accounts-devices')">
            <a :class="`${route == 'accounts-devices' ? 'active' : ''}`">{{
              $t('settings.h_accounts')
            }}</a>
          </li>
        </ul>
        <p class="menu-label">
          {{ $t('settings.h_networks') }}
        </p>
        <ul class="menu-list">
          <!-- TODO: enable encryption tab -->
          <!-- <li v-on:click="setRoute('encryption')">
            <a :class="`${route == 'encryption' ? 'active' : ''}`">{{$t('settings.h_encryption')}}</a>
          </li> -->
          <li v-on:click="setRoute('storage')">
            <a :class="`${route == 'storage' ? 'active' : ''}`">{{
              $t('settings.h_storage')
            }}</a>
          </li>
          <li v-on:click="setRoute('network')">
            <a :class="`${route == 'network' ? 'active' : ''}`">{{
              $t('settings.h_network')
            }}</a>
          </li>
        </ul>
        <p class="menu-label no-mobile">
          {{ $t('settings.h_information') }}
        </p>
        <ul class="menu-list  no-mobile">
          <li v-on:click="setRoute('contracts')">
            <a :class="`${route == 'contracts' ? 'active' : ''}`">{{
              $t('settings.h_contracts')
            }}</a>
          </li>
        </ul>
      </aside>
    </div>
    <div class="column settings-right" v-body-scroll-lock="isMobile()">
      <Personalize
        v-if="route == 'personalize'"
        :settings="settings"
        :setSetting="setSetting"
      />
      <Keybinds v-if="route == 'keybinds'" :settings="settings" />
      <Profile
        v-if="route == 'profile'"
        :settings="settings"
        :address="address"
      />
      <AudioVideo v-if="route == 'audiovideo'" :settings="settings" />
      <Accounts v-if="route == 'accounts-devices'" :settings="settings" />
      <Network v-if="route == 'network'" :settings="settings" />
      <!-- TODO: make encryption -->
      <!-- <Encryption
        v-if="route == 'encryption'"
        :settings="settings"/> -->
      <Storage v-if="route == 'storage'" :settings="settings" />
      <Contracts v-if="route == 'contracts'" />
    </div>
  </div>
</template>
>>>>>>> 978076802bcf277c3d5d6ab8bbc2151ba33e6d6b

<script>
import { mapMutations, mapState } from 'vuex'
import Personalize from '@/components/settings/personalize/Personalize'
import Profile from '@/components/settings/profile/Profile'
import Keybinds from '@/components/settings/keybinds/Keybinds'
import Accounts from '@/components/settings/accounts/Accounts'
import Network from '@/components/settings/network/Network'
import Storage from '@/components/settings/storage/Storage'
import Encryption from '@/components/settings/encryption/Encryption'
import AudioVideo from '@/components/settings/audiovideo/AudioVideo'
import Contracts from '@/components/settings/contracts/Contracts'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Settings',
  computed: {
    ...mapState(['settings'])
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
    Contracts
  },
  props: ['toggleSettings', 'open', 'address'],
  data () {
    return {
      route: 'profile',
      isShowSidebar: false
    }
  },
  mounted () {
    document.body.addEventListener(
      'click',
      event => {
        if (!event.target.closest('.settings-left')) {
          this.isShowSidebar = false
        }
      },
      true
    )
  },
  methods: {
    ...mapMutations(['setSetting']),
    setRoute (route) {
      this.route = route
      this.isShowSidebar = false
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler (direction) {
      if (this.isMobile()) {
        if (direction === 'left') {
          this.isShowSidebar = false
        }
        if (direction === 'right') {
          this.isShowSidebar = true
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Settings.less"></style>
