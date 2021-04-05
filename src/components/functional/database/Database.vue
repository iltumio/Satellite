<template></template>
<script>
import config from '@/config/config'

export default {
  name: 'database',
  data () {
    return { activeAccount: false }
  },
  methods: {
    async startup () {
      setTimeout(() => {
        // Really shouldn't be used, but prevents
        // some potenial race conditions with globals
        this.$store.commit('starting', false)
      }, 500)
    },
    makeKey () {
      return {
        key: config.textile.key
      }
    }
  },
  async mounted () {
    this.$store.commit('starting', true)
    if (this.$store.state.databaseEnabled) {
      const identity = await this.$Threads.getIdentity()
      const client = await this.$Threads.authorize(identity)

      // We should depricate this when we move to only using the ThreadDB class
      await this.$Threads.init(
        this.$store.state.activeAccount,
        client.client,
        client.token
      )

      // Initalize ThreadDB
      // await this.$ThreadDB.init(this.$store.state.activeAccount);
      // await this.$ThreadDB.auth();

      // Init Remote Storage
      await this.$RemoteStorage.init('remote-storage')
      await this.$RemoteStorage.authorize()

      await this.$database.authenticate(
        'textile',
        this.$store.state.activeAccount,
        window.v74pin,
        client,
        identity
      )
      this.$store.commit('authenticated')

      if (this.$ethereum.isInitialized) {
        // Initialize e2ee
        // @ts-ignore
        const { messageManager } = this.$database
        messageManager.initE2EEngine(this.$ethereum.wallet)
      }

      this.startup()
      await this.$database.initBuckets()
      this.$store.commit('buckets')
    } else {
      await this.$database.authenticate(
        'localStorage',
        this.$store.state.activeAccount,
        window.v74pin
      )
      this.$store.commit('authenticated')
      this.startup()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
