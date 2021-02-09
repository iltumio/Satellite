<template>
    <section class="fund-account-container">
      <p class="head">
        <strong>Fund your account</strong>
      </p>
      <p class="fund-account-message">
        You need to fund your account to register on the network.
        <br/><br />
        <i class="fas fa-circle-notch fa-pulse"></i> Waiting...
      </p>
      <div class="input-container">
        <WalletAddress :address="activeAccount"/>  
      </div>
    </section>
</template>

<script>
import WalletAddress from '@/components/common/WalletAddress';

export default {
  name: 'FundAccount',
  components: {
    WalletAddress,
  },
  data() {
    return { activeAccount: window.vault74provider.activeAccount };
  },
};
</script>

<style scoped lang="less">
.fund-account-container {
    text-align: center;
    width: 100%;
    background: rgba(10, 10, 10, 0.86);
    padding: 50px;
    border-radius: 15px;

    .head {
        font-family: 'Major Mono Display', monospace;
        font-size: 20pt;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .fund-account-message {
        font-weight: bold;
    }

    .input-container {
        padding: 2rem 0;
    }
}


</style>
