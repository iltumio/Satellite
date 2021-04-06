<template>
  <div>
    <div v-if="!$store.state.friendRequests">
      {{ $t('friends.requests.loading') }}
    </div>
    <div v-if="$store.state.friendRequests.length === 0">
      <span v-if="outgoing">{{ $t('friends.requests.no-outgoing') }}</span>
      <span v-else>{{ $t('friends.requests.no-incoming') }}</span>
    </div>
    <div
      class="requests"
      v-for="request in $store.state.friendRequests"
      :key="request.address"
    >
      <div class="friend request">
        <div class="left">
          <h1 class="label name">{{ request.name }}</h1>
          <span class="address" v-if="!requestPending[request.address]"
            >{{ request.address.substr(0, 24) }}...</span
          >
          <span class="address" v-else>
            <i class="fa fa-spinner-third fa-spin"></i>
            {{ $t('friends.requests.updating') }}
          </span>
        </div>
        <div class="right">
          <button
            :disabled="requestPending[request.address]"
            class="button is-success"
            v-on:click="acceptRequest(request.address)"
          >
            <i class="fas fa-check"></i>
          </button>
          <button
            :disabled="requestPending[request.address]"
            class="button is-dark"
            v-on:click="denyRequest(request.address)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <br />
      </div>
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
import config from '@/config/config'
import Friends from '@/classes/contracts/Friends.ts'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts'

export default {
  name: 'FriendRequests',
  props: ['action', 'fetchFriendRequests', 'friendRequests', 'outgoing'],
  data () {
    return {
      requestPending: {},
      friendsContract: null
    }
  },
  mounted () {
    this.friendsContract = new Friends(
      this.$ethereum,
      config.friends[config.network.chain]
    )
    this.dwellerCachingHelper = new DwellerCachingHelper(
      this.$ethereum,
      config.registryAddress,
      config.cacher.dwellerLifespan
    )
  },
  methods: {
    async acceptRequest (address) {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        address
      )

      this.makingRequest = Object.assign({}, this.makingRequest, {
        [address]: true
      })

      const threadId = await this.$database.threadManager.threadAt(id)

      this.requestPending = Object.assign({}, this.requestPending, {
        [address]: true
      })
      await this.$store.dispatch('acceptRequest', { address, threadId })
      this.requestPending = Object.assign({}, this.requestPending, {
        [address]: false
      })
    },
    async denyRequest (address) {
      this.$store.dispatch('denyRequest', { address })
    }
  }
}
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
