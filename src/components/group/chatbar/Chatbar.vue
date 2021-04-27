<template src="./Chatbar.html"></template>

<!--
  Chatbar.vue
  The input box and clickable icons to manage emojis
  send Ether, upload files and send messages to users
-->
<script>
import debounce from 'debounce';

import data from '@/components/conversation/chatbar/emojidata.json';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import FileUpload from '@/components/common/fileupload/FileUpload';

const emojiIndex = new EmojiIndex(data);

export default {
  name: 'ChatGroup',
  props: ['handleNewMessage'],
  components: {
    Picker,
    FileUpload,
  },
  data() {
    return {
      messageText: '',
      selectingEmoji: false,
      emojiIndex,
      typing: false,
      payments: false,
      characters: 0,
      limit: 250,
      file: false,
      showFileUpload: false,
    };
  },
  methods: {
    /** @method
     * Handle the pasting of image files and start the upload of the file
     * @name handlePaste
     * @argument e paste DOM event
     */
    handlePaste(e) {
      for (let i = 0; i < e.clipboardData.items.length; i += 1) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          this.file = file;
          this.showFileUpload = true;
        }
      }
    },
    /** @method
     * When a file has been succesfully uploaded, show the uploader
     * @name openFileUpload
     */
    openFileUpload() {
      this.showFileUpload = true;
    },
    /** @method
     * Self explanatory, close the file uploader modal
     * @name closeFileUpload
     */
    closeFileUpload() {
      this.showFileUpload = false;
      this.file = false;
    },
    // Toggles the visibility of the mini payment window
    togglePayments() {
      this.payments = !this.payments;
    },
    // Toggles visibility of the emoji picker
    toggleEmoji() {
      this.selectingEmoji = !this.selectingEmoji;
    },
    // Send a plain text message from the chatbar to the parent component
    sendMessage() {
      if (this.messageText.replace(/\s+/g, '').length >= 1) {
        if (this.messageText.length > this.limit) {
          return;
        }
        this.$store.commit('chatWith', this.$store.state.activeChat);
        this.$WebRTC.connectIfNotConnected(this.$store.state.activeChat);
        this.handleNewMessage(this.messageText, 'text');
        this.messageText = '';
        this.stopTyping();
      }
    },
    startTyping() {
      if (!this.typing) {
        this.typing = true;
        const WebRTCUser = this.$WebRTC.find(this.$store.state.activeChat);
        if (WebRTCUser && WebRTCUser.isAlive) {
          WebRTCUser.send('typing-notice', true);
        }
      }
    },
    stopTyping() {
      this.typing = false;
      const WebRTCUser = this.$WebRTC.find(this.$store.state.activeChat);
      if (WebRTCUser && WebRTCUser.isAlive) {
        WebRTCUser.send('typing-notice', false);
      }
    },
    
    isTyping: debounce(function(e) {
      this.stopTyping();
    }, 2000),
    // Select an emoji from the emoji picker and append it to our message
    selectEmoji(emoji) {
      this.messageText += emoji.native;
      this.selectingEmoji = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Chatbar.less"></style>
