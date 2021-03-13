<template src="./Chatbar.html"></template>

<!--
  Chatbar.vue
  The input box and clickable icons to manage emojis
  send Ether, upload files and send messages to users
-->
<script>
import debounce from 'debounce';

import data from '@/components/main/conversation/chatbar/emojidata.json';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast';
import MiniPayment from '@/components/common/payments/minipayment/MiniPayment';
import MiniPaymentMobile from '@/components/common/payments/minipaymentmobile/MiniPaymentMobile';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import FileUpload from '@/components/common/fileupload/FileUpload';

const emojiIndex = new EmojiIndex(data);

export default {
  name: 'ChatGroup',
  props: ['handleNewMessage'],
  components: {
    Picker,
    MiniPayment,
    MiniPaymentMobile,
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
  mounted() {
    let messageBox = document.querySelector('.messageuser')
    messageBox.style.setProperty("background", "transparent", "important");
  },
  methods: {
    isMobile() {
    	var check = false;
      // eslint-disable-next-line
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
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
        this.handleNewMessage(this.messageText, 'text');
        this.messageText = '';
        this.stopTyping();
        this.resetSize();
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
    // eslint-disable-next-line
    isTyping: debounce(function(e) {
      this.stopTyping();
    }, 2000),
    // Select an emoji from the emoji picker and append it to our message
    selectEmoji(emoji) {
      this.messageText += emoji.native;
      this.selectingEmoji = false;
    },
    autoGrow() {
      let messageBox = document.querySelector('.messageuser')
      let chatGroup = document.querySelector('.chat-group')

      messageBox.style.height = 'auto';
      if(messageBox.scrollHeight < 112) {
        messageBox.style.height = (messageBox.scrollHeight + 2)+"px";
        chatGroup.style.height = (messageBox.scrollHeight + 40)+"px";
      } else {
        messageBox.style.height = "112px";
        chatGroup.style.height = "152px";
      }
      messageBox.scrollTop = messageBox.scrollHeight;
    },
    resetSize() {
      let messageBox = document.querySelector('.messageuser')
      let chatGroup = document.querySelector('.chat-group')
      messageBox.style.height = "2.5rem";
      chatGroup.style.height = "5rem";
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Chatbar.less"></style>
