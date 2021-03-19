<template>
  <div id="user-info"  v-touch:swipe="swipeHandler" v-touch-options="{touchHoldTolerance: 50}">
    <i class="fa fa-times close-btn" v-on:click="$store.commit('toggleUserInfo')"></i>
    <div class="heading">
      <span class="label">{{$t('conversation.userinfo.heading')}}</span>
      <span class="username">{{$store.state.friends.filter(f => f.address === $store.state.activeChat)[0].name}}</span>
    </div>
    <hr class="divider">
    <div class="user-details">
      <CircleIcon 
        :image="$store.state.friends.filter(f => f.address === $store.state.activeChat)[0].photo"
        :address="$store.state.activeChat" />
      <p class="username">
        {{$store.state.friends.filter(f => f.address === $store.state.activeChat)[0].name}}
      </p>
      <p class="address">
        {{$store.state.activeChat.substr(0, 12)}}...
      </p>
      <hr class="divider">
      <span class="label">{{$t('conversation.userinfo.badges')}}</span>
      <Badge :address="$store.state.activeChat" showNoBadges="true"/>
      <hr class="divider">
    </div>
    <div class="columns buttons">
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="messageUser($store.state.activeChat)">
          <i class="fas fa-comment-alt"></i>
        </button>
      </div>
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="makeCall($store.state.activeChat)">
          <i class="fas fa-phone-volume"></i>
        </button>
      </div>
      <div class="column is-one-third">
        <button
          class="button is-small is-primary"
          v-on:click="etherscan($store.state.activeChat)">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <div class="notes">
      <span class="label">{{$t('conversation.userinfo.notes')}}</span>
      <textarea class="textarea" :placeholder="$t('conversation.userinfo.notes_placeholder')" v-model="$store.state.userNotes[$store.state.activeChat]"></textarea>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/common/Badge';
import CircleIcon from '@/components/common/CircleIcon';
import config from '@/config/config';
import {getExplorerByNetwork} from "@/utils/EthereumProvider.ts"

export default {
  name: 'UserInfo',
  props: ['makeCall', 'toggle'],
  components: {
    CircleIcon,
    Badge,
  },
  methods: {
    /** @method
     * Wrap links in <a> tags
     * @name wrapLinks
     * @argument message string to wrap links in
     * @returns string value of formatted message
     */
    messageUser(user) {
      this.$store.commit('activeChat', user);
    },
    /** @method
     * Opens an etherscan link to the given address
     * @name etherscan
     * @argument address address to open to
     */
    etherscan(address) {
      window.open(`${getExplorerByNetwork(config.network.chain)}/address/${address}`);
    },
    isMobile() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    },
    swipeHandler(direction) {
      if (this.isMobile()){
        if (direction === "right"){
          this.$store.commit('toggleUserInfo');
        };
      };
     
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .close-btn {
    display: none;
  }
  #user-info {
    overflow-y: scroll;
    scrollbar-width: thin;
    padding: 0.5rem 1rem 1rem 1rem;
    width: 15rem;
    position: absolute;
    bottom: 2rem;
    top: 3rem;
    right: 0;

    .heading {
      width: 100%;
      line-height: 110%;
      .username {
        font-size: 8pt;
      }
      .label {
        padding: 0 !important;
      }
    }
    .user-details {
      margin-top: 1rem;
      text-align: center;
      .circle-icon {
        width: 75px;
        height: 75px;
        border-radius: 5px;
      }
      .username {
        margin-top: 1rem;
        font-size: 15pt;
      }
      .address {
        font-size: 10pt !important;
      }
    }
    .buttons {
      margin-top: 2rem;
      button {
        width: 100%;
      }
      .column {
        text-align: center;
      }
    }

    textarea {
      font-size: 10pt;
    }
  }
  .badge-container i {
    font-size: 18pt !important;
  }

  @media (max-width: 768px) {
    #user-info {
      width: 100%;
      z-index: 2;
    }
    .close-btn {
      display: inline-block;
      position: absolute;
      right: 1.5rem;
      top: 1rem;
    }
  }
</style>
