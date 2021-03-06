<template>
    <!-- <section class="container">
        <input type="text" disabled value="prova" />
    </section> -->
    <div class="field has-addons" id="wallet-copy-button">
       <div 
          class="control" 
          v-clipboard:copy="address"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError">
        <a class="button is-primary">
          <i class="fas fa-copy"></i> &nbsp; &nbsp; Copy Account ID
        </a>
      </div>
    </div>
</template>

<script>
export default {
  name: 'WalletAddressMini',
  props: ['address'],
  methods: {
    copySuccess() {
      this.$toasted.show('ATTN: Address copied!', {
        type: 'success', icon: 'check-circle',
      });
    },
    copyError() {},
  },
};
</script>

<style scoped lang="less">
.container {
  background: #fff;
  border-radius: 4px;
  height: 50px;
  position: relative;

  .address-input {
      font-size: 15px;
      cursor: text !important;
  }
}
.field.has-addons {
  display: flex;
  justify-content: center;
}
</style>
