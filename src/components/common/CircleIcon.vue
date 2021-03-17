<template>
  <div class="circle-icon" v-on:click="actionHandler">
    <i class="fas fa-badge-check verified-badge" v-if="verified || isVerified(address)"></i>
    <div :class="`${bordered ? 'bordered-circle-icon' : 'non-bordered-circle-icon'} wrapper`">
      <span v-if="icon">
          <i :class="`${icon} icon`"></i>
      </span>
      <div v-if="image && image.trim() !== 'https://ipfs.io/ipfs/'" :class="`${bordered ? 'bordered' : 'cropped'}`">
        <jazzicon class="jazzicon" :address="address" :diameter="diameter || 45" />
        <img :src="image" :key="image">
      </div>
      <div v-else-if="address" :class="`${bordered ? 'bordered' : 'cropped'}`">
        <jazzicon class="jazzicon" :address="address" :diameter="diameter || 45" />
      </div>
    </div>
  </div>
</template>

<script>
import Jazzicon from 'vue-jazzicon';

import config from '@/config/config';

export default {
  name: 'CircleIcon',
  components: {
    [Jazzicon.name]: Jazzicon,
  },
  props: [
    'image',
    'color',
    'verified',
    'icon',
    'diameter',
    'bordered',
    'address',
    'action',
  ],
  methods: {
    actionHandler() {
      if (this.action) this.action();
    },
    isVerified(address) {
      return config.verified_addresses.includes(address);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .icon {
      padding-top: 27px;
      margin-top: -3px;
    }
    .verified-badge {
      position: absolute;
      right: -3px;
      z-index: 2;
      font-size: 14px;
    }
    .wrapper {
      border-radius: 50%;
      overflow: hidden;
    }
    .non-bordered-circle-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
    .bordered-circle-icon {
      padding: 2px;
      width: 100%;
      height: 100%;
      background: linear-gradient(270deg, #c500ff, #ff0036) !important;
    }
    .bordered {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      border-radius: 50%;
    }
    .cropped {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      border-radius: 50%;
    }
    .circle-icon {
      width: 45px;
      height: 45px;
      font-size: 16pt;
      text-align: center;
      border-radius: 50%;
      background: #00d0a1;
      margin: 0 auto;
      color: #fff;
      position: relative;
    }
    .circle-icon img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .jazzicon {
      width: 100%;
      height: 100%;
      top: 0;
    }
    #user-info > div.user-details > div > div > div {
      width: 100% !important;
      height: 100% !important;
    }

</style>
