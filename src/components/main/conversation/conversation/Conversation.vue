<template>
  <div>
    <div id="scrollBottom" v-if="showScrollToBottom" v-on:click="scrollToEnd">
      <i class="fas fa-chevron-down"></i>
    </div>
    <div 
      id="conversation"
      :class="`${(mediaOpen) ? 'media-open' : 'media-closed'} ${(voice) ? 'media-voice' : ''}`"
      ref="chat"
      :key="`${$store.state.activeChat}`"
      v-on:scroll="onScroll">
        <div class="yellow encrypted">
          <i class="fas fa-key-skeleton"></i> &nbsp; {{$t("conversation.encrypted")}}
        </div>
        <div
          v-for="messageGroup in grouper($store.state.messages)" 
          v-bind:key="messageGroup[0].id">
          <Divider :text="messageGroup[0].date" v-if="messageGroup[0].type =='day-break'" />
          <MessageBody v-else :messages="messageGroup" :scrollToEnd="scrollToEndConditionally" />
        </div>
        <div style="clear:both;"></div>
        <div id="typing"
          class="msg-wrapper"
          v-if="$store.state.typingUsers[$store.state.activeChat] && isMobile()"
          key="$store.state.typingUsers[$store.state.activeChat]">
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
import MessageUtils from '@/utils/MessageUtils';
import MessageBody from '@/components/main/conversation/message/messagebody/MessageBody';
import Divider from '@/components/common/Divider';

export default {
  name: 'Conversation',
  props: [
    'messages',
    'sendMessage',
    'mediaOpen',
    'voice',
    'fetchMessages',
  ],
  components: {
    MessageBody,
    Divider,
  },
  data() {
    return {
      showScrollToBottom: false,
      scrollTimeout: false,
      subscribed: false,
      threadExists: false,
    };
  },
  methods: {
    grouper: MessageUtils.group,
    // Returns if user device is mobile
    isMobile() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
    doesThreadExist() {
      const id = this.$database.threadManager
        .makeIdentifier(this.$store.state.activeAccount, this.$store.state.activeChat);
      const threadID = this.$database.threadManager
        .fetchThread(id);
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
      this.$store.commit('markRead', this.$store.state.activeChat);
    },
  },
  watch: {
    mediaOpen: 'scrollToEnd',
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
      if (mutation.type === 'activeChat') {
        this.$nextTick(() => this.scrollToEnd());
        this.markRead();

        if (lastChat !== mutation.payload) {
          lastChat = mutation.payload;
        }
      }
      if (mutation.type === 'updateMessages') {
        this.scrollToEndConditionally();
        this.markRead();
      }
      if (mutation.type === 'appendMessage') {
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
    border-right:10px solid #1a1b26; 
  }
</style>
