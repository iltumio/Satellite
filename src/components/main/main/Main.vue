<template src="./Main.html"></template>

<script>
import config from '@/config/config';
import Friends from '@/classes/contracts/Friends.ts';
import DwellerCachingHelper from '@/classes/DwellerCachingHelper.ts';
import InfoBar from '@/components/main/conversation/infobar/InfoBar';
import Chatbar from '@/components/main/conversation/chatbar/Chatbar';
import VoiceVideo from '@/components/main/conversation/voicevideo/VoiceVideo';
import Conversation from '@/components/main/conversation/conversation/Conversation';
import NoConversation from '@/components/main/conversation/conversation/NoConversation';
import UserInfo from '@/components/main/conversation/userinfo/UserInfo';

export default {
  name: 'Main',
  components: {
    InfoBar,
    Chatbar,
    Conversation,
    VoiceVideo,
    NoConversation,
    UserInfo,
  },
  data() {
    return {
      mediaOpen: false,
      voice: false,
      playCallSoundTimer: null,
      subscribed: {},
      friends: [],
      dwellerCachingHelper: new DwellerCachingHelper(
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan,
      ),
    };
  },
  methods: {
    /** @method
     * Get friends stored on chain
     * @name getFriends
     */
    async getFriends() {
      this.friends = [];
      let friends = await this.friendsContract.getFriends(this.$store.state.activeAccount);
      friends = friends.map(f => f[0]);
      friends.forEach(async (f) => {
        const friend = await this.dwellerCachingHelper.getDweller(f);
        this.friends = [...this.friends, friend];
        this.$store.commit('addFriend', friend);
      });
    },
    async fetchMessages(id, friend) {
      const threadID = await this.$database.threadManager.threadAt(id);
      const messages = await this.$database.messageManager.getMessages(threadID);
      if (window.Vault74.messageBroker) {
        window.Vault74.messageBroker.setConvo(
          `${this.$store.state.activeAccount}::${friend.address}`,
          messages,
        );
      }
    },
    async subscribeToThreads() {
      this.$store.state.friends.forEach(async (friend) => {
        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, friend.address);
        const existingThread = this.$database.threadManager
          .fetchThread(id);
        if (existingThread) {
          this.fetchMessages(id, friend);
          if (!this.subscribed[friend.address]) {
            const threadID = await this.$database.threadManager.threadAt(id);
            const closer = await this.$database.messageManager.subscribe(threadID, () => {
              this.fetchMessages(id, friend);
            });
            this.subscribed[friend.address] = closer;
          }
        }
      });
    },
    // Switch from one media stream to another
    switchTo(voice = false) {
      this.mediaOpen = true;
      this.voice = voice;
    },
    makeCall() {
      this.$store.commit('connectMediaStream', this.$store.state.activeChat);
      window.Vault74.Peer2Peer.call(this.$store.state.activeChat);
      this.voice = true;
      this.mediaOpen = true;
    },
    hangup() {
      window.Vault74.Peer2Peer.hangup();
      window.Vault74.Peer2Peer.send(this.$store.state.activeChat, 'call-status', 'ended');
      this.voice = false;
      this.mediaOpen = false;
    },
    // Enter a voice or video call
    toggleMedia(voice = false) {
      this.voice = voice;
      this.mediaOpen = !this.mediaOpen;
      if (!this.mediaOpen) {
        this.voice = false;
      }
    },
    // Send a message in the chat, this will probably
    // be rewritten when the chat is functional
    async sendMessage(data, type) {
      if (window.Vault74.messageBroker) {
        const msg = window.Vault74.messageBroker.sentMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data: type === 'text' ?
              encodeURI(data) : data,
          },
        );
        window.Vault74.Peer2Peer.send(
          this.$store.state.activeChat,
          'message',
          {
            type: type || 'text',
            data: type === 'text' ?
              encodeURI(data) : data,
          },
        );
        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
        const threadExists = await this.$database.threadManager.fetchThread(id);
        if (threadExists) {
          const threadID = await this.$database.threadManager.threadAt(id);
          const message = {
            _id: msg.id,
            sender: msg.sender,
            at: msg.at,
            type: msg.type,
            payload: msg.payload,
          };
          this.$database.messageManager.addNewMessage(threadID, message);
        }
      }
    },
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'connectMediaStream') {
        // Connect to new peer.
        if (state.activeMediaStreamPeer) {
          this.voice = true;
        }
      }
    });
    this.subscribeToThreads();
    this.friendsContract = new Friends(config.friends[config.network.chain]);
    this.getFriends();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Main.less"></style>
