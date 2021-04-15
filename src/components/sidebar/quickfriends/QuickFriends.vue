<template>
  <div class="modal-card bordered" v-click-outside="close">
    <div class="modal-card-head">
      <p class="header">
        <span class="label">{{
          $t('sidebar.quickfriends.chat_with_friends')
        }}</span>
        <span class="close" v-on:click="close">×</span>
        <input
          class="input is-small searchuser"
          type="text"
          v-model="keyword"
          v-on:keyup="filterFriends"
          :placeholder="$t('sidebar.quickfriends.search_placeholder')"
        />
      </p>
    </div>
    <div class="modal-card-body">
      <div class="friends-list">
        <div
          v-if="!this.$store.state.friends.length"
          style="text-align: center"
        >
          <span class="label">{{
            $t('sidebar.quickfriends.no_friends_yet')
          }}</span>
          <span>{{ $t('sidebar.quickfriends.add_some_friends') }}</span>
        </div>
        <div v-if="this.$store.state.friends.length && !friends.length">
          <span class="label">{{ $t('sidebar.quickfriends.no_results') }}</span>
        </div>
        <div v-for="friend in friends" class="friend" :key="friend.address">
          <div class="columns">
            <div class="column is-one-quarter quick-friends-photo">
              <CircleIcon :image="friend.photo" :address="friend.address" />
            </div>
            <div class="column is-half nameholder">
              <p>
                {{ friend.name }}<br />
                <span class="address">{{ friend.address }}</span>
              </p>
            </div>
            <div class="column is-one-quarter">
              <button
                class="button is-small is-primary quick-friends-chat"
                v-on:click="handleChat(friend)"
              >
                <i class="fas fa-comment-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

import CircleIcon from '@/components/common/CircleIcon'

export default {
  name: 'QuickFriends',
  props: ['close'],
  components: {
    CircleIcon
  },
  data () {
    return {
      keyword: '',
      friends: this.$store.state.friends
    }
  },
  methods: {
    /** @method
     * Create chat with given friend
     * @name handleChat
     * @argument fr friend to chat with
     */
    handleChat (fr) {
      this.$store.commit('newChat', fr.address)
      // this.$store.commit('activeChat', fr.address)
      this.$store.dispatch('setActiveChat', { friendAddress: fr.address })

      this.$store.commit('changeRoute', 'main')
      this.close()
      this.$nextTick(() => {
        setTimeout(() => {
          this.$store.commit('setMobileSidebar', false)
        }, 0)
      })
    },
    /** @method
     * Search through friends and update
     * local friends object with filtered friends
     * @name filterFriends
     */
    filterFriends () {
      if (this.keyword) {
        const options = {
          includeScore: false,
          keys: ['name']
        }
        const fuse = new Fuse(this.$store.state.friends, options)
        const result = fuse.search(this.keyword)
        this.friends = result.map(i => i.item)
      } else {
        this.friends = this.$store.state.friends
      }
    }
  },

  directives: {
    'click-outside': {
      bind: (el, binding) => {
        let clickedOffOnce = false
        // Define ourClickEventHandler
        const ourClickEventHandler = event => {
          if (!el.contains(event.target) && el !== event.target) {
            if (clickedOffOnce) {
              // as we are attaching an click event listern to the document (below)
              // ensure the events target is outside the element or a child of it
              binding.value(event) // before binding it
            }
          }
          clickedOffOnce = true
        }
        // attached the handler to the element so we can remove it later easily
        el.__vueClickEventHandler__ = ourClickEventHandler

        // attaching ourClickEventHandler to a listener on the document here
        document.addEventListener('click', ourClickEventHandler)
      },
      unbind: function (el) {
        // Remove Event Listener
        document.removeEventListener('click', el.__vueClickEventHandler__)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.address {
  font-size: 8pt;
}
.friend {
  margin: 1.3rem 0;
  padding: 0 0.5rem;
  border-radius: 5px;
}
button {
  height: 100%;
}
.circle-icon {
  height: 35px;
  width: 35px;
}
.friends-list {
  height: 230px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
}
.nameholder {
  padding-top: 0.8rem;
  overflow: hidden;
  line-height: 90%;
  white-space: nowrap;
  display: block;
  text-overflow: ellipsis;
}
.modal-card {
  position: absolute;
  z-index: 10;
  width: 300px;
  top: 9.5rem;
  right: -285px;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
}

.modal-card-body {
  padding: 0.5rem 1rem 1rem 1rem;
}
.modal-card-head {
  padding: 0.5rem 1rem;
}
.header {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
}
.close {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

@media (max-width: 768px) {
  .friends-list .friend .columns {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .friends-list {
    height: 100% !important;
  }

  .quick-friends-photo {
    max-width: 80px;
  }

  .quick-friends-chat {
    float: right;
    padding: 0.55rem 1rem;
    font-size: 11pt;
  }

  .close {
    font-size: 18pt;
  }

  .header .label {
    font-size: 14pt;
  }
}
</style>
