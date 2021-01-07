<template>
  <div>
    <h3 class="label">{{$t('settings.accounts.label')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.accounts.heading')}}</h2>
        <p>{{$t('settings.accounts.subtext')}}</p>
        <br>
        <p><b>{{$t('settings.accounts.balance')}}:</b> {{+(Math.round($store.state.balance + "e+3")  + "e-3")}} ETH</p>
        <div class="select" v-if="$store.state.accounts">
          <select v-model="$store.state.activeAccount">
            <option v-for="account in $store.state.accounts" :key="account">{{account}}</option>
          </select>
        </div>
        <hr class="spacer">
        <h2>{{$t('settings.accounts.gas_price')}} (Gwei)</h2>
        <p>{{$t('settings.accounts.gas_price_desc')}}</p>
        <br>
        <input v-model="$store.state.gasPrice" class="input" />
      </div>
    </article>
    <h3 class="label">{{$t('settings.accounts.devices')}}</h3>
    <article class="message is-dark">
      <div class="message-body">
        <h2>{{$t('settings.accounts.connected_devices')}}</h2>
        <p>{{$t('settings.accounts.none')}}</p>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Accounts',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
