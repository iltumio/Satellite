<template src="./Conversation.html"></template>

<!--
  conversation.vue
  This component houses the current active conversation
-->
<script>
import MessageUtils from '@/utils/MessageUtils'
import MessageBody from '@/components/conversation/message/messagebody/MessageBody'
import Divider from '@/components/common/Divider'
import Stickers from '@/components/common/stickers/Stickers'

import MobileUtils from '@/utils/Mobile.ts'

export default {
  name: 'Conversation',
  props: ['messages', 'sendMessage', 'mediaOpen', 'voice', 'fetchMessages'],
  components: {
    MessageBody,
    Divider,
    Stickers
  },
  data () {
    return {
      showScrollToBottom: false,
      scrollTimeout: false,
      subscribed: false,
      threadExists: false,
      messageCount: this.$store.state.messages.length
    }
  },
  updated () {
    if (this.messageCount !== this.$store.state.messages.length) {
      this.messageCount = this.$store.state.messages.length

      setTimeout(() => this.scrollToEnd(), 200)
    }
  },
  methods: {
    grouper: MessageUtils.group,
    // Returns if user device is mobile
    isMobile: MobileUtils.isMobile,
    doesThreadExist () {
      const id = this.$database.threadManager.makeIdentifier(
        this.$store.state.activeAccount,
        this.$store.state.activeChat
      )
      const threadID = this.$database.threadManager.fetchThread(id)
      return threadID
    },
    /** @method
     * Rudementary scrolling to the bottom of the
     * div when a message comes in, or on other events
     * @name scrollToEnd
     */
    scrollToEnd () {
      const { chat } = this.$refs
      if (!chat) return
      setTimeout(() => {
        chat.scrollTop = chat.scrollHeight
        this.showScrollToBottom = false
      }, 50)
    },
    /** @method
     * Scrolls to the end if the user isn't looking through message
     * history to prevent annoying jumping
     * @name scrollToEndConditionally
     */
    scrollToEndConditionally () {
      const { chat } = this.$refs
      if (!chat) return
      if (chat.scrollTop - chat.scrollHeight > -750) {
        this.scrollToEnd()
      }
    },
    /** @method
     * If we've scrolled past a certain point we will
     * display the scroll to bottom button
     * @name onScroll
     */
    onScroll () {
      const { chat } = this.$refs
      if (!chat) return
      if (chat.scrollTop - chat.scrollHeight < -750) {
        this.showScrollToBottom = true
      } else {
        this.showScrollToBottom = false
      }
    },
    markRead () {
      // If we get a message update the last read messages to mark it as read
      this.$store.commit('markRead', this.$store.state.activeChat)
    }
  },
  watch: {
    mediaOpen: 'scrollToEnd'
  },
  beforeDestroyed () {
    clearTimeout(this.scrollTimeout)
    // Close subscription
    this.subscribed()
  },
  mounted () {
    // This is to track changes in addresses, I couldn't find a way to do this with subscribe
    let lastChat = this.$store.state.activeChat
    this.$nextTick(() => this.scrollToEnd())
    this.$store.subscribe(mutation => {
      if (mutation.type === 'activeChat') {
        this.$nextTick(() => this.scrollToEnd())
        this.markRead()

        if (lastChat !== mutation.payload) {
          lastChat = mutation.payload
        }
      }
      if (mutation.type === 'updateMessages') {
        this.scrollToEndConditionally()
        this.markRead()
      }
      if (mutation.type === 'appendMessage') {
        this.scrollToEndConditionally()
        this.markRead()
      }
    })
    // Watch for threads, this can be removed in the future
    // when thread IDs are persistent
    const checkThread = () => {
      if (!this.doesThreadExist()) {
        this.threadExists = false
        setTimeout(() => {
          checkThread()
        }, 3000)
      } else {
        this.threadExists = true
      }
    }
    checkThread()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Conversation.less"></style>
