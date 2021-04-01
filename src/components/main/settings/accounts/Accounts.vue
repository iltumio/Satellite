<template>
  <div>
    <h3 class="label no-mobile">{{$t('settings.accounts.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.accounts.heading')}}</h2>
        <p>{{$t('settings.accounts.subtext')}}</p>
        <br>
        <p><b>{{$t('settings.accounts.balance')}}:</b> {{ balance }} {{symbol}}</p>
        <div class="select" v-if="$store.state.accounts">
          <select v-model="$store.state.activeAccount">
            <option v-for="account in $store.state.accounts" :key="account">{{account}}</option>
          </select>
        </div>
        <hr class="spacer">
        <h2>{{$t('settings.accounts.gas_price')}} (MATIC)</h2>
        <p>{{$t('settings.accounts.gas_price_desc')}}</p>
        <br>
        <input v-model="$store.state.gasPrice" class="input" />
      </div>
    </article>
    <h3 class="label">{{$t('settings.accounts.devices')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.accounts.connected_devices')}}</h2>
        <p>{{$t('settings.accounts.none')}}</p>
      </div>
    </article>
  </div>
</template>

<script>
import config from '@/config/config';
import { marketDataByNetwork, getTokenSymbolByNetwork } from "@/utils/EthereumProvider.ts"
import { ethers } from "ethers";

export default {
  name: 'Accounts',
  data() {
    return {
      balance: ethers.utils.formatEther(this.$store.state.balance),
      symbol: '',
    };
  },
  async mounted() {
    const marketData = await marketDataByNetwork(config.network.chain);
    this.symbol = marketData.symbol;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
