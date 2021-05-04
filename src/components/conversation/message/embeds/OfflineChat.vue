<template src="./OfflineChat.html"></template>

<script>
export default {
  name: 'OfflineChat',
  props: ['message'],
  data () {
    return {
      doesExist: this.doesThreadExist()
    }
  },
  methods: {
    doesThreadExist () {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        this.$store.state.activeChat
      )
      const threadID = this.$database.threadManager.fetchThread(id)
      if (!threadID) return false
      const matches = this.$database.threadManager.threadMatches(
        id,
        this.message.data.threadID
      )
      return matches
    },
    storeThread () {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        this.$store.state.activeChat
      )
      this.$database.threadManager.storeThread(id, this.message.data.threadID)
      this.doesExist = this.doesThreadExist()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./OfflineChat.less"></style>
