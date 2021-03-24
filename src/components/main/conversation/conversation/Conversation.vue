<template>
  <div>
    <Stickers v-if="$store.state.stickersOpen" :sendMessage="sendMessage" />
    <div id="scrollBottom" v-if="showScrollToBottom" v-on:click="scrollToEnd">
      <i class="fas fa-chevron-down"></i>
    </div>
    <div
      id="conversation"
      :class="`${mediaOpen ? 'media-open' : 'media-closed'} ${
        voice ? 'media-voice' : ''
      }`"
      ref="chat"
      :key="`${$store.state.activeChat}`"
      v-on:scroll="onScroll"
    >
      <div class="yellow encrypted">
        <i class="fas fa-key-skeleton"></i> &nbsp;
        {{ $t("conversation.encrypted") }}
      </div>
      <div
        v-for="messageGroup in grouper($store.state.messages)"
        v-bind:key="messageGroup[0].id"
      >
        <Divider
          :text="messageGroup[0].date"
          v-if="messageGroup[0].type == 'day-break'"
        />
        <MessageBody
          v-else
          :messages="messageGroup"
          :scrollToEnd="scrollToEndConditionally"
        />
      </div>
      <div style="clear: both"></div>
      <div
        id="typing"
        class="msg-wrapper"
        v-if="$store.state.typingUsers[$store.state.activeChat] && isMobile()"
        key="$store.state.typingUsers[$store.state.activeChat]"
      >
        <div class="arrow-left"></div>
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
  </div>
</template>

<!--
  conversation.vue
  This component houses the current active conversation
-->
<script>
import MessageUtils from "@/utils/MessageUtils";
import MessageBody from "@/components/main/conversation/message/messagebody/MessageBody";
import Divider from "@/components/common/Divider";
import Stickers from "@/components/common/stickers/Stickers";

import MobileUtils from "@/utils/Mobile.ts";

export default {
  name: "Conversation",
  props: ["messages", "sendMessage", "mediaOpen", "voice", "fetchMessages"],
  components: {
    MessageBody,
    Divider,
    Stickers,
  },
  data() {
    return {
      showScrollToBottom: false,
      scrollTimeout: false,
      subscribed: false,
      threadExists: false,
      messageCount: this.$store.state.messages.length,
    };
  },
  updated() {
    if (this.messageCount !== this.$store.state.messages.length) {
      this.messageCount = this.$store.state.messages.length;

      setTimeout(() => this.scrollToEnd(), 200);
    }
  },
  methods: {
    grouper: MessageUtils.group,
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile,
    doesThreadExist() {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        this.$store.state.activeChat
      );
      const threadID = this.$database.threadManager.fetchThread(id);
      return threadID;
    },
    /** @method
     * Rudementary scrolling to the bottom of the
     * div when a message comes in, or on other events
     * @name scrollToEnd
     */
    scrollToEnd() {
      const { chat } = this.$refs;
      if (!chat) return;
      setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
        this.showScrollToBottom = false;
      }, 50);
    },
    /** @method
     * Scrolls to the end if the user isn't looking through message
     * history to prevent annoying jumping
     * @name scrollToEndConditionally
     */
    scrollToEndConditionally() {
      const { chat } = this.$refs;
      if (!chat) return;
      if (chat.scrollTop - chat.scrollHeight > -750) {
        this.scrollToEnd();
      }
    },
    /** @method
     * If we've scrolled past a certain point we will
     * display the scroll to bottom button
     * @name onScroll
     */
    onScroll() {
      const { chat } = this.$refs;
      if (!chat) return;
      if (chat.scrollTop - chat.scrollHeight < -750) {
        this.showScrollToBottom = true;
      } else {
        this.showScrollToBottom = false;
      }
    },
    markRead() {
      // If we get a message update the last read messages to mark it as read
      this.$store.commit("markRead", this.$store.state.activeChat);
    },
  },
  watch: {
    mediaOpen: "scrollToEnd",
  },
  beforeDestroyed() {
    clearTimeout(this.scrollTimeout);
    // Close subscription
    this.subscribed();
  },
  mounted() {
    // This is to track changes in addresses, I couldn't find a way to do this with subscribe
    let lastChat = this.$store.state.activeChat;
    this.$nextTick(() => this.scrollToEnd());
    this.$store.subscribe((mutation) => {
      if (mutation.type === "activeChat") {
        this.$nextTick(() => this.scrollToEnd());
        this.markRead();

        if (lastChat !== mutation.payload) {
          lastChat = mutation.payload;
        }
      }
      if (mutation.type === "updateMessages") {
        this.scrollToEndConditionally();
        this.markRead();
      }
      if (mutation.type === "appendMessage") {
        this.scrollToEndConditionally();
        this.markRead();
      }
    });
    // Watch for threads, this can be removed in the future
    // when thread IDs are persistent
    const checkThread = () => {
      if (!this.doesThreadExist()) {
        this.threadExists = false;
        setTimeout(() => {
          checkThread();
        }, 3000);
      } else {
        this.threadExists = true;
      }
    };
    checkThread();
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="less">
.encrypted {
  width: 95%;
  text-align: center;
  margin-left: 2.5%;
  /* margin-bottom: 1rem; */
  font-size: 9pt;
  margin: 0.5rem 2.5% 1rem 2.5%;
  /* background-color: rgba(255,255,255, 0.1); */
  padding: 0.5rem;
  background: #16161e !important;
  border-radius: 3px;
}
.notification {
  margin-top: 4rem;
  padding: 0.6rem 0.8rem;
  button {
    margin: -0.15rem 0 0 0;
    float: right;
  }
}
#conversation {
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  bottom: 7.5rem;
  padding: 0.5rem 0.4rem;
  overflow-y: scroll;
  transition: top ease-in-out 0.05s;
  background: #f8f9fb;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}
.media-open {
  top: 23rem !important;
}
.media-voice {
  top: 16rem !important;
}
#scrollBottom {
  position: absolute;
  right: 2rem;
  bottom: 8rem;
  z-index: 2;
  background: #00d0a1;
  color: #fff;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}
#scrollBottom:hover {
  cursor: pointer;
  background: #02ddaa;
}
.msg-wrapper {
  background: #1a1b26;
  padding: 0.75rem 1rem 0.75rem 1rem;
  border-radius: 5px;
  position: relative;
  font-size: 18pt;
  width: 57px;
  line-height: 0;
  margin-left: 1rem;
}
.c-message-timestamp {
  text-align: right;
  width: 100%;
}
.arrow-left {
  width: 0;
  height: 0;
  position: absolute;
  left: -9px;
  top: 10px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #1a1b26;
}
</style>
