<template>
    <div class="pwa-install-prompt" v-if="showPWA">
      <img class="pwa-exit-btn" v-on:click="dontShowPrompt" src="static/img/icons/exit-btn.png">
      <div class="pwa-install-prompt-body">
        <div class="pwa-img-wrapper"><img class="pwa-img" src="static/img/icons/apple-touch-icon.png"></div>
        <div class="pwa-header-text">Install Satellite</div>
        <p class="pwa-body-text">Install Satellite on your homescreen for easy access to your favorite privacy driven chat network</p>
        <!-- Android -->
        <div class="pwa-footer" v-if="mobileType() == '/Android/i'">Just tap <img src="static/img/icons/android-pwa-icon.jpg" class="pwa-homescreen-icon"> (Chrome) <br> then 'Add to homescreen'</div>
        <!-- IOS -->
        <div class="pwa-footer" v-if="(mobileType() == '/iPhone/i') || (mobileType() == '/iPad/i') || (mobileType() == '/iPod/i')">Just tap <img src="static/img/icons/apple-share-icon.png" class="pwa-homescreen-icon"> (Safari) <br> then 'Add to homescreen'</div>
        <!-- Windows Phone -->
        <div class="pwa-footer" v-if="(mobileType() == '/Windows Phone/i')">Just tap <img src="static/img/icons/microsoft-edge-share-icon.png" class="pwa-homescreen-icon"> (Edge) <br> then 'Add to screen'</div>
        <!-- Unknown Device -->
        <div class="pwa-footer" v-if="mobileType() == undefined">We\'re unsure of you're devices type, search for "How to install PWA apps on [your device]" for instructions if you're interested in downloading our app</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'PWAInstallPrompt',
  mounted() {
  },
  data() {
    return {
      showPWA: (!localStorage.getItem('dontShowPWA') && this.isMobile())
    }
  },
  methods: {
    // Returns if user device is mobile
    isMobile() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
    // Returns users device type
    mobileType() {
      // To be added: /BlackBerry/i, /webOS/i
      let toMatch = [ /Android/i, /iPhone/i, /iPad/i, /iPod/i, /Windows Phone/i ];
      let match
      toMatch.some((toMatchItem) => {
        if (navigator.userAgent.match(toMatchItem)) {
          match = toMatchItem.toString()
        }
      });
      return match
    },
    // Stop from continuously showing prompt to user
    dontShowPrompt() {
      localStorage.setItem('dontShowPWA', true);
      this.showPWA = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .pwa-install-prompt {
    position: fixed;
    top: 15%;
    width: 90%;
    margin: 5%;
    z-index: 5;
    display: flex;
    flex-direction: column;
    // border: 1px solid rgb(255, 143, 79);
    .pwa-install-prompt-body {
      background-color: rgb(24, 24, 24);
      border-radius: 8px;
    }
    .pwa-exit-btn {
      position: relative;
      width: 24px;
      margin: 12px;
      align-self: flex-end;
    }
    .pwa-img-wrapper {
      // border: 1px solid rgb(43, 99, 255);
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 32px 0px 12px 0px;
      img {
        width: 25%;
      }
    }
    .pwa-header-text {
      // border: 1px solid rgb(91, 255, 91);
      text-align: center;
      font-size: 32px;
      font-weight: bold;
    }
    .pwa-body-text {
      // border: 1px solid rgb(218, 255, 53);
      text-align: center;
      padding: 10px 8% 25px 8%;
      font-size: 16px;
    }
    .pwa-footer {
      // border: 1px solid rgb(235, 17, 255);
      text-align: center;
      padding: 10px;
      background-color: rgb(18, 18, 18);
      border-radius: 0px 0px 8px 8px;
      img {
        width: 15px;
        margin: 0px 8px;
      }
    }
  }
</style>