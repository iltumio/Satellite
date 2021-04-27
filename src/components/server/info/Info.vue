<template src="./Info.html"></template>

<script>
import Actions from './actions/Actions'
import Users from './users/Users'
import Files from './files/Files'

export default {
  name: 'Info',
  components: {
    Actions,
    Users,
    Files
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Info.less"></style>
