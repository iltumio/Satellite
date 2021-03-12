<template>
  <div class="fullscreen-pane">
    <section class="provider-selection-container">
      <h1 class="head">{{$t('web3.provider_selection.heading')}}</h1>
      <b>
        {{$t('web3.provider_selection.subtext')}}
      </b>
      <br /><br />
      <div class="provider-selection">
        <div class="provider-element" v-for="(provider) in $store.state.availableProviders"  v-bind:key="provider.type" v-on:click.stop="setSelectedProvider(provider)">
          <img :src="provider.logo"/>
          <span>{{provider.name}}</span>
          </div>
      </div>

    </section>
  </div>
</template>

<script>
export default {
  name: 'ProviderSelection',
  data() {
    return {
      connected: false,
      selectedProvider: null,
      ethereum: null,
    };
  },
  props: ['onProviderSelected'],
  methods: {
    // Record the choosen provider in Vuex
    async setSelectedProvider(provider) {
      if(typeof this.onProviderSelected === 'function'){
        this.onProviderSelected(provider)
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">

.provider-selection-container {
  text-align: center;
  width: 50%;
  background: rgba(10, 10, 10, 0.86);
  padding: 50px;
  border-radius: 15px;
  margin: calc(50% - 500px) auto;

  .head {
    font-family: 'Space Mono', monospace;
    font-size: 20pt;
    padding-bottom: 1rem;
    text-transform: uppercase;
  }

  img {
    height: auto;
    max-width: 100px;
    max-height: 100px;
  }
  .provider-selection {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .provider-element {
      display: flex;
      flex-direction: column;
      max-width: 200px;
      cursor: pointer;
      padding: 20px;
      border-radius: 5px;
      overflow: hidden;
      justify-content: space-around;

      &:hover {
        // Lighter blue gray
        background-color: #545974;
      }
    }
  }
}

@media (max-width: 768px) {
  .provider-selection-container {
    width: 100%;
    margin: 0;
    margin-top: calc(25% - 4rem);
    background: transparent;
  }
  .fullscreen-pane {
    background-image: url(../../../static/img/mobile-background.png);
    background-position: bottom;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}


</style>
