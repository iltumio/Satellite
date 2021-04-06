<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create a group</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="$store.commit('showCreateGroup', false)"
        ></button>
      </header>
      <section class="modal-card-body">
        <p>
          Creating a group allows you to chat with many friends at once. <br />
          Select a group of friends to start, you can always add more later!
        </p>
        <br />
        <span class="label">Group Name</span>
        <input type="text" class="input" placeholder="Enter a name..." />
        <br />
        <br />
        <span class="label">Select Friends</span>
        <input
          type="text"
          class="input"
          placeholder="Search Friends..."
          v-model="filter"
        />
        <div
          v-for="friend in getFilteredFriends(filter)"
          :key="friend.address"
          class="friend"
        >
          <GroupAddFriend
            :friend="friend"
            :add="toggleSelectedFriend"
            :active="selectedFriends.includes(friend.address)"
          />
        </div>
      </section>
    </div>
  </div>
</template>

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

<style>
.modal {
  z-index: 101;
}
.friend {
  margin-top: 0.5rem;
  padding: 0.4rem;
  border-radius: 4px;
}
</style>
