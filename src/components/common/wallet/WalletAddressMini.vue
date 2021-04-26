<template>
  <div class="field has-addons" id="wallet-copy-button">
    <div
      :class="`control ${small ? 'full-width' : ''}`"
      v-clipboard:copy="address"
      v-clipboard:success="copySuccess"
      v-clipboard:error="copyError"
    >
      <a :class="`button is-primary ${small ? 'is-small' : ''}`">
        <i class="fas fa-copy"></i> &nbsp; &nbsp;
        {{ $t('wallet.copy-account-id') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletAddressMini',
  props: ['address', 'small'],
  methods: {
    copySuccess () {
      this.$toasted.show('ATTN: Address copied!', {
        type: 'success',
        icon: 'check-circle'
      })
    },
    copyError () {}
  }
}
</script>

<style scoped lang="less">
.is-small {
  width: 100%;
  margin-top: 1rem;
}
.full-width {
  width: 100%;
}
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
