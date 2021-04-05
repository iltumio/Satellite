<template>
  <div>
    <p class="label">{{$t('settings.profile.change_username')}}</p>
    <input type="text" class="input" v-model="username" />
    <br>
    <br>
    <button class="button is-primary is-small change-photo" :disabled="!username.length >= 4" v-on:click="changeUsername">{{$t('settings.profile.change_username')}}</button>
    <div style="clear: both;"></div>
    <br>
    <p v-if="error" class="red">{{error}}</p>
  </div>
</template>

<script>
import Registry from '@/classes/contracts/Registry.ts';
import DwellerContract from '@/classes/contracts/DwellerContract.ts';
import config from '@/config/config';

export default {
  name: 'ChangeUsername',
  props: ['close', 'refresh'],
  data() {
    return {
      username: this.$store.state.username,
      error: false,
    };
  },
  methods: {
    async changeUsername() {
      // Create a registry contract instance
      const registry = new Registry(this.$ethereum, config.registry[config.network.chain]);
      const dwellerContractAddress = await registry.getDwellerContract(this.$ethereum.activeAccount);

      // Create a dweller contract instance
      const dwellerContract = new DwellerContract(this.$ethereum, dwellerContractAddress);

      this.$store.commit('setStatus', 'Transaction created, waiting for confirm');

      dwellerContract.setUsername(
        this.username,
        () => {
          this.close();
          this.$store.commit('setStatus', 'Transaction completed');
          this.$store.commit('username', this.username);
        },
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .change-photo {
    float: right;
  }
</style>
