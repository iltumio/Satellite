<template src="./Address.html"></template>

<script>
import ExternalLink from '@/components/common/ExternalLink'
import config from '@/config/config'
import CircleIcon from '@/components/common/CircleIcon'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper'
import { getExplorerByNetwork } from '@/utils/EthereumProvider.ts'

export default {
  name: 'Address',
  props: ['address'],
  components: {
    ExternalLink,
    CircleIcon
  },
  data() {
    return {
      loading: true,
      account: false,
      cache: new DwellerCachingHelper(
        this.$ethereum,
        config.registryAddress,
        config.cacher.dwellerLifespan
      ),
    }
  },
  methods: {
    async isAccount() {
      const user = await this.cache.getDweller(this.address[0])
      return user
    },
    getEtherscanLink () {
      return `${getExplorerByNetwork(config.network.chain)}/address/${
        this.address[0]
      }`
    },
    clickAction() {
      if (this.account) {
         this.$store.commit('viewProfile', this.address[0])
      }
    }
  },
  async mounted() {
    const isAccount = await this.isAccount()
    if (isAccount) {
      this.account = isAccount
    } else {
      this.account = false
    }
    this.loading = false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="less" src="./Address.less"></style>


