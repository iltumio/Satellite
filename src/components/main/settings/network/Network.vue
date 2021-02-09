<template>
  <div>
    <h3 class="label">{{$t('settings.network.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.network.heading')}}</h2>
        <p v-html="$t('settings.network.subtext')"/>
        <br>
        <div class="select">
          <select v-model="network" @change="networkChanged">
            <option value="default">{{$t('global.default')}}</option>
            <option value="infura">Infura</option>
            <option value="vault74">Satellite</option>
          </select>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Network',
  data() {
    return {
      network: localStorage.getItem('Satellite.provider') || 'default',
    };
  },
  methods: {
    networkChanged() {
      localStorage.setItem('Satellite.provider', this.network);
      window.location.reload();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
