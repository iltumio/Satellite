<template src="./Payment.html"></template>

<script>
import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'Payment',
  props: ['active', 'toggle', 'person'],
  components: {
    CircleIcon
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Payment.less"></style>
