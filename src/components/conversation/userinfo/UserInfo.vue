<template src="./UserInfo.html"></template>

<script>
import Badge from '@/components/common/Badge'
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'
import { getExplorerByNetwork } from '@/utils/EthereumProvider.ts'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'UserInfo',
  props: ['makeCall', 'toggle'],
  components: {
    CircleIcon,
    Badge
  },
  methods: {
    /** @method
     * Wrap links in <a> tags
     * @name wrapLinks
     * @argument message string to wrap links in
     * @returns string value of formatted message
     */
    messageUser (user) {
      // this.$store.commit('activeChat', user)
      this.$store.dispatch('setActiveChat', { friendAddress: user })
    },
    /** @method
     * Opens an etherscan link to the given address
     * @name etherscan
     * @argument address address to open to
     */
    etherscan (address) {
      window.open(
        `${getExplorerByNetwork(config.network.chain)}/address/${address}`
      )
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler (direction) {
      if (this.isMobile()) {
        if (direction === 'right') {
          this.$store.commit('toggleUserInfo')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./UserInfo.less"></style>
