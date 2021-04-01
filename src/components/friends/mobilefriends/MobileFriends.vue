<template src="./MobileFriends.html"></template>

<!--
  Friends.vue
  List all friends a user has. Allows for searching and chatting
-->
<script>
import MobileNav from "@/components/sidebar/mobilenav/MobileNav";

import WalletAddressMini from "@/components/common/WalletAddressMini";
import QRDisplay from "@/components/common/QRDisplay";
import QRScan from "@/components/common/QRScan";

import Fuse from "fuse.js";

import config from "@/config/config";
import Friends from "@/classes/contracts/Friends.ts";
// Components
import CircleIcon from "@/components/common/CircleIcon";
import FriendRequests from "@/components/friends/mobilefriends/requests/FriendRequests";
// Classes
import DwellerCachingHelper from "@/classes/DwellerCachingHelper.ts";
import Friend from "@/components/friends/friend/Friend";
// import Ethereum from '@/classes/Ethereum';

export default {
  name: "MobileFriends",
  props: ["toggleSettings"],
  components: {
    CircleIcon,
    Friend,
    FriendRequests,
    WalletAddressMini,
    QRDisplay,
    QRScan,
    MobileNav,
  },
  data() {
    return {
      showShareQR: false,
      showScanQR: false,
      keyword: "",
      friends: Array.from(this.$store.state.friends),
      sortedFriends: false,
      error: false,
      success: false,
      friend: false,

      friendAddress: "",
      makingRequest: {},
      removingFriend: {},
      dwellerCachingHelper: new DwellerCachingHelper(
        this.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan
      ),
      friendsContract: null,
    };
  },
  mounted() {
    this.getAlphaSorted(this.friends);
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "addFriend" || mutation.type === "updateFriends") {
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
    toggleShareQR() {
      this.showShareQR = !this.showShareQR;
    },
    toggleScanQR() {
      this.showScanQR = !this.showScanQR;
    },
    setFriend(address) {
      this.friendAddress = address;
      this.addFriendQR();
    },
    getAlphaSorted(friends) {
      const map = friends.sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" })
      );
      let data = map.reduce((r, e) => {
        // get first letter of name of current element
        let alphabet = e.name[0].toUpperCase();

        // if there is no property in accumulator with this letter create it
        if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] };
        // if there is push current element to children array for that letter
        else r[alphabet].record.push(e);

        // return accumulator
        return r;
      }, {});
      this.sortedFriends = data;
    },
    update() {
      this.fetchFriendRequests();
      this.$store.dispatch("fetchFriends", this.$store.state.activeAccount);
    },
    getFriends() {
      this.friends = this.$store.state.friends;
    },
    /** @method
     * Get all the friend requests that are actively stored on chain
     * @name fetchFriendRequests
     */
    async fetchFriendRequests() {
      this.$store.dispatch("fetchFriendRequests");
    },
    /** @method
     * Remove friend
     * @name removeFriend
     * @argument friendAddress Friends ether address
     */
    async removeFriend(address) {
      this.removingFriend = {address: address, removed: false};
      await this.$WebRTC.disconnectFromPeer(address)
      await this.$store.dispatch("removeFriend", address);
      this.removingFriend = {address: address, removed: true};
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
          keys: ["name"],
        };
        const fuse = new Fuse(this.friends, options);
        const result = fuse.search(this.keyword);
        this.friends = result.map((i) => i.item);
      } else {
        this.addFriendQR();
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
      this.$store.commit('setMobileSidebar', true);
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
      this.$toasted.show("ATTN: Friend Added!", {
        type: "success",
        icon: "check-circle",
      });
      this.showScanQR = false;
    },
    /** @method
     * Do some checks to make sure the friend is valid
     * and then display them if they are found so they
     * can be confirmed and added
     * @name addFriend
     */
    async addFriendQR() {
      if (!this.$ethereum.utils.isAddress(this.friendAddress)) {
        this.$toasted.show("Invalid Address", {
          type: "error",
          icon: "check-circle",
        });
        return;
      }
      if (this.friendAddress === this.$store.state.activeAccount) {
        this.$toasted.show("You can't add yourself.", {
          type: "error",
          icon: "check-circle",
        });
        return;
      }
      if (
        this.$store.state.friends.filter(
          (f) => f.address === this.friendAddress
        ).length === 1
      ) {
        this.$toasted.show("You're already friends with this user.", {
          type: "error",
          icon: "check-circle",
        });
        return;
      }
      const friend = await this.dwellerCachingHelper.getDweller(
        this.friendAddress
      );
      if (!friend) {
        this.$toasted.show("Hmm, we couldn't find a user at that address", {
          type: "error",
          icon: "check-circle",
        });
        return;
      }
      this.error = false;
      this.friend = { ...friend, status: "unchecked" };
      await this.sendFriendRequest();
      this.showScanQR = false;
      this.$toasted.show("ATTN: Friend Found!", {
        type: "success",
        icon: "check-circle",
      });
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
<style scoped lang="less" src="./MobileFriends.less"></style>
