<template>
  <div>
    <div v-if="!this.friendRequests">
      Loading Requests...
    </div>
    <div v-if="this.friendRequests.length === 0">
      No Active Requests.
    </div>
    <div v-for="request in friendRequests" :key="request.id">
      <div class="friend request" v-if="!request.accepted && request.active">
        <div class="left">
          <h1 class="label name">{{request.sender.name}}</h1>
          <span class="address">{{request.sender.address.substr(0, 24)}}...</span>
        </div>
        <div class="right">
          <button class="button is-primary" v-on:click="acceptRequest(request.id)"><i class="fas fa-check"></i></button>
          <button class="button is-danger" v-on:click="denyRequest(request.id)"><i class="fas fa-times"></i></button>
        </div>
        <br>
      </div>
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
import config from '@/config/config';
import Friends from '@/classes/contracts/Friends.ts';

export default {
  name: 'FriendRequests',
  data() {
    return {
      friendsContract: null,
      friendRequests: false,
    };
  },
  mounted() {
    this.friendsContract = new Friends(config.friends[config.network.chain]);
    this.fetchFriendRequests();
  },
  methods: {
    async fetchFriendRequests() {
      this.friendRequests = [];
      const frIds = await this.friendsContract.getRequests(this.$store.state.activeAccount);
      frIds.forEach(async (id) => {
        const req = await this.friendsContract.getRequest(id);
        const parsed = await this.friendsContract.parseRequest(req);
        if (!this.friendRequests) this.friendRequests = [];
        this.friendRequests = [...this.friendRequests, parsed];
      });
    },
    async acceptRequest(id) {
      const parsedId = parseInt(id, 0);
      const [request] = this.friendRequests.filter(req => req.id === id);
      const threadID = request.threadHash;
      // TODO: save the thread hash
      console.log('threadID', threadID);
      await this.friendsContract.acceptRequest(this.$store.state.activeAccount, parsedId);
      this.fetchFriendRequests();
    },
    async denyRequest(id) {
      const parsedId = parseInt(id, 0);
      await this.friendsContract.denyRequest(this.$store.state.activeAccount, parsedId);
      this.fetchFriendRequests();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .request {
    width: calc(50% - 1rem);
    margin: 0 0.5rem 0.5rem 0.5rem;
    padding: 0.5rem 1rem 1rem;
    border-radius: 4px;
    float: left;
    display: block;
    height: 4.5rem;
    .button {
      width: 50px;
    }
    .name {
      font-size: 14pt;
      margin: 0 !important;
      padding: 0 !important;
    }
    .address {
      font-size: 9pt;
    }
    .left {
      float: left;
      width: calc(100% - 8rem);
    }
    .right {
      float: right;
      width: 7rem;
      padding-top: 0.5rem;
    }
  }
</style>
