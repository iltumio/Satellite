<template>
  <div :class="`modal ${connected ? '' : 'is-active'}`">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body" style="text-align: center;">
        <p class="head">
          <strong>Choose provider</strong>
        </p>
        <b>
          Choose the provider you want to use. If you choose Vault74 provider, you will need to 
          restore your wallet from the seed phrase, or to create a new one
        </b>
        <br /><br />
        <div class="provider-selection" v-if="!$store.state.selectedProvider">
          <div class="provider-element" v-for="(provider) in $store.state.availableProviders"  v-bind:key="provider.type" v-on:click.stop="setSelectedProvider(provider)">
            <img :src="provider.logo"/>
            <span>{{provider.name}}</span>
            </div>
        </div>
        
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
// import Web3 from 'web3';
// import Vault74Registry from '@/utils/contracts/Vault74Registry.ts';
import Vault74Registry from '@/classes/contracts/Vault74Registry.ts';
// import DwellerID from '@/utils/contracts/DwellerContract.ts';
import config from '@/config/config';
import Ethereum from '@/classes/Ethereum';
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
  methods: {
    // Tasks we need to run for Web3 when the application starts
    async startupActions(acc) {
      console.log('startup', acc);

      const registry = new Vault74Registry(this.ethereum, config.registry[config.network.chain]);

      const dwellerContract = await registry.getDwellerContract(acc);

      this.$store.commit('dwellerAddress', dwellerContract);
      if (dwellerContract !== '0x0000000000000000000000000000000000000000') {
        // const dwellerPhoto = await DwellerID.getPhotoAsync(dwellerContract);
        // const dwellerName = await DwellerID.getDwellerName(dwellerContract);
        // this.$store.commit('profilePictureHash', dwellerPhoto);
        // this.$store.commit('username', ethereum.web3.utils.hexToString(dwellerName));
        // Start WebRTC Connections
        // this.$WebRTC.init(this.$store.state.activeAccount);
        // window.Vault74.debug('WebRTC Initalized', this.$WebRTC.identifier);
      }
    },
    // Repeating polling tasks for Web3 stats gathering
    // TODO: Fetching balance
    // web3Polling(account) {
    //   const promises = [ethereum.eth.getBlockNumber(), ethereum.eth.net.getNetworkType()];
    //   if (!account) {
    //     promises.push(ethereum.web3.eth.getAccounts());
    //   }
    //   Promise.all(promises).then((stats) => {
    //     this.$store.commit('web3Stats', {
    //       defaultBlock: ethereum.eth.defaultBlock,
    //       blockNumber: stats[0],
    //       nettype: stats[1],
    //     });
    //     this.$store.commit('accounts', stats[2] || [account]);
    //     this.$store.commit('defaultAccount');
    //     ethereum.eth.getBalance(this.$store.state.activeAccount).then((bal) => {
    //       this.$store.commit('balance', ethereum.utils.fromWei(bal));
    //     });
    //     window.Vault74.debug('Fetched Web3 Stats ->', this.$store.state.web3Stats);
    //   });
    // },
    // Try to connect the selected provider and then commit che change to the store
    async setSelectedProvider(provider) {
      await this.connectProvider(provider);
      this.$store.commit('setSelectedProvider', provider);
    },
    // Connect the selected provider, based on the user selection
    async connectProvider(provider) {
      if (provider.type === 'injected' && provider.name === 'MetaMask') {
        // Try to connect metamask
        await this.connectMetaMask(provider);
      }
    },
    // Connect to Metamask Provider
    async connectMetaMask(provider) {
      // Connect account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length) {
        // Create provider
        this.ethereum = new Ethereum(provider.type);

        // Run async get stats action
        this.getStats();
        this.startupActions(accounts[0]);

        // Set as connected
        this.connected = true;
      }
    },
    async getStats() {
      // Get stats
      const blockNumber = await this.ethereum.getBlockNumber();
      const nettype = await this.ethereum.getNetworkType();

      this.$store.commit('web3Stats', {
        blockNumber,
        nettype,
      });
    },
  },
  mounted() {
    this.$store.commit('setStatus', 'Looking for injected Web3 instance');

    // Get injected provider using web3modal library
    const injectedProvider = getInjectedProvider();

    // Tell the store that we completed our check and we found
    // an injected web3 instance
    this.$store.commit('setInjectedProvider', injectedProvider);

    // If selectedProvider is already present, try to connect
    const { selectedProvider } = this.$store.state;
    if (selectedProvider) {
      this.connectProvider(selectedProvider);
    }
    // const ethEnabled = () => {
    //   if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     ethereum = new Ethereum('window');
    //     window.v74Ethereum = ethereum.web3;
    //     window.ethereum.enable();
    //     this.connected = true;
    //     ethereum.web3.eth.getAccounts().then((acc) => {
    //       if (acc.length) {
    //         this.startupActions();
    //         this.web3Polling();
    //         this.$store.commit('setStatus', 'Web3 is connected');
    //         setInterval(() => {
    //           this.web3Polling();
    //         }, 4000);
    //         return true;
    //       }
    //       setTimeout(() => {
    //         ethEnabled();
    //       }, 4000);
    //       return true;
    //     });
    //   }
    //   window.Vault74.warn('No Web3 provider found. Looking again soon.');
    //   return false;
    // };
    // ethEnabled();
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
