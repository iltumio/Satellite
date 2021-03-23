<template src="./Main.html"></template>

<script>
import config from "@/config/config";
// import Friends from '@/classes/contracts/Friends.ts';
import DwellerCachingHelper from "@/classes/DwellerCachingHelper.ts";
import InfoBar from "@/components/main/conversation/infobar/InfoBar";
import Chatbar from "@/components/main/conversation/chatbar/Chatbar";
import VoiceVideo from "@/components/main/conversation/voicevideo/VoiceVideo";
import Conversation from "@/components/main/conversation/conversation/Conversation";
import NoConversation from "@/components/main/conversation/conversation/NoConversation";
import LoadingConvorsation from "@/components/main/conversation/conversation/LoadingConvorsation";
import UserInfo from "@/components/main/conversation/userinfo/UserInfo";
import Crypto from "@/classes/crypto/Crypto.ts";

import { Howl } from "howler";

const newMessage = new Howl({
  src: [`${config.ipfs.browser}${config.sounds.newMessage}`],
  loop: false,
  volume: 0.8,
  html5: true,
});

export default {
  name: "Main",
  components: {
    InfoBar,
    Chatbar,
    Conversation,
    LoadingConvorsation,
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
      crypto: new Crypto(),
      dwellerCachingHelper: new DwellerCachingHelper(
        this.$ethereum,
        config.registry[config.network.chain],
        config.cacher.dwellerLifespan
      ),
    };
  },
  methods: {
    async fetchMessages(remoteAddress) {
      const friend = this.$store.state.friends.find(
        (f) => f.address === remoteAddress
      );
      if (!friend) return;
      this.$store.commit("loadingMessages");
      const messages = await this.$database.messageManager.getMessages(
        friend.threadID
      );
      
      const decrypted = await this.$database.messageManager.bulkDecrypt(
        messages,
        friend.pubkey
      );
      this.$store.commit("updateMessages", decrypted);
    },
    // TODO: This should be removed in the future, we should pull
    // the thread ID from the friend object all over the app instead.
    bindThreads() {
      const { friends } = this.$store.state;
      friends.forEach(async (f) => {
        const threadID = await this.$database.threadManager.makeIdentifier(
          this.$store.state.activeAccount,
          f.address
        );
        this.$database.threadManager.storeThread(threadID, f.threadID);
      });
    },
    async subscribeToThreads() {
      // Iterate over all friends
      // TODO: In the future we may want to do this in a more repsonsible way.
      this.$store.state.friends.forEach(async (friend) => {
        // Generate our IDs
        const id = this.$database.threadManager.makeIdentifier(
          this.$store.state.activeAccount,
          friend.address
        );
        const existingThread = this.$database.threadManager.fetchThread(id);
        // If an existing thread is found stored, we'll subscribe to it.
        // In the future we should get this thread from the users contract.
        if (existingThread) {
          if (!this.subscribed[friend.address]) {
            // Open the thread
            const threadID = await this.$database.threadManager.threadAt(id);
            // Subscribe to thread events.
            const closer = await this.$database.messageManager.subscribe(
              threadID,
              async (update) => {
                // If we're recieving messages from a peer and they are not connected, try to connect.
                this.$WebRTC.connectIfNotConnected(update.instance.sender);
                if (update.instance.sender !== this.$store.state.activeChat) {
                  // Add an unread message indicator and if the user isn't in our sidebar,
                  // add a new chat group for them.
                  this.$store.commit("markUnread", update.instance.sender);
                  this.$store.commit("newChat", update.instance.sender);
                  newMessage.play();
                }
                if (friend.pubkey) {
                  const decrypted = await this.$database.messageManager.decryptMessage(
                    update.instance,
                    friend.pubkey
                  );
                  if (
                    update.instance.sender === this.$store.state.activeChat ||
                    update.instance.sender === this.$store.state.activeAccount
                  ) {
                    this.$store.commit("appendMessage", decrypted);
                  }
                } else if (
                  update.instance.sender === this.$store.state.activeChat ||
                  update.instance.sender === this.$store.state.activeAccount
                ) {
                  this.$store.commit("appendMessage", update.instance);
                }
              }
            );
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

    // TODO: Move all this somewhere more relevant...
    /** @method
     * Clear the usage of the audio devices
     * @name stopStream
     */
    stopStream() {
      if (!this.$streamManager) return;
      this.$streamManager.killStreams();
    },
    async makeCall() {
      if (this.$store.state.activeCall) {
        this.hangup();
      }
      const constraints = {
        audio: {
          autoGainControl: false,
          channelCount: 2,
          echoCancellation: this.$store.state.echoCancellation,
          latency: 0,
          noiseSuppression: this.$store.state.noiseSuppression,
          sampleRate: this.$store.state.audioQuality * 1000,
          sampleSize: this.$store.state.audioSamples,
          volume: 1.0,
        },
      };
      const stream = await this.$WebRTC.getMediaStream(constraints);
      this.$streamManager.addLocalStream(stream);
      this.$WebRTC.connectIfNotConnected(this.$store.state.activeChat);
      this.$WebRTC.call(
        this.$store.state.activeChat,
        this.$streamManager.localStreams[0]
      );
      if (this.$store.state.deafened) {
        this.$streamManager.toggleLocalStreams();
        this.$streamManager.toggleRemoteStreams();
      } else if (this.$store.state.muted) {
        this.$streamManager.toggleLocalStreams();
      }
      this.$store.commit("activeCall", this.$store.state.activeChat);
      this.voice = true;
      this.mediaOpen = true;
      // this.sendMessage(Date.now(), 'call');
    },
    callAnswered() {
      this.voice = true;
      this.mediaOpen = true;
    },
    hangup() {
      this.stopStream();
      const id = this.$store.state.incomingCall || this.$store.state.activeCall;
      this.$WebRTC.hangup(id);
      this.$store.commit("activeCall", false);
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
      const recipient = this.$store.state.friends.find(
          (friend) => friend.address === this.$store.state.activeChat
        );
      if (this.$database.messageManager) {
        const msg = this.$database.messageManager.buildMessage(
          this.$store.state.activeChat,
          Date.now(),
          'message',
          {
            type: type || 'text',
            data: type === 'text' ?
              encodeURI(data) : data,
          },
        );
        this.$store.commit('appendMessage', msg);
        const id = this.$database.threadManager
          .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
        const threadExists = await this.$database.threadManager.fetchThread(id);
        if (threadExists) {
          const threadID = await this.$database.threadManager.threadAt(id);
          // If we have their public key, we will encrypt their message
          this.$database.messageManager
            .addMessageDeterministically(threadID, msg, recipient.pubkey);
        }
      }
    },
    isMobile() {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    swipeHandler(direction) {
      if (this.isMobile()) {
        if (direction === "right") {
          //toggle for mobileSidebar
          if (!localStorage.hasOwnProperty("userSwiped")) {
            this.$store.commit("setMobileSidebar", true);
          } else if (
            localStorage.hasOwnProperty("userSwiped") &&
            localStorage.getItem("userSwiped") === "true"
          ) {
            //Logic to avoid users going from userInfo all the way to MobileSidebar in one swipe
            localStorage.setItem("userSwiped", false);
          } else {
            this.$store.commit("setMobileSidebar", true);
          }
        }
        if (direction === "left") {
          //toggle for userInfo
          localStorage.setItem("userSwiped", true);
          this.$store.commit("toggleUserInfo");
        }
      }
    },
  },
  mounted() {
    let lastChat = this.$store.state.activeChat;
    this.fetchMessages(lastChat);
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case "addFriend":
          this.subscribeToThreads();
          break;
        case "connectMediaStream":
          // Connect to new peer.
          if (state.activeMediaStreamPeer) {
            this.voice = true;
          }
          break;
        case "activeChat":
          if (lastChat !== mutation.payload) {
            lastChat = mutation.payload;
            this.$store.commit("loadingMessages");
            this.fetchMessages(mutation.payload);
          }
          break;
        default:
          break;
      }
    });
    const WebRTC = this.$WebRTC;
    WebRTC.subscribe(() => {
      this.hangup();
    }, ["REMOTE-HANGUP"]);
    WebRTC.mediaSubscription(
      ["INCOMING-CALL", "HANGUP", "ANSWER", "OUTGOING-CALL"],
      (event, identifier) => {
        switch (event) {
          case "ANSWER":
            this.callAnswered(identifier);
            break;
          default:
            break;
        }
      }
    );
    this.subscribeToThreads();
    // this.friendsContract = new Friends(config.friends[config.network.chain]);
    this.bindThreads();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Main.less"></style>
