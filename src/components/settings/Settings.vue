<template src="./Settings.html"></template>

<script>
import { mapMutations, mapState } from 'vuex'
import Personalize from '@/components/settings/personalize/Personalize'
import Profile from '@/components/settings/profile/Profile'
import Keybinds from '@/components/settings/keybinds/Keybinds'
import Accounts from '@/components/settings/accounts/Accounts'
import Network from '@/components/settings/network/Network'
import Storage from '@/components/settings/storage/Storage'
import Encryption from '@/components/settings/encryption/Encryption'
import AudioVideo from '@/components/settings/audiovideo/AudioVideo'
import Contracts from '@/components/settings/contracts/Contracts'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Settings',
  computed: {
    ...mapState(['settings'])
  },
  components: {
    Personalize,
    Profile,
    Keybinds,
    Accounts,
    Network,
    Encryption,
    Storage,
    AudioVideo,
    Contracts
  },
  props: ['toggleSettings', 'open', 'address'],
  data () {
    return {
      route: 'profile',
      isShowSidebar: false
    }
  },
  mounted () {
    document.body.addEventListener(
      'click',
      event => {
        if (!event.target.closest('.settings-left')) {
          this.isShowSidebar = false
        }
      },
      true
    )
  },
  methods: {
    ...mapMutations(['setSetting']),
    setRoute (route) {
      this.route = route
      this.isShowSidebar = false
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler (direction) {
      if (this.isMobile()) {
        if (direction === 'left') {
          this.isShowSidebar = false
        }
        if (direction === 'right') {
          this.isShowSidebar = true
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Settings.less"></style>
