<template>
  <div id="payment">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <i class="fas fa-dollar-sign logo"></i>
            <strong class="amount green">${{ message.data.amount }}</strong><br />
            <small> {{ message.data.amount }} {{ tokenSymbol }}</small><br />
            <br />
            <ExternalLink
              :link="`${explorer}/tx/${message.data.tx}`"
              :text="$t('global.view_on_etherscan')"
            >
            </ExternalLink>
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

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
<style scoped>
.media {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
  padding: 0 1rem 0.5rem 1rem;
  max-width: 450px;
  color: #666;
  position: relative;
  border-left: 4px solid #00d0a1;
  margin-bottom: 0.5rem;
}
.media:hover .logo {
  color: #000;
}
.media-content {
  padding: 0.3rem;
  font-size: 10pt;
}
.content {
  padding-left: 5rem;
}
.logo {
  font-size: 38pt;
  position: absolute;
  left: 2rem;
  top: 1.15rem;
}
.amount {
  color: #00d0a1;
  font-size: 20pt;
}
img {
  border-radius: 4px;
}
</style>
