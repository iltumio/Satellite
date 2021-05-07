<template src="./ProviderSelection.html"></template>

<script>
export default {
  name: 'ProviderSelection',
  data () {
    return {
      connected: false,
      selectedProvider: null,
      ethereum: null
    }
  },
  props: ['onProviderSelected'],
  methods: {
    // Record the choosen provider in Vuex
    async setSelectedProvider (provider) {
      if (typeof this.onProviderSelected === 'function') {
        this.onProviderSelected(provider)
      }
    }
  },
  mounted () {
    let providers = this.$store.state.availableProviders
    if (providers.length === 1 && providers[0].type == 'satellite') {
      this.setSelectedProvider(providers[0])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ProviderSelection.less"></style>
