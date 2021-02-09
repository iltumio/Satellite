<template>
</template>

<script>
import config from '@/config/config';

export default {
  name: 'BalanceFetcher',
  data() {
    return {
      interval: null, focusListener: null, blurListener: null, ethereum: null,
    };
  },
  methods: {
    async updateBalance() {
      if (this.ethereum) {
        const balance = await this.ethereum.getCurrentAccountBalance();

        this.$store.commit('updateBalance', balance);
      }
    },
    startInterval() {
      this.updateBalance();
      this.interval = setInterval(this.updateBalance, config.web3.balance_polling_interval);
    },
    stopInterval() {
      clearInterval(this.interval);
      this.interval = null;
    },
  },
  mounted() {
    this.ethereum = window.vault74provider;
    this.startInterval();
    this.focusListener = window.addEventListener('focus', this.startInterval);
    this.blurListener = window.addEventListener('blur', this.stopInterval);
  },
  beforeDestroy() {
    // Clear interval and turn listeners off
    this.stopInterval();
    window.removeEventListener('focus', this.focusListener);
    window.removeEventListener('blur', this.blurListener);
  },
};
</script>
