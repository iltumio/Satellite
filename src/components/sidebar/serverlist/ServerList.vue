<template src="./ServerList.html"></template>

<script>
import config from '@/config/config'

import CircleIcon from '@/components/common/CircleIcon'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts'

export default {
  name: 'ServerList',
  props: ['toggleCreateServer', 'servers', 'loadingServers'],
  components: {
    CircleIcon
  },
  data () {
    return {
      dwellerCachingHelper: new DwellerCachingHelper(
        this.$ethereum,
        config.registryAddress,
        config.cacher.dwellerLifespan
      ),
      unreads: []
    }
  },
  methods: {
    // Navigate to a specific server
    openServer (server) {
      this.$store.commit('activeServer', server)
      this.$store.commit('changeRoute', 'server')
    },
    // Navigate to the main route
    goHome () {
      this.$store.commit('changeRoute', 'main')
    },
    // Marks an unread message as read
    viewUnread (unread) {
      this.$store.commit('changeRoute', 'main')
      this.$store.commit('activeChat', unread.address)
      this.$store.commit('newChat', unread.address)
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false)
          this.getUnreads(this.$store.state.unreads)
        }, 0)
      })
    },
    // Get a list of unread users profiles, currently doesn't support
    // the amount of unread messages, just that there are unreads.
    async getUnreads (unreads) {
      const filteredUnreads = unreads.filter(
        u => u !== this.$store.state.activeAccount
      )
      const accounts = []
      filteredUnreads.forEach(address => {
        accounts.push(this.dwellerCachingHelper.getDweller(address))
      })
      this.unreads = await Promise.all(accounts)
    }
  },
  async mounted () {
    this.getUnreads(this.$store.state.unreads)
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'markUnread' || mutation.type === 'markRead') {
        this.getUnreads(state.unreads)
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ServerList.less"></style>
