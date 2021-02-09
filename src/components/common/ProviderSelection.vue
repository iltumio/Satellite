<template>
  <div class="fullscreen-pane">
    <section class="provider-selection-container">
      <p class="head">
        <strong>Choose provider</strong>
      </p>
      <b>
        Choose the provider you want to use. If you choose Vault74 provider, you will need to 
        restore your wallet from the seed phrase, or to create a new one
      </b>
      <br /><br />
      <div class="provider-selection">
        <div class="provider-element" v-for="(provider) in $store.state.availableProviders"  v-bind:key="provider.type" v-on:click.stop="setSelectedProvider(provider)">
          <img :src="provider.logo"/>
          <span>{{provider.name}}</span>
          </div>
      </div>
      
    </section>
  </div>
</template>

<script>
// import Ethereum from '@/classes/Ethereum';
// import Vault74Registry from '@/classes/contracts/Vault74Registry.ts';
// import DwellerID from '@/utils/contracts/DwellerContract.ts';
// import config from '@/config/config';

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
    // Record the choosen provider in Vuex
    async setSelectedProvider(provider) {
      this.$store.commit('setSelectedProvider', provider);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">

.provider-selection-container {
  text-align: center;
  width: 50%;
  background: rgba(10, 10, 10, 0.86);
  padding: 50px;
  border-radius: 15px;
  
  .provider-selection {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .provider-element {
      display: flex;
      flex-direction: column;
      max-width: 200px;
      cursor: pointer;
      padding: 20px;
      border-radius: 5px;
      overflow: hidden;
      justify-content: space-around;

      &:hover {
        // Lighter blue gray
        background-color: #545974;
      }    
    }
}
}

</style>
