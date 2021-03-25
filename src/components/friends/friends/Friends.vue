<template src="./Friends.html"></template>

<!--
  Friends.vue
  List all friends a user has. Allows for searching and chatting
-->
<script>
import WalletAddressMini from "@/components/common/WalletAddressMini";

import Fuse from "fuse.js";

import config from "@/config/config";
// Components
import CircleIcon from "@/components/common/CircleIcon";
import FriendRequests from "@/components/friends/friends/requests/FriendRequests";
// Classes
import DwellerCachingHelper from "@/classes/DwellerCachingHelper.ts";
import Friend from "@/components/friends/friend/Friend";
import Friends from '@/classes/contracts/Friends.ts';

export default {
  name: "Friends",
  components: {
    CircleIcon,
    Friend,
    FriendRequests,
    WalletAddressMini,
  },
  data() {
    return {
      keyword: "",
      // friends: Array.from(this.$store.state.friends),
      error: false,
      success: false,
      friend: false,
      friendAddress: "",
      makingRequest: {},
      dwellerCachingHelper: new DwellerCachingHelper(
        this.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan
      ),
    };
  },
  mounted() {
    // this.$store.subscribe((mutation, state) => {
    //   if (mutation.type === "addFriend") {
    //     this.friends = state.friends;
    //   }
    // });

    this.friendsContract = new Friends(
      this.$ethereum,
      config.friends[config.network.chain]
    );

    this.update();
  },
  methods: {
    update() {
      this.fetchFriendRequests();
      this.$store.dispatch("fetchFriends", this.$store.state.activeAccount);
    },
    /** @method
     * Get all the friend requests that are actively stored on chain
     * @name fetchFriendRequests
     */
    async fetchFriendRequests() {
      this.$store.dispatch("fetchFriendRequests");
    },
    /** @method
     * Filter friends by stored keyword and
     * rebind the friends data
     * @name filterFriends
     * @param keyword string keyword to search for
     */
    getFilteredFriends(keyword) {
      if (keyword) {
        const options = {
          includeScore: false,
          keys: ["name"],
        };
        const fuse = new Fuse(this.$store.state.friends, options);
        const result = fuse.search(keyword);
        return result.map((i) => i.item);
      } else {
        return this.$store.state.friends;
      }
    },
    /** @method
     * Update all store values so to chat with the given client
     * @name chatFriend
     * @argument address client to chat with referenced by address
     */
    chatFriend(address) {
      this.$store.commit("newChat", address);
      this.$store.commit("activeChat", address);
      this.$store.commit("changeRoute", "main");
    },
    /** @method
     * Cleanup after adding a friend
     * @name reset
     */
    reset() {
      this.error = false;
      this.friendAddress = "";
      this.friend = false;
    },
    /** @method
     * Close the component and reroute to main
     * @name close
     */
    close() {
      this.$store.commit("changeRoute", "main");
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
        this.$store.state.friends.filter(
          (f) => f.address === this.friendAddress
        ).length === 1
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
      this.friend = { ...friend, status: "unchecked" };
    },
    /** @method
     * Remove friend
     * @name removeFriend
     * @argument friendAddress Friends ether address
     */
    /** @method
     * Remove friend
     * @name removeFriend
     * @argument friendAddress Friends ether address
     */
    async removeFriend(friend) {
      const friendAddress = friend.address
      console.log('Removing from store')
      console.log(this.$store.state.friends)
      console.log(this.$store.state.activeChats)
      this.$store.commit('removeFriend', friendAddress)
      this.friends = this.$store.state.friends
      console.log(this.$store.state.friends)
      console.log(this.$store.state.activeChats)
      console.log('Switching Active Chat')
      console.log(this.$store.state.activeChat)
      console.log(this.$store.state.activeChats)
      this.$store.state.activeChats.length > 0 ? this.$store.commit('activeChat', this.$store.state.activeChats[0]) : this.$store.commit('activeChat', false);
      console.log(this.$store.state.activeChat)
      console.log(this.$store.state.activeChats)
      console.log('Disconnecting from peer')
      await this.$WebRTC.disconnectFromPeer(friendAddress)
      console.log('Removing friend')
      await this.friendsContract.removeFriend(friendAddress)
      console.log('DONE')
      console.log('Remaining')
      console.log(this.$store.state.friends)
      console.log(this.friends)
      console.log(this.$store.state.activeChats)
      console.log(this.$store.state.activeChat)
      console.log(this.$store.state)
    },
    /** @method
     * Sends a friend request to the active friend
     * This will create a thread for the users as well if one does not exist
     * @name sendFriendRequest
     */
    async sendFriendRequest() {
      // TODO: update to receive the address as parameter
      const address = this.friendAddress;

      this.makingRequest = { ...this.makingRequest, [address]: true };

      await this.$store.dispatch("sendFriendRequest", { address });

      this.makingRequest = { ...this.makingRequest, [address]: false };

      this.reset();
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
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Friends.less"></style>
