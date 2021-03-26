<template>
  <div class="friend">
    <CircleIcon :image="friend.photo" :address="friend.address" />
    <span v-if="friend.status">
      <p :class="`online ${(friend.status == 'alive') ? 'true' : ''}`"><i class="fa fa-circle"></i></p>
    </span>
    <div class="name-address">
      <p class="username">{{friend.name}}</p>
      <p class="address" v-if="!isMakingRequest(friend.address)">{{friend.address}}</p>
      <p class="address" v-else><i class="fa fa-spinner-third fa-spin"></i> {{$t('friends.requests.sending')}}</p>
    </div>
    <button
      :disabled="isMakingRequest(friend.address)"
      v-if="action"
      class="button add-friend is-primary" 
      v-on:click="action(friend.address)">
      <i class="fas fa-comment-alt-dots" v-if="!add"></i>
      <i class="fas fa-user-plus" v-else></i>
    </button>
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
    'add'
  ],
  components: {
    CircleIcon,
    Badge,
  },
  methods: {
    isMakingRequest(address) {
      return this.makingRequest && this.makingRequest[address];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Friend.less"></style>
