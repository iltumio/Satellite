<template src="./MobileFriends.html"></template>

<!--
  Friends.vue
  List all friends a user has. Allows for searching and chatting
-->
<script>
import WalletAddressMini from '@/components/common/WalletAddressMini';

import Fuse from 'fuse.js';

import config from '@/config/config';
import Friends from '@/classes/contracts/Friends.ts';
// Components
import CircleIcon from '@/components/common/CircleIcon';
import FriendRequests from '@/components/friends/mobilefriends/requests/FriendRequests';
// Classes
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import Friend from '@/components/friends/friend/Friend';
// import Ethereum from '@/classes/Ethereum';

export default {
  name: 'MobileFriends',
  components: {
    CircleIcon,
    Friend,
    FriendRequests,
    WalletAddressMini
  },
  data() {
    return {
      keyword: '',
      friends: Array.from(this.$store.state.friends),
      sortedFriends: false,
      error: false,
      success: false,
      friend: false,

      friendAddress: '',
      makingRequest: {},
      dwellerCachingHelper: new DwellerCachingHelper(
        this.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan
      ),
      friendsContract: null
    };
  },
  mounted() {
    this.getAlphaSorted(this.friends);
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addFriend') {
        this.friends = state.friends;
        this.getAlphaSorted(this.friends);
      }
    });
    this.friendsContract = new Friends(
      this.$ethereum,
      config.friends[config.network.chain]
    );

    this.update();
  },
  methods: {
    getAlphaSorted(friends) {
      const map = friends.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
      let data = map.reduce((r, e) => {
      
        // get first letter of name of current element
        let alphabet = e.name[0];
      
        // if there is no property in accumulator with this letter create it
        if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] }
      
        // if there is push current element to children array for that letter
        else r[alphabet].record.push(e);
      
        // return accumulator
        return r;
      }, {});
      console.log('data', data);
      this.sortedFriends = data;
    },
    update() {
      this.fetchFriendRequests();
      this.$store.dispatch('fetchFriends', this.$store.state.activeAccount);
    },
    getFriends() {
      this.friends = this.$store.state.friends;
    },
    /** @method
     * Get all the friend requests that are actively stored on chain
     * @name fetchFriendRequests
     */
    async fetchFriendRequests() {
      this.$store.dispatch('fetchFriendRequests');
    },
    /** @method
     * Filter friends by stored keyword and
     * rebind the friends data
     * @name filterFriends
     */
    filterFriends() {
      if (this.keyword) {
        const options = {
          includeScore: false,
          keys: ['name']
        };
        const fuse = new Fuse(this.friends, options);
        const result = fuse.search(this.keyword);
        this.friends = result.map(i => i.item);
      } else {
        this.getFriends();
      }
    },
    /** @method
     * Update all store values so to chat with the given client
     * @name chatFriend
     * @argument address client to chat with referenced by address
     */
    chatFriend(address) {
      this.$store.commit('newChat', address);
      this.$store.commit('activeChat', address);
      this.$store.commit('changeRoute', 'main');
    },
    /** @method
     * Cleanup after adding a friend
     * @name reset
     */
    reset() {
      this.error = false;
      this.friendAddress = '';
      this.friend = false;
    },
    /** @method
     * Close the component and reroute to main
     * @name close
     */
    close() {
      this.$store.commit('changeRoute', 'main');
    },
    /** @method
     * Do some checks to make sure the friend is valid
     * and then display them if they are found so they
     * can be confirmed and added
     * @name addFriend
     */
    async addFriend() {
      if (!this.$ethereum.utils.isAddress(this.friendAddress)) {
        this.error = "Whoops, that's not a valid address";
        return;
      }
      if (this.friendAddress === this.$store.state.activeAccount) {
        this.error = "You can't add yourself you silly goose.";
        return;
      }
      if (
        this.$store.state.friends.filter(f => f.address === this.friendAddress)
          .length === 1
      ) {
        this.error = "You're already friends with this user.";
        return;
      }
      const friend = await this.dwellerCachingHelper.getDweller(
        this.friendAddress
      );
      if (!friend) {
        this.error = "Hmm, we couldn't find a user at that address";
        return;
      }
      this.error = false;
      this.friend = { ...friend, status: 'unchecked' };
    },
    /** @method
     * Sends a friend request to the active friend
     * This will create a thread for the users as well if one does not exist
     * @name sendFriendRequest
     */
    async sendFriendRequest() {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        this.friendAddress
      );

      this.makingRequest = Object.assign({}, this.makingRequest, {
        [this.friendAddress]: true
      });
      const threadID = await this.$database.threadManager.threadAt(id);

      this.friendsContract
        .makeRequest(this.friendAddress, threadID.toString())
        .then(() => {
          this.reset();
          this.getFriends();
        })
        .catch(e => {
          this.makingRequest = Object.assign({}, this.makingRequest, {
            [this.friendAddress]: false
          });
        });
    },
    /** @method
     * Confirms and adds a found friend
     * @name commitFriend
     */
    commitFriend() {
      this.update();
      this.success = `${this.friend.name} has been added to your friendslist.`;
      setTimeout(() => {
        this.success = false;
      }, 2000);
      this.reset();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./MobileFriends.less"></style>
