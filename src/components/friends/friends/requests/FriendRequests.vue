<template>
  <div>
    <div v-if="!this.friendRequests">
      {{$t('friends.requests.loading')}}
    </div>
    <div v-if="this.friendRequests.length === 0 || this.friendRequests.filter(fr => fr.active).length === 0">
      <span v-if="outgoing">{{$t('friends.requests.no-outgoing')}}</span>
      <span v-else>{{$t('friends.requests.no-incoming')}}</span>
    </div>
    <div class="requests" v-for="request in friendRequests" :key="request.id">
      <div class="friend request" v-if="!request.accepted && request.active">
        <div class="left">
          <h1 class="label name">{{request.sender.name}}</h1>
          <span class="address" v-if="!requestPending[request.id]">{{request.sender.address.substr(0, 24)}}...</span>
          <span class="address" v-else>
            <i class="fa fa-circle-notch fa-pulse"></i>  {{$t('friends.requests.updating')}}
          </span>
        </div>
        <div class="right">
          <button
            :disabled="requestPending[request.id]"
            class="button is-primary"
            v-on:click="acceptRequest(request.id)">
            <i class="fas fa-check"></i>
          </button>
          <button
            :disabled="requestPending[request.id]"
            class="button is-dark"
            v-on:click="denyRequest(request.id)">
              <i class="fas fa-times"></i>
          </button>
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
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';


export default {
  name: 'FriendRequests',
  props: [
    'action',
    'fetchFriendRequests',
    'friendRequests',
    'outgoing',
  ],
  data() {
    return {
      requestPending: {},
      friendsContract: null,
    };
  },
  mounted() {
    this.friendsContract = new Friends(this.$ethereum, config.friends[config.network.chain]);
    this.dwellerCachingHelper = new DwellerCachingHelper(
      this.$ethereum,
      config.registryAddress,
      config.cacher.dwellerLifespan,
    );
  },
  methods: {
    async acceptRequest(id) {
      const parsedId = parseInt(id, 0);
      if (!this.friendRequests) return;
      const [request] = this.friendRequests.filter(req => req.id === id);
      const threadID = request.threadHash;
      this.requestPending = Object.assign({}, this.requestPending, { [id]: true });
      this.friendsContract.acceptRequest(parsedId)
        .then(async () => {
          await this.$database.threadManager.storeThread(
            `${this.$store.state.activeAccount}-${request.sender.address}`,
            threadID,
          );
          // const friend = { ...request.sender, status: 'unchecked' };
          this.fetchFriendRequests();
          const friend = await this.dwellerCachingHelper.getDweller(request.sender.address);
          this.$store.commit('addFriend', {
            ...friend,
            threadID,
          });
          this.requestPending = Object.assign({}, this.requestPending, { [id]: false });
        })
        .catch((e) => {
          console.log("ACCEPT REQUEST ERROR",e)
          this.fetchFriendRequests();
          this.requestPending = Object.assign({}, this.requestPending, { [id]: false });
        });
    },
    async denyRequest(id) {
      const parsedId = parseInt(id, 0);
      this.friendsContract.denyRequest(this.$store.state.activeAccount, parsedId)
        .then(() => {
          this.fetchFriendRequests();
        })
        .catch(() => {
          this.fetchFriendRequests();
        });
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

  @media (max-width: 768px) {
    .requests {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    
    .request {
      width: 100%;
      max-width: unset;
      margin: 0.5rem 0;
    }

    .request .left {
      max-width: calc(100% - 8rem);
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .request .right {
      width: auto;
    }
  }
</style>
