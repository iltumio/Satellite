<template src="./CreateGroup.html"></template>

<script>
import Fuse from 'fuse.js'

import GroupAddFriend from './GroupAddFriend'

export default {
  name: 'CreateGroup',
  data () {
    return {
      filter: '',
      selectedFriends: []
    }
  },
  components: {
    GroupAddFriend
  },
  methods: {
    /** @method
     * Filter friends by stored keyword and
     * rebind the friends data
     * @name filterFriends
     * @param keyword string keyword to search for
     */
    getFilteredFriends (keyword) {
      if (keyword) {
        const options = {
          includeScore: false,
          keys: ['name'],
          threshold: 0.2
        }
        const fuse = new Fuse(this.$store.state.friends, options)
        const result = fuse.search(keyword)
        return result.map(i => i.item).slice(0, 5)
      } else {
        return this.$store.state.friends.slice(0, 5)
      }
    },
    toggleSelectedFriend (address) {
      if (this.selectedFriends.includes(address)) {
        this.selectedFriends = this.selectedFriends.filter(fr => fr !== address)
      } else {
        this.selectedFriends.push(address)
      }
    }
  }
}
</script>

<style lang="less" src="./CreateGroup.less"></style>
