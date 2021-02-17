<template>
  <div>
    <ProviderSelection v-if="!$store.state.selectedProvider"/>
  </div>
</template>

<script>
import ProviderSelection from '@/components/common/ProviderSelection';
import Vault74Registry from '@/classes/contracts/Vault74Registry.ts';
import DwellerID from '@/classes/contracts/DwellerContract.ts';
import config from '@/config/config';
import { ethers } from 'ethers';
import { getInjectedProvider } from 'web3modal';

export default {
  name: 'Web3',
  data() {
    return {
      connected: false,
      selectedProvider: null,
      ethereum: null,
    };
  },
  components: {
    ProviderSelection,
  },
  methods: {
    // Connect the selected provider, based on the user selection
    async connectProvider(providerInfo) {
      await this.$ethereum.initialize(providerInfo.type);

      // Bind ethereum provider to the window object
      window.satelliteProvider = this.$ethereum;

      this.$store.commit('setWeb3Connected', true);
      this.$store.commit('accounts', this.$ethereum.getAccounts());
      this.$store.commit('defaultAccount');

      // Run async get stats action
      this.getStats();
      this.startupActions();
    },
    // Tasks we need to run for Web3 when the application starts
    async startupActions() {
      const registry = new Vault74Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContract = await registry.getDwellerContract(this.$ethereum.activeAccount);
      this.$store.commit('dwellerAddress', dwellerContract);
      if (dwellerContract !== '0x0000000000000000000000000000000000000000') {
        const dwellerID = new DwellerID(this.$ethereum, dwellerContract);
        const dwellerPhoto = await dwellerID.getPhoto();
        const dwellerName = await dwellerID.getDwellerName();
        this.$store.commit('profilePictureHash', dwellerPhoto);
        this.$store.commit('username', ethers.utils.parseBytes32String(dwellerName));

        this.$store.commit('fetchFriends', this.$store.state.activeAccount);
      }
    },
    async getStats() {
      // Get stats
      const blockNumber = await this.$ethereum.getBlockNumber();
      const nettype = await this.$ethereum.getNetworkType();

      this.$store.commit('web3Stats', {
        blockNumber,
        nettype,
      });
    },
  },
  mounted() {
    // Get injected provider using web3modal library
    const injectedProvider = getInjectedProvider();

    // Tell the store that we completed our check and we found
    // an injected web3 instance
    this.$store.commit('setInjectedProvider', injectedProvider);


    // Check if provider has already been selected and
    // try to connect
    if (this.$store.state.selectedProvider) {
      this.connectProvider(this.$store.state.selectedProvider);
    }


    // Subscribe to store changes
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'setSelectedProvider') {
        this.connectProvider(mutation.payload);
      }
    });
  },
};
</script>

<style scoped lang="less">
.head {
  font-family: 'Major Mono Display', monospace;
  font-size: 20pt;
  padding-top: 1rem;
  padding-bottom: 2rem;
}
.provider-selection {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .provider-element {
    display: flex;
    flex-direction: column;
    width: 33%;
    cursor: pointer;
    padding: 20px;
    border-radius: 5px;
    overflow: hidden;

    justify-content: space-between;

    &:hover {
      // Lighter blue gray
      background-color: #545974;
    }    
  }
}
</style>
