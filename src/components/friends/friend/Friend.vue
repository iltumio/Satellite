<template>
  <div class="friend" v-if="isFriend">
    <div
      class="mobileOptions"
      v-if="containsOptions && isMobile() && showOptions"
      v-on:click="showOptions = false"
    >
      <div class="friendOptions">
        <button class="button is-primary" v-on:click="action(friend.address)">
          <i class="fas fa-comment-alt-dots"></i>
          &nbsp; Message
        </button>
        <button
          class="button is-danger"
          v-on:click="removeFriend(friend.address)"
        >
          <i class="fa fa-times"></i>
          &nbsp; Remove
        </button>
      </div>
    </div>
    <div class="columns is-mobile" v-on:click="showFriendOptions">
      <div class="column pfp-column">
        <CircleIcon :image="friend.photo" :address="friend.address" />
        <span class="online-wrapper" v-if="friend.status">
          <p
            :class="
              `online ${this.isFriendConnected(friend.address) ? 'true' : ''}`
            "
          >
            <i class="fa fa-circle"></i>
          </p>
        </span>
      </div>
      <div
        :class="`column friend-details ${add ? 'friend-details-smaller' : ''}`"
      >
        <p class="username">{{ friend.name }}</p>
        <p class="address" v-if="!isMakingRequest(friend.address)">
          {{ friend.statusMsg }}
        </p>
        <p class="address" v-if="isRemovingFriend(friend.address)">
          <i class="fa fa-spinner-third fa-spin"></i> Removing friend ...
        </p>
        <p class="address" v-if="isMakingRequest(friend.address)">
          <i class="fa fa-spinner-third fa-spin"></i>
          {{ $t('friends.requests.sending') }}
        </p>
      </div>
      <div
        :class="
          `column buttons-container ${add ? 'buttons-container-smaller' : ''}`
        "
      >
        <button
          v-if="action && !add"
          class="button remove-friend is-danger"
          v-on:click="removeFriend(friend.address)"
        >
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        <button
          :disabled="isMakingRequest(friend.address)"
          v-if="action"
          class="button add-friend is-primary"
          v-on:click="action(friend.address)"
        >
          <i class="fas fa-comment-alt-dots" v-if="!add"></i>
          <i class="fas fa-user-plus" v-else></i>
        </button>
      </div>
    </div>
  </div>
</template>

<!--
  Friend.vue
  Represents a singular friend
-->
<script>
import CircleIcon from '@/components/common/CircleIcon'
import Badge from '@/components/common/Badge'
import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Friend',
  props: [
    'action',
    'text',
    'friend',
    'makingRequest',
    'removeFriend',
    'add',
    'containsOptions',
    'removingFriend'
  ],
  components: {
    CircleIcon,
    Badge
  },
  watch: {
    removingFriend (newValue) {
      if (
        newValue.address === this.friend.address &&
        newValue.removed === true
      ) {
        this.isFriend = false
      }
    }
  },
  data () {
    return {
      friendOptions: false,
      confirmRemove: false,
      isFriend: true,
      showOptions: false
    }
  },
  methods: {
    isMobile: MobileUtils.isMobile,
    isMakingRequest (address) {
      return this.makingRequest && this.makingRequest[address]
    },
    toggleFriendOptions () {
      this.confirmRemove = false
      this.friendOptions = !this.friendOptions
    },
    toggleRemoveFriend () {
      this.friendOptions = false
      this.confirmRemove = !this.confirmRemove
    },
    isRemovingFriend (address) {
      return this.removingFriend && this.removingFriend.address === address
    },
    showFriendOptions () {
      if (this.isMobile()) {
        this.showOptions = true
      }
    },
    isFriendConnected (address) {
      console.log('checking if connected', address)
      return Boolean(this.$store.state.connectedPeers[address])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Friend.less"></style>
