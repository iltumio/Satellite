<template src="./Loading.html"></template>

<script>
import EmbededProfile from '@/components/settings/profile/EmbededProfile'
import FundAccount from '@/components/common/wallet/FundAccount'
import Loader from './Loader'

export default {
  name: 'Loading',
  props: ['text'],
  components: {
    EmbededProfile,
    FundAccount,
    Loader
  },
  data () {
    return {
      showWeb3: false,
      showLoader: true
    }
  },
  mounted () {},
  methods: {
    reload () {
      window.location.reload()
    },
    hideLoader () {
      this.showLoader = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Loading.less"></style>
