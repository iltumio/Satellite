<template>
  <div :class="`modal ${connected ? '' : 'is-active'}`">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body" style="text-align: center;">
        <p class="head"><strong>{{$t('web3.connecting')}}</strong></p>
        <b>{{$t('web3.provider_suggestion')}} </b>
        <br /><br>
        <a href="https://metamask.io/" target="_blank">https://metamask.io/</a>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
import Web3 from 'web3';
import Registry from '@/utils/contracts/Registry.ts';
import DwellerID from '@/utils/contracts/DwellerContract.ts';
import Ethereum from '@/classes/Ethereum';

let ethereum = null;

export default {
  name: 'Web3',
  data() {
    return {
      connected: false,
    };
  },
  methods: {
    // Tasks we need to run for Web3 when the application starts
    async startupActions(acc) {
      const [account] = acc ? [acc] : await ethereum.web3.eth.getAccounts();
      const dwellerContract = await Registry.getDwellerContract(account);
      const dwellerPhoto = await DwellerID.getPhotoAsync(dwellerContract);
      const dwellerName = await DwellerID.getDwellerName(dwellerContract);
      if (dwellerContract !== '0x0000000000000000000000000000000000000000') {
        this.$store.commit('dwellerAddress', dwellerContract);
        this.$store.commit('profilePictureHash', dwellerPhoto);
        this.$store.commit('username', ethereum.web3.utils.hexToString(dwellerName));
        // Start WebRTC Connections
        this.$WebRTC.init(this.$store.state.activeAccount);
        window.Satellite.debug('WebRTC Initalized', this.$WebRTC.identifier);
      } else {
        this.$store.commit('dwellerAddress', '0x0000000000000000000000000000000000000000');
      }
    },
    // Repeating polling tasks for Web3 stats gathering
    web3Polling(account) {
      const promises = [
        ethereum.eth.getBlockNumber(),
        ethereum.eth.net.getNetworkType(),
      ];
      if (!account) {
        promises.push(ethereum.web3.eth.getAccounts());
      }
      Promise.all(promises).then((stats) => {
        this.$store.commit('web3Stats', {
          defaultBlock: ethereum.eth.defaultBlock,
          blockNumber: stats[0],
          nettype: stats[1],
        });
        this.$store.commit('accounts', stats[2] || [account]);
        this.$store.commit('defaultAccount');
        ethereum.eth.getBalance(this.$store.state.activeAccount).then((bal) => {
          this.$store.commit('balance', ethereum.utils.fromWei(bal));
        });
        window.Satellite.debug(
          'Fetched Web3 Stats ->',
          this.$store.state.web3Stats,
        );
      });
    },
  },
  mounted() {
    this.$store.commit('setStatus', 'Connecting to Web3');
    const ethEnabled = () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        ethereum = new Ethereum('window');
        window.v74Ethereum = ethereum.web3;
        window.ethereum.enable();
        this.connected = true;
        ethereum.web3.eth.getAccounts().then((acc) => {
          if (acc.length) {
            this.startupActions();
            this.web3Polling();
            this.$store.commit('setStatus', 'Web3 is connected');
            setInterval(() => {
              this.web3Polling();
            }, 4000);
            return true;
          }
          setTimeout(() => {
            ethEnabled();
          }, 4000);
          return true;
        });
      }
      window.Satellite.warn('No Web3 provider found. Looking again soon.');
      return false;
    };
    ethEnabled();
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
</style>