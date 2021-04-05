<template src="./Wallet.html"></template>

<script>
import MobileNav from '@/components/sidebar/mobilenav/MobileNav'
import Asset from './Asset'
import config from '@/config/config'
import { ethers } from 'ethers'
import { marketDataByNetwork } from '@/utils/EthereumProvider.ts'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Wallet',
  props: ['toggleSettings'],
  components: {
    MobileNav,
    Asset
  },
  data () {
    return {
      priceUsd: 0,
      balanceUsd: 0,
      parsedBalance: ethers.utils.formatEther(this.$store.state.balance)
    }
  },
  mounted () {
    this.setBalance()

    this.$store.dispatch('updateAllTokenBalances')
  },
  methods: {
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile,
    async setBalance () {
      const marketData = await marketDataByNetwork(config.network.chain)
      this.priceUsd = marketData.priceUsd
      this.balanceUsd =
        Math.floor(this.parsedBalance * this.priceUsd * 100) / 100
    },
    formatEther (value) {
      return ethers.utils.formatEther(value)
    },
    calcTotal (assets) {
      return Object.values(assets)
        .reduce(
          (sum, asset) =>
            sum +
            parseFloat(this.formatEther(asset.balance)) *
              parseFloat(asset.priceUsd),
          0
        )
        .toFixed(2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Wallet.less"></style>
