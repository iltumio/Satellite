<template>
  <div>
    <ProviderSelection v-if="!$store.state.selectedProvider" />
    <WalletCreation
      v-if="$store.state.selectedProvider && !$store.state.accounts && !$store.state.mnemonic"
      :onWalletCreated="onWalletCreated"
    />
  </div>
</template>

<script>
import ProviderSelection from '@/components/common/ProviderSelection';
import WalletCreation from '@/components/common/WalletCreation';
import Registry from '@/classes/contracts/Registry.ts';
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
    WalletCreation,
  },
  methods: {
    onWalletCreated(wallet) {
      const { selectedProvider } = this.$store.state;
      this.connectProvider(selectedProvider, wallet);
    },
    // Connect the selected provider, based on the user selection
    async connectProvider(providerInfo, wallet = null) {
      await this.$ethereum.initialize(providerInfo.type, wallet);

      this.$store.commit('setWeb3Connected', true);
      this.$store.commit('accounts', this.$ethereum.getAccounts());
      this.$store.commit('defaultAccount');

      // Run async get stats action
      this.getStats();
      this.startupActions();
    },
    // Tasks we need to run for Web3 when the application starts
    async startupActions() {
      const registry = new Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContract = await registry.getDwellerContract(this.$ethereum.activeAccount);
      this.$store.commit('dwellerAddress', dwellerContract);
      if (dwellerContract !== '0x0000000000000000000000000000000000000000') {
        const dwellerID = new DwellerID(this.$ethereum, dwellerContract);
        const dwellerPhoto = await dwellerID.getPhoto();
        const dwellerName = await dwellerID.getDwellerName();
        this.$store.commit('profilePictureHash', dwellerPhoto);
        this.$store.commit('username', ethers.utils.parseBytes32String(dwellerName));
        this.$store.dispatch('fetchFriends', this.$store.state.activeAccount);
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
      if (this.$store.state.selectedProvider.type === 'injected') {
        this.connectProvider(this.$store.state.selectedProvider);
      } else if (this.$store.state.mnemonic) {
        const wallet = ethers.Wallet.fromMnemonic(this.$store.state.mnemonic);
        this.onWalletCreated(wallet);
      }
    }

    // Subscribe to store changes
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === 'setSelectedProvider') {
        if (mutation.payload.type === 'injected') {
          this.connectProvider(mutation.payload);
        }
      }
    });
  },
};
</script>

<style scoped lang="less">
.head {
  font-family: 'Space Mono', monospace;
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
