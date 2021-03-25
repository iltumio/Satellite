<template>
  <div class="friend"  v-if="isFriend">
    <CircleIcon :image="friend.photo" :address="friend.address" />
    <span class="online-wrapper" v-if="friend.status">
      <p :class="`online ${(friend.status == 'alive') ? 'true' : ''}`"><i class="fa fa-circle"></i></p>
    </span>
    <div class="name-address">
      <p class="username">{{friend.name}}</p>
      <p class="address" v-if="!isMakingRequest(friend.address)">{{friend.address}}</p>
      <p class="address" v-else><i class="fa fa-spinner-third fa-spin"></i> Sending request...</p>
    </div>
    <button
      :disabled="isMakingRequest(friend.address)"
      v-if="action"
      class="button add-friend is-primary"
      v-on:click="action(friend.address)">
      <i class="fas fa-comment-alt-dots" v-if="!add"></i>
      <i class="fas fa-user-plus" v-else></i>
    </button>
    <!-- Object tag included so we can later configure the svg fill color for whatever theme is being used -->
    <!-- <object data="static/img/icons/friend-options.svg" type="image/svg+xml" class="friend-options-btn" v-on:click="toggleFriendOptions"> -->
      <img src="static/img/icons/friend-options.svg" v-on:click="toggleFriendOptions" class="friend-options-btn">
    <!-- </object> -->
    <div v-if="friendOptions" class="friend-options">
      <span>Voice Call</span>
      <span>Video Call</span>
      <span class="remove-friend-btn" v-on:click="toggleRemoveFriend()">Remove Friend</span>
    </div>
    <div v-if="confirmRemove" class="remove-friend-confirm">
      <p>Are you sure you want to remove this friend?</p>
      <div class="remove-friend-confirm-options">
        <span v-on:click="toggleFriendOptions" class="remove-cancel-btn">Cancel</span>
        <span v-on:click="removeFriendConfirmed(); removeFriend(friend);" class="remove-confirm-btn">Remove</span>
      </div>
    </div>
  </div>
</template>

<!--
  Friend.vue
  Represents a singular friend
-->
<script>
import CircleIcon from '@/components/common/CircleIcon';
import Badge from '@/components/common/Badge';
export default {
  name: 'Friend',
  props: [
    'action',
    'text',
    'friend',
    'makingRequest',
    'removeFriend',
    'add'
  ],
  components: {
    CircleIcon,
    Badge,
  },
  data() {
    return {
      friendOptions: false,
      confirmRemove: false,
      isFriend: true
    }
  },
  methods: {
    isMakingRequest(address) {
      return this.makingRequest && this.makingRequest[address];
    },
    toggleFriendOptions() {
      this.confirmRemove = false
      this.friendOptions = !this.friendOptions;
    },
    toggleRemoveFriend() {
      this.friendOptions = false
      this.confirmRemove = !this.confirmRemove;
    },
    removeFriendConfirmed() {
      this.isFriend = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Friend.less"></style>