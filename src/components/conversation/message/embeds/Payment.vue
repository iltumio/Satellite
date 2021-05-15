<template src="./Payment.html"></template>

<script>
import config from '@/config/config'
import ExternalLink from '@/components/common/ExternalLink'
import {
  getExplorerByNetwork,
  marketDataByNetwork
} from '@/utils/EthereumProvider.ts'

export default {
  name: 'Payment',
  components: {
    ExternalLink
  },
  props: ['message'],
  data () {
    return {
      name: false,
      config,
      priceUsd: 0,
      tokenSymbol: '',
      explorer: getExplorerByNetwork(config.network.chain)
    }
  },
  methods: {
    /** @method
     * Setter
     * Reach out to the CoinCap.io API for current market
     * prices of Ethereum to USD
     * @name getMarketPrice
     */
    async getMarketPrice () {
      const marketData = await marketDataByNetwork(config.network.chain)
      this.priceUsd = marketData.priceUsd
      this.tokenSymbol = marketData.symbol
    }
  },
  mounted () {
    this.getMarketPrice()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Payment.less"></style>
