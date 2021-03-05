<template>
    <section class="fund-account-container">
      <p class="head">
        <strong>Fund your account</strong>
      </p>
      <p class="fund-account-message">
        You need to fund your account to register on the network.
        <br/>
      </p>
      <div class="input-container">
        <WalletAddressMini :address="activeAccount"/>  
      </div>
    </section>
</template>

<script>
import WalletAddressMini from '@/components/common/WalletAddressMini';

export default {
  name: 'FundAccount',
  components: {
    WalletAddressMini,
  },
  data() {
    return { activeAccount: this.$ethereum.activeAccount };
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
      font-family: 'Space Mono', monospace;  
      font-size: 20pt;
      padding-bottom: 1rem;     
      text-transform: uppercase;
    } 

    .input-container {
        padding: 2rem 0;
    }
}

@media (max-width: 768px) {
  .fund-account-container {
    width: 100%;
    margin: 0;
    margin-top: -4rem;
    background: transparent;
  }
}
</style>
