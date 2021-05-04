<template src="./Contracts.html"></template>

<script>
import Prism from 'vue-prism-component'
import 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-solidity'

export default {
  name: 'Contracts',
  components: {
    Prism
  },
  data () {
    return {
      contract: 'registry'
    }
  },
  methods: {
    changeContract (contract) {
      this.contract = contract
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Contracts.less"></style>
