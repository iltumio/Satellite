<template>
  <div
    id="user-info"
    v-touch:swipe="swipeHandler"
    v-touch-options="{
      touchHoldTolerance: 50,
      swipeTolerance: 80
    }"
    class="animate__animated animate__slideInRight animate__faster"
  >
    <i
      class="fa fa-times close-btn"
      v-on:click="$store.commit('toggleUserInfo')"
    ></i>
    <div class="heading">
      <span class="label">{{ $t('conversation.userinfo.heading') }}</span>
      <span class="username">{{
        $store.state.friends.filter(
          f => f.address === $store.state.activeChat
        )[0].name
      }}</span>
    </div>
    <hr class="divider" />
    <div class="user-details">
      <CircleIcon
        :image="
          $store.state.friends.filter(
            f => f.address === $store.state.activeChat
          )[0].photo
        "
        :address="$store.state.activeChat"
      />
      <p class="username">
        {{
          $store.state.friends.filter(
            f => f.address === $store.state.activeChat
          )[0].name
        }}
      </p>
      <p class="address">{{ $store.state.activeChat.substr(0, 12) }}...</p>
      <hr class="divider" />
      <span class="label">{{ $t('conversation.userinfo.badges') }}</span>
      <Badge :address="$store.state.activeChat" showNoBadges="true" />
      <hr class="divider" />
    </div>
    <div class="columns buttons">
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="messageUser($store.state.activeChat)"
        >
          <i class="fas fa-comment-alt"></i>
        </button>
      </div>
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="makeCall($store.state.activeChat)"
        >
          <i class="fas fa-phone-volume"></i>
        </button>
      </div>
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="etherscan($store.state.activeChat)"
        >
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <div class="notes">
      <span class="label">{{ $t('conversation.userinfo.notes') }}</span>
      <textarea
        class="textarea"
        :placeholder="$t('conversation.userinfo.notes_placeholder')"
        v-model="$store.state.userNotes[$store.state.activeChat]"
      ></textarea>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/common/Badge'
import CircleIcon from '@/components/common/CircleIcon'
import config from '@/config/config'
import { getExplorerByNetwork } from '@/utils/EthereumProvider.ts'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'UserInfo',
  props: ['makeCall', 'toggle'],
  components: {
    CircleIcon,
    Badge
  },
  methods: {
    /** @method
     * Wrap links in <a> tags
     * @name wrapLinks
     * @argument message string to wrap links in
     * @returns string value of formatted message
     */
    messageUser (user) {
      // this.$store.commit('activeChat', user)
      this.$store.dispatch('setActiveChat', { friendAddress: user })
    },
    /** @method
     * Opens an etherscan link to the given address
     * @name etherscan
     * @argument address address to open to
     */
    etherscan (address) {
      window.open(
        `${getExplorerByNetwork(config.network.chain)}/address/${address}`
      )
    },
    isMobile: MobileUtils.isMobile,
    swipeHandler (direction) {
      if (this.isMobile()) {
        if (direction === 'right') {
          this.$store.commit('toggleUserInfo')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.close-btn {
  display: none;
}
#user-info {
  overflow-y: scroll;
  scrollbar-width: thin;
  padding: 0.5rem 1rem 1rem 1rem;
  width: 15rem;
  position: absolute;
  bottom: 2rem;
  top: 3rem;
  right: 0;

  .heading {
    width: 100%;
    line-height: 110%;
    .username {
      font-size: 8pt;
    }
    .label {
      padding: 0 !important;
    }
  }
  .user-details {
    margin-top: 1rem;
    text-align: center;
    .circle-icon {
      width: 75px;
      height: 75px;
      border-radius: 5px;
    }
    .username {
      margin-top: 1rem;
      font-size: 15pt;
    }
    .address {
      font-size: 10pt !important;
    }
  }
  .buttons {
    margin-top: 2rem;
    button {
      width: 100%;
    }
    .column {
      text-align: center;
    }
  }

  textarea {
    font-size: 10pt;
  }
}
.badge-container i {
  font-size: 18pt !important;
}

@media (max-width: 768px) {
  #user-info {
    width: 100%;
    z-index: 20;
    bottom: 0;
  }
  .close-btn {
    display: inline-block;
    position: absolute;
    right: 1.5rem;
    top: 1rem;
  }
}
</style>
