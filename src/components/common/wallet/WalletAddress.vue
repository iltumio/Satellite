<template>
  <div class="field has-addons">
    <div class="control" style="width: 100%;">
      <input
        type="text"
        class="input address-input"
        disabled
        autofocus
        :value="address"
      />
    </div>
    <div
      class="control"
      v-clipboard:copy="address"
      v-clipboard:success="copySuccess"
      v-clipboard:error="copyError"
    >
      <a class="button is-primary">
        <i class="fas fa-copy"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletAddress',
  props: ['address'],
  methods: {
    copySuccess () {
      this.$toasted.show('Address copied!', {
        type: 'success',
        icon: 'check-circle'
      })
    },
    copyError () {}
  }
}
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
</style>
