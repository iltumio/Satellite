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
      <p
        id="logo"
        :style="`${($store.state.dwellerAddress !== '0x0000000000000000000000000000000000000000') ? 'margin-top: 5rem' : ''}`">
        <Loader size="100"  />
      </p>
      <div class="red" v-if="$store.state.criticalError">
        <i class="fas fa-skull"></i> Failure to load: {{ $store.state.criticalError }} <br /><br />
        <button class="button is-danger is-small" v-on:click="reload">Retry?</button>
      </div>
      <div v-else-if="!$store.state.dwellerAddress">
        <i class="fas fa-spinner-third fa-spin"></i> {{ $t('loading.connecting_blockchain') }}
      </div>
      <div
        v-else-if="$store.state.dwellerAddress == '0x0000000000000000000000000000000000000000'"
        class="content"
      >
        <FundAccount v-if="$store.state.balance && $store.state.balance.eq(0)"/>
        <EmbededProfile :customFinalAction="reload" v-else />
        <!-- <Profile :customFinalAction="reload" v-else /> -->
      </div>
      <div v-else-if="!$store.state.friendsLoaded">
        <i class="fas fa-spinner-third fa-spin"></i> {{ $t('loading.assembling') }}
      </div>
      <div v-else-if="$store.state.starting">
        <i class="fas fa-spinner-third fa-spin"></i> {{ $t('loading.generic') }}
      </div>
      <div v-else-if="!$store.state.ICEConnected">
        <i class="fas fa-spinner-third fa-spin"></i> {{ $t('loading.connecting_broker') }}
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
import EmbededProfile from '@/components/main/settings/profile/EmbededProfile';
import FundAccount from '@/components/common/FundAccount';
import Loader from './Loader';

export default {
  name: 'Loading',
  props: ['text'],
  components: {
    EmbededProfile,
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
        bottom: 3rem;
        text-align: center;
        left: 1rem;
        right: 1rem;
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
        font-family: 'Space Mono', monospace;
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
    }
    .loading-dispaly {
        margin: 0 auto;
        margin-top: calc(25% - 125px);
        width: 50%;
        height: 250px;
        text-align: center;
        font-family: 'Space Mono', monospace;
    }
    .showing-content {
        margin-top: 1rem;
    }
    .metamask {
        margin-top: 3rem;
    }
    .content {
        font-family: 'Poppins', sans-serif;
        text-align: left;
    }

    @media (max-width: 768px) {
      .loading {
        background-image: url(/static/img/mobile-background.png);
        background-position: bottom;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      
      .special-thanks {
        display: none;
      }

      .loading-dispaly {
          width: 100%;
          height: 100vh !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-image: url(/static/img/mobile-background.png);
          background-position: bottom;
          background-size: contain;
          background-repeat: no-repeat;
          position: absolute;
          padding-top: 10%;
          padding-bottom: 4rem;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin-top: 0 !important;
      }

      .label {
        display: none;
      }

      .message.is-dark .message-body {
        border: none !important;
      }
    }
</style>
