<template src="./Wallet.html"></template>

<script>
import MobileNav from '@/components/sidebar/mobilenav/MobileNav';
import Asset from './Asset';
import config from '@/config/config';
import { ethers } from "ethers";
import { marketDataByNetwork, getTokenSymbolByNetwork } from "@/utils/EthereumProvider.ts"

import MobileUtils from '@/utils/Mobile.ts';

export default {
  name: 'Wallet',
  props: ['toggleSettings'],
  components: {
    MobileNav,
    Asset
  },
  data() {
    return {
      priceUsd: 0,
      balanceUsd: 0,
      parsedBalance: ethers.utils.formatEther(this.$store.state.balance),
      assets: [
        {
          symbol: 'MATIC',
          name: 'Polygon',
          icon: 'QmV3z48ftfSLf1kHKEvFHjikiaA1GV88vRSSKFTmbBFgcn',
        },
        {
          symbol: 'SAT',
          name: 'Satellite',
          icon: 'QmUUtzqBLguzq1PHXSX91gkJbhp3WznaJpMpywiaCfmLXy',
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          icon: 'QmUJgkxUiPMmQwwExD1rVM5Ka6hxsMrkoKCudfktd2mfGN',
        },
      ],
    }
  },
  mounted() {
    this.setBalance();
  },
  methods: {
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile,
    async setBalance() {
      const marketData = await marketDataByNetwork(config.network.chain);
      this.priceUsd = marketData.priceUsd;
      this.balanceUsd = Math.floor((this.parsedBalance * this.priceUsd) * 100) / 100;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Wallet.less"></style>
