<template>
  <div id="loading">
    <div
      :class="
        `loading-dispaly ${
          $store.state.dwellerAddress === '0x0000000000000000000000000000000000000000'
            ? 'showing-content'
            : ''
        }`
      "
    >
      <p id="logo">
        <Loader size="100" />
      </p>
      <div class="red" v-if="$store.state.criticalError">
        <i class="fas fa-skull"></i> Failure to load: {{ $store.state.criticalError }} <br /><br />
        <button class="button is-danger is-small" v-on:click="reload">Retry?</button>
      </div>
      <div v-else-if="!$store.state.dwellerAddress">
        <i class="fas fa-circle-notch fa-pulse"></i> {{ $t('loading.connecting_blockchain') }}
      </div>
      <div
        v-else-if="$store.state.dwellerAddress == '0x0000000000000000000000000000000000000000'"
        class="content"
      >
        <FundAccount v-if="$store.state.balance && $store.state.balance.eq(0)"/>
        <Profile v-else />
        <!-- <Profile :customFinalAction="reload" v-else /> -->
      </div>
      <div v-else-if="!$store.state.friendsLoaded">
        <i class="fas fa-circle-notch fa-pulse"></i> {{ $t('loading.assembling') }}
      </div>
      <div v-else-if="$store.state.starting">
        <i class="fas fa-circle-notch fa-pulse"></i> {{ $t('loading.generic') }}
      </div>
      <div v-else-if="!$store.state.ICEConnected">
        <i class="fas fa-circle-notch fa-pulse"></i> {{ $t('loading.connecting_broker') }}
      </div>
      <div
        class="metamask"
        v-if="
          showWeb3 && $store.state.dwellerAddress !== '0x0000000000000000000000000000000000000000'
        "
      >
        <!-- <span
          v-if="!$store.state.dwellerAddress"
          v-html="
            $t('loading.long_load', {
              text: 'https://metamask.io/',
              link: 'https://metamask.io/',
              target: '_blank',
            })
          "
        /> -->
        <span v-if="!$store.state.friendsLoaded">
          {{ $t('loading.textile') }}
        </span>
        <span v-else-if="!$store.state.ICEConnected">
          {{ $t('loading.other_tab') }}
        </span>
        <span v-else>
          {{ $t('loading.something_wrong') }}
          <a href="#" target="_blank" v-on:click="window.location.reload()">{{
            $t('loading.retry')
          }}</a>
        </span>
      </div>
      <p class="special-thanks">
        {{ $t('loading.alpha') }}
      </p>
    </div>
  </div>
</template>

<script>
import Profile from '@/components/main/settings/profile/Profile';
import FundAccount from '@/components/common/FundAccount';
import Loader from './Loader';

export default {
  name: 'Loading',
  props: ['text'],
  components: {
    Profile,
    FundAccount,
    Loader,
  },
  data() {
    return {
      showWeb3: false,
    };
  },
  mounted() {},
  methods: {
    reload() {
      window.location.reload();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.special-thanks {
  position: absolute;
  bottom: 1rem;
  text-align: center;
  left: 0;
  right: 0;
  color: #00cec9;
}
.loading-image {
  height: 200px;
}
.visible {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}
#logo {
  font-family: 'Major Mono Display', monospace;
  font-size: 35pt;
  padding-top: 1rem;
  margin-bottom: 1rem;
}
#loading {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #1c1a24;
  z-index: 100;
  display: flex;
  align-items:center;
  justify-content: center;
}
.loading-dispaly {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  /* margin: 0 auto;
  margin-top: calc(25% - 125px);
  width: 50%;
  height: 250px;
  text-align: center; */
  font-family: 'Major Mono Display', monospace;
}
.showing-content {
  margin-top: 1rem;
}
.metamask {
  margin-top: 3rem;
}
.content {
  font-family: 'Open Sans', sans-serif;
  text-align: left;
}
</style>
